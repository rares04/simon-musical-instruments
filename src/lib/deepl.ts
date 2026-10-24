import * as deepl from 'deepl-node'

// Locales that need translation (excluding English which is the source)
export const TRANSLATABLE_LOCALES = ['ro', 'de', 'fr', 'nl', 'ja', 'ko', 'el'] as const
export type TranslatableLocale = (typeof TRANSLATABLE_LOCALES)[number]

// Name prefix of the luthier glossary that scripts/backfill-translations.ts loads into DeepL.
export const GLOSSARY_PREFIX = 'simon-luthier'

let client: deepl.DeepLClient | null = null
let glossary: Promise<deepl.MultilingualGlossaryInfo | null> | null = null

function getClient(): deepl.DeepLClient {
  if (!client) {
    const apiKey = process.env.DEEPL_API_KEY
    if (!apiKey) {
      throw new Error('DEEPL_API_KEY environment variable is not set')
    }
    client = new deepl.DeepLClient(apiKey)
  }
  return client
}

/** The luthier glossary, if one exists. Looked up once per process. */
function getGlossary(): Promise<deepl.MultilingualGlossaryInfo | null> {
  glossary ??= getClient()
    .listMultilingualGlossaries()
    .then((all) => all.find((g) => g.name.startsWith(GLOSSARY_PREFIX)) ?? null)
    .catch(() => null)
  return glossary
}

async function translate(
  texts: string[],
  locale: TranslatableLocale,
  retry = true,
): Promise<deepl.TextResult[]> {
  const g = await getGlossary()
  const useGlossary = g?.dictionaries.some((d) => d.targetLangCode === locale) ? g : undefined
  try {
    return await getClient().translateText(texts, 'en', locale as deepl.TargetLanguageCode, {
      preserveFormatting: true,
      formality: 'prefer_more',
      ...(useGlossary ? { glossary: useGlossary } : {}),
    })
  } catch (error) {
    // The glossary may have been replaced since it was cached. Look it up again once.
    if (useGlossary && retry) {
      glossary = null
      return translate(texts, locale, false)
    }
    throw error
  }
}

/**
 * Translate texts from English to a target locale. Empty texts stay empty.
 *
 * Throws on any DeepL error, so callers never save the English text as a translation.
 */
export async function translateTexts(
  texts: string[],
  targetLocale: TranslatableLocale,
): Promise<string[]> {
  const indices = texts.flatMap((text, i) => (text && text.trim() !== '' ? [i] : []))
  if (indices.length === 0) {
    return texts
  }
  const results = await translate(
    indices.map((i) => texts[i]),
    targetLocale,
  )
  const translated = [...texts]
  indices.forEach((originalIndex, n) => {
    translated[originalIndex] = results[n].text
  })
  return translated
}
