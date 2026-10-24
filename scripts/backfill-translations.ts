/**
 * Backfill DeepL translations of instrument `title` and `luthierNotes` (known issue K-4).
 *
 * Two steps, so a person can review the text before it reaches the site:
 *
 *   pnpm tsx scripts/backfill-translations.ts review --out <file.json> [--locales ro,de]
 *     [--glossary docs/seo/translation-glossary.md] [--overwrite]
 *   pnpm tsx scripts/backfill-translations.ts apply --in <file.json> [--dry-run]
 *
 * review  Reads every instrument, asks DeepL for each missing translation and writes the proposals
 *         to <file.json>, plus <file.md> for reading. Never writes to the database.
 * apply   Writes exactly the reviewed proposals. Skips an instrument whose English text changed
 *         after the review, and a field someone translated by hand in the meantime.
 *
 * A translation counts as missing when it is empty or identical to the English text. Text that
 * differs from English was written by hand and is kept, unless `--overwrite` is passed.
 *
 * `--glossary` reads the Terms table of a Markdown glossary and loads it into DeepL (one glossary
 * per language, reused across runs), so luthier terms come out right.
 *
 * Always run with NODE_ENV=production, so Payload never pushes schema changes to the database.
 * `--mock` fakes DeepL (no key needed) to test the pipeline on a local database; apply refuses a
 * mock file unless `--allow-mock` is passed.
 */
import 'dotenv/config'
import crypto from 'crypto'
import fs from 'fs'
import * as deepl from 'deepl-node'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { GLOSSARY_PREFIX, TRANSLATABLE_LOCALES } from '../src/lib/deepl'

type Locale = (typeof TRANSLATABLE_LOCALES)[number]
type Field = 'title' | 'luthierNotes'
type Localized = Partial<Record<'en' | Locale, string | null>>

const FIELDS: Field[] = ['title', 'luthierNotes']
const DEEPL_BATCH = 50

type Proposal = {
  id: number | string
  slug: string
  sourceHash: string
  locale: Locale
  field: Field
  english: string
  current: string | null
  proposed: string
  reason: 'missing' | 'same-as-english' | 'overwrite'
}

type ReviewFile = {
  createdAt: string
  mock: boolean
  overwrite: boolean
  characters: number
  glossaries: Partial<Record<Locale, Record<string, string>>>
  proposals: Proposal[]
}

type InstrumentText = { id: number | string; slug: string; fields: Record<Field, Localized> }

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : undefined
}

function flag(name: string): boolean {
  return process.argv.includes(`--${name}`)
}

function sourceHash(item: InstrumentText): string {
  const english = FIELDS.map((f) => item.fields[f].en ?? '')
  return crypto.createHash('sha256').update(JSON.stringify(english)).digest('hex').slice(0, 16)
}

function needsTranslation(english: string, current: string | null | undefined, overwrite: boolean) {
  if (!english.trim()) return null
  if (!current || !current.trim()) return 'missing' as const
  if (current.trim() === english.trim()) return 'same-as-english' as const
  return overwrite ? ('overwrite' as const) : null
}

async function loadInstruments(): Promise<InstrumentText[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'instruments',
    locale: 'all',
    depth: 0,
    pagination: false,
    overrideAccess: true,
  })
  return docs.map((doc) => {
    const raw = doc as unknown as Record<string, unknown>
    return {
      id: doc.id,
      slug: String(raw.slug ?? doc.id),
      fields: {
        title: (raw.title ?? {}) as Localized,
        luthierNotes: (raw.luthierNotes ?? {}) as Localized,
      },
    }
  })
}

/**
 * Reads the "Terms" table of a glossary file (| English | Romanian | German | … |) into
 * entries per locale. Uses the first alternative in a cell ("față / capac" → "față"), drops the
 * `?` review markers and parenthetical hints, and skips pattern rows like "model (after X)".
 */
function parseGlossary(path: string): Partial<Record<Locale, Record<string, string>>> {
  const columns: Record<string, Locale> = {
    romanian: 'ro',
    german: 'de',
    french: 'fr',
    dutch: 'nl',
    japanese: 'ja',
    korean: 'ko',
    greek: 'el',
  }
  const rows = fs
    .readFileSync(path, 'utf8')
    .split('\n')
    .filter((l) => l.trim().startsWith('|') && !/^\|\s*-/.test(l.trim()))
    .map((l) =>
      l
        .trim()
        .replace(/^\||\|$/g, '')
        .split('|')
        .map((c) => c.trim()),
    )
  const header = rows.shift()?.map((h) => h.toLowerCase()) ?? []
  const result: Partial<Record<Locale, Record<string, string>>> = {}
  for (const row of rows) {
    if (/\(after /i.test(row[0])) continue
    const source = row[0].replace(/\(.*?\)/g, '').trim()
    if (!source) continue
    header.forEach((name, i) => {
      const locale = columns[name]
      if (!locale || !row[i]) return
      const target = row[i]
        .replace(/`\?`/g, '')
        .split(' / ')[0]
        .replace(/\(.*?\)/g, '')
        .trim()
      if (target) result[locale] = { ...(result[locale] ?? {}), [source]: target }
    })
  }
  return result
}

/**
 * Returns one multilingual DeepL glossary holding a dictionary per locale. The Free plan allows a
 * single glossary, so an outdated one created by this script is deleted and replaced. Glossaries
 * with other names are never touched.
 */
async function ensureGlossary(
  client: deepl.DeepLClient,
  byLocale: Partial<Record<Locale, Record<string, string>>>,
): Promise<deepl.MultilingualGlossaryInfo | undefined> {
  const locales = Object.keys(byLocale).sort() as Locale[]
  if (locales.length === 0) return undefined
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(byLocale))
    .digest('hex')
    .slice(0, 8)
  const name = `${GLOSSARY_PREFIX}-${hash}`
  const ours = (await client.listMultilingualGlossaries()).filter((g) =>
    g.name.startsWith(GLOSSARY_PREFIX),
  )
  const current = ours.find((g) => g.name === name)
  if (current) return current
  for (const old of ours) await client.deleteMultilingualGlossary(old)
  return client.createMultilingualGlossary(
    name,
    locales.map((locale) => ({
      sourceLangCode: 'en',
      targetLangCode: locale,
      entries: new deepl.GlossaryEntries({ entries: byLocale[locale] }),
    })),
  )
}

async function translateAll(
  texts: string[],
  locale: Locale,
  mock: boolean,
  glossary?: deepl.MultilingualGlossaryInfo,
): Promise<string[]> {
  if (mock) return texts.map((t) => `[${locale}] ${t}`)
  const translator = new deepl.DeepLClient(process.env.DEEPL_API_KEY as string)
  const out: string[] = []
  for (let i = 0; i < texts.length; i += DEEPL_BATCH) {
    const results = await translator.translateText(
      texts.slice(i, i + DEEPL_BATCH),
      'en',
      locale as deepl.TargetLanguageCode,
      { preserveFormatting: true, formality: 'prefer_more', ...(glossary ? { glossary } : {}) },
    )
    out.push(...results.map((r) => r.text))
  }
  return out
}

function toMarkdown(file: ReviewFile): string {
  const lines = [
    `# Translation review (${file.createdAt})`,
    '',
    `${file.proposals.length} proposals, ${file.characters} source characters.` +
      (file.mock ? ' **MOCK: not real translations.**' : ''),
    '',
  ]
  for (const locale of TRANSLATABLE_LOCALES) {
    const rows = file.proposals.filter((p) => p.locale === locale)
    if (rows.length === 0) continue
    const glossary = file.glossaries[locale]
    lines.push(`## ${locale.toUpperCase()} (${rows.length})`, '')
    lines.push(
      glossary
        ? `Glossary (${Object.keys(glossary).length} terms): ` +
            Object.entries(glossary)
              .map(([en, t]) => `${en} → ${t}`)
              .join(' · ')
        : 'No glossary.',
      '',
    )
    for (const p of rows) {
      lines.push(`### ${p.slug} · ${p.field} (${p.reason})`, '')
      lines.push(`> **EN:** ${p.english.replace(/\n/g, '\n> ')}`, '')
      lines.push(`> **${locale.toUpperCase()}:** ${p.proposed.replace(/\n/g, '\n> ')}`, '')
    }
  }
  return lines.join('\n')
}

async function review() {
  const out = arg('out')
  if (!out) throw new Error('review needs --out <file.json>')
  const mock = flag('mock')
  const overwrite = flag('overwrite')
  if (!mock && !process.env.DEEPL_API_KEY) throw new Error('DEEPL_API_KEY is not set')
  const locales = (arg('locales')?.split(',') ?? [...TRANSLATABLE_LOCALES]) as Locale[]
  for (const l of locales) {
    if (!TRANSLATABLE_LOCALES.includes(l)) throw new Error(`Unknown locale: ${l}`)
  }

  const instruments = await loadInstruments()
  const pending: Omit<Proposal, 'proposed'>[] = []
  for (const item of instruments) {
    const hash = sourceHash(item)
    for (const locale of locales) {
      for (const field of FIELDS) {
        const english = item.fields[field].en ?? ''
        const current = item.fields[field][locale] ?? null
        const reason = needsTranslation(english, current, overwrite)
        if (reason) {
          pending.push({
            id: item.id,
            slug: item.slug,
            sourceHash: hash,
            locale,
            field,
            english,
            current,
            reason,
          })
        }
      }
    }
  }

  const characters = pending.reduce((n, p) => n + p.english.length, 0)
  console.log(
    `${instruments.length} instruments, ${pending.length} missing translations, ${characters} characters`,
  )

  if (!mock && pending.length > 0) {
    const usage = await new deepl.Translator(process.env.DEEPL_API_KEY as string).getUsage()
    const c = usage.character
    if (c) {
      const left = c.limit - c.count
      console.log(`DeepL quota: ${c.count}/${c.limit} used, ${left} left`)
      if (characters > left) throw new Error(`Needs ${characters} characters, only ${left} left`)
    }
  }

  const glossaryPath = arg('glossary')
  const all = glossaryPath ? parseGlossary(glossaryPath) : {}
  const glossaries = Object.fromEntries(
    Object.entries(all).filter(([l]) => locales.includes(l as Locale)),
  ) as ReviewFile['glossaries']
  const glossary = mock
    ? undefined
    : await ensureGlossary(new deepl.DeepLClient(process.env.DEEPL_API_KEY as string), glossaries)

  const file: ReviewFile = {
    createdAt: new Date().toISOString(),
    mock,
    overwrite,
    characters,
    glossaries,
    proposals: [],
  }
  const md = out.replace(/\.json$/, '') + '.md'
  // Saved after every locale, so a failure part-way never wastes the translations already paid for.
  const save = () => {
    fs.writeFileSync(out, JSON.stringify(file, null, 2))
    fs.writeFileSync(md, toMarkdown(file))
  }

  for (const locale of locales) {
    const rows = pending.filter((p) => p.locale === locale)
    if (rows.length === 0) continue
    const useGlossary = glossaries[locale] ? glossary : undefined
    const translated = await translateAll(
      rows.map((r) => r.english),
      locale,
      mock,
      useGlossary,
    )
    rows.forEach((r, i) => file.proposals.push({ ...r, proposed: translated[i] }))
    save()
    console.log(
      `  ${locale}: ${rows.length} texts` +
        (useGlossary ? `, glossary ${Object.keys(glossaries[locale] ?? {}).length} terms` : ''),
    )
  }
  save()
  console.log(`Wrote ${out} and ${md}. Nothing was written to the database.`)
}

async function apply() {
  const input = arg('in')
  if (!input) throw new Error('apply needs --in <file.json>')
  const dryRun = flag('dry-run')
  const file = JSON.parse(fs.readFileSync(input, 'utf8')) as ReviewFile
  if (file.mock && !flag('allow-mock'))
    throw new Error('This is a mock file. Pass --allow-mock to apply it')

  const instruments = new Map((await loadInstruments()).map((i) => [String(i.id), i]))
  const payload = await getPayload({ config })
  let written = 0
  let skipped = 0

  const groups = new Map<string, Proposal[]>()
  for (const p of file.proposals) {
    const key = `${p.id}|${p.locale}`
    groups.set(key, [...(groups.get(key) ?? []), p])
  }

  for (const [key, rows] of groups) {
    const [id, locale] = key.split('|') as [string, Locale]
    const item = instruments.get(id)
    if (!item) {
      console.warn(`skip ${id}: instrument no longer exists`)
      skipped += rows.length
      continue
    }
    if (sourceHash(item) !== rows[0].sourceHash) {
      console.warn(`skip ${item.slug}: English text changed since the review`)
      skipped += rows.length
      continue
    }
    const data: Partial<Record<Field, string>> = {}
    for (const p of rows) {
      const still = needsTranslation(p.english, item.fields[p.field][locale], file.overwrite)
      if (!still) {
        console.warn(`skip ${item.slug} ${locale} ${p.field}: translated by hand since the review`)
        skipped++
        continue
      }
      data[p.field] = p.proposed
    }
    if (Object.keys(data).length === 0) continue
    console.log(
      `${dryRun ? 'would write' : 'write'} ${item.slug} ${locale}: ${Object.keys(data).join(', ')}`,
    )
    if (!dryRun) {
      await payload.update({
        collection: 'instruments',
        id: item.id,
        locale,
        data,
        overrideAccess: true,
        context: { skipAutoTranslate: true },
      })
    }
    written += Object.keys(data).length
  }
  console.log(`${dryRun ? 'Dry run: would write' : 'Wrote'} ${written} fields, skipped ${skipped}`)
}

async function main() {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error('Run with NODE_ENV=production so Payload never pushes schema changes')
  }
  const command = process.argv[2]
  if (command === 'review') await review()
  else if (command === 'apply') await apply()
  else throw new Error('Usage: backfill-translations.ts review|apply (see the header comment)')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
