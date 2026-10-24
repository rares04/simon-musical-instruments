import { WOODS } from './categories'
import type { InstrumentType } from './schema'

/**
 * Instrument URL slugs (docs/seo/technical-spec.md §2.1):
 * `{type}-{model}-{year}-{back wood}`, e.g. `cello-stradivari-davidoff-2025-flamed-alder`.
 * If Paul numbers his instruments (P-21), the number replaces the wood: `…-2024-no-12`.
 * Pure functions only. Wiring into the collection, `previousSlugs` and the backfill are B2 and
 * wait for the migration lock.
 */

const TYPE_WORD: Record<InstrumentType, string> = {
  violin: 'violin',
  viola: 'viola',
  cello: 'cello',
  contrabass: 'double-bass',
}

/** Lowercase ASCII words joined by hyphens: "Ș Gamba Vivală!" → "s-gamba-vivala". */
export function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const SPECIES: Record<(typeof WOODS)[number], RegExp> = {
  maple: /\bmap+le\b/i,
  alder: /\balder\b/i,
  ash: /\bash\b/i,
  poplar: /\bpoplar\b/i,
}

/** "Very well wild flamed romanian maple" → "flamed-maple"; "bird-eye maple" → "birdseye-maple". */
export function woodDescriptor(bodyWood: string | null | undefined): string | null {
  const text = bodyWood ?? ''
  const species = WOODS.find((w) => SPECIES[w].test(text))
  if (!species) return null
  const figure = /bird[\s-]*'?s?[\s-]*eye/i.test(text)
    ? 'birdseye'
    : /quilt/i.test(text)
      ? 'quilted'
      : /flam/i.test(text)
        ? 'flamed'
        : null
  return [figure, species].filter(Boolean).join('-')
}

export type SlugInput = {
  instrumentType: InstrumentType
  title?: string | null
  model?: string | null
  year?: number | null
  specs?: { bodyWood?: string | null } | null
  /** Paul's own instrument number, if he numbers them (P-21). */
  number?: string | number | null
}

export function instrumentSlug(i: SlugInput): string {
  const fiveString = i.instrumentType === 'contrabass' && /\b5[\s-]*strings?\b/i.test(i.title ?? '')
  const parts = [
    TYPE_WORD[i.instrumentType],
    fiveString ? '5-string' : null,
    i.model ? slugify(i.model) : null,
    i.year ? String(i.year) : null,
    i.number != null && String(i.number).trim()
      ? `no-${slugify(String(i.number))}`
      : woodDescriptor(i.specs?.bodyWood),
  ]
  return parts.filter(Boolean).join('-')
}

/** `base`, or `base-2`, `base-3`… when the slug is taken. */
export function uniqueSlug(base: string, taken: ReadonlySet<string>): string {
  if (!taken.has(base)) return base
  for (let n = 2; ; n++) {
    const candidate = `${base}-${n}`
    if (!taken.has(candidate)) return candidate
  }
}
