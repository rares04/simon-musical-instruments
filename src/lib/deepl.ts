import * as deepl from 'deepl-node'

// DeepL language codes mapping
const DEEPL_LANG_MAP: Record<string, deepl.TargetLanguageCode> = {
  ro: 'ro',
  de: 'de',
  fr: 'fr',
  nl: 'nl',
  ja: 'ja',
  ko: 'ko',
  el: 'el',
} as const

// Locales that need translation (excluding English which is the source)
export const TRANSLATABLE_LOCALES = ['ro', 'de', 'fr', 'nl', 'ja', 'ko', 'el'] as const

let translator: deepl.Translator | null = null

function getTranslator(): deepl.Translator {
  if (!translator) {
    const apiKey = process.env.DEEPL_API_KEY
    if (!apiKey) {
      throw new Error('DEEPL_API_KEY environment variable is not set')
    }
    translator = new deepl.Translator(apiKey)
  }
  return translator
}

/**
 * Translate text from English to a target locale using DeepL
 */
export async function translateText(text: string, targetLocale: string): Promise<string> {
  if (!text || text.trim() === '') {
    return text
  }

  const deeplLang = DEEPL_LANG_MAP[targetLocale]
  if (!deeplLang) {
    console.warn(`No DeepL language mapping for locale: ${targetLocale}`)
    return text
  }

  try {
    const translator = getTranslator()
    const result = await translator.translateText(text, 'en', deeplLang)
    return result.text
  } catch (error) {
    console.error(`DeepL translation error for ${targetLocale}:`, error)
    // Return original text if translation fails
    return text
  }
}

/**
 * Translate multiple texts to a target locale (batch operation)
 */
export async function translateTexts(texts: string[], targetLocale: string): Promise<string[]> {
  const deeplLang = DEEPL_LANG_MAP[targetLocale]
  if (!deeplLang) {
    console.warn(`No DeepL language mapping for locale: ${targetLocale}`)
    return texts
  }

  // Filter out empty texts and keep track of indices
  const nonEmptyIndices: number[] = []
  const nonEmptyTexts: string[] = []

  texts.forEach((text, index) => {
    if (text && text.trim() !== '') {
      nonEmptyIndices.push(index)
      nonEmptyTexts.push(text)
    }
  })

  if (nonEmptyTexts.length === 0) {
    return texts
  }

  try {
    const translator = getTranslator()
    const results = await translator.translateText(nonEmptyTexts, 'en', deeplLang)

    // Reconstruct the array with translations in correct positions
    const translatedTexts = [...texts]
    const resultArray = Array.isArray(results) ? results : [results]

    nonEmptyIndices.forEach((originalIndex, resultIndex) => {
      translatedTexts[originalIndex] = resultArray[resultIndex].text
    })

    return translatedTexts
  } catch (error) {
    console.error(`DeepL batch translation error for ${targetLocale}:`, error)
    return texts
  }
}
