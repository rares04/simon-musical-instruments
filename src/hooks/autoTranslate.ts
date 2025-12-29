import type { CollectionAfterChangeHook } from 'payload'
import { translateTexts, TRANSLATABLE_LOCALES } from '@/lib/deepl'

/**
 * Auto-translate localized fields after saving in English
 * This hook translates title and luthierNotes to all other locales
 */
export const autoTranslateInstrument: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  context,
}) => {
  // Skip if this is a translation update (to prevent infinite loop)
  if (context?.skipAutoTranslate) {
    return doc
  }

  // Only translate when saving in English locale (or no locale = default)
  const currentLocale = req.locale || 'en'
  if (currentLocale !== 'en') {
    return doc
  }

  // Only translate on create or when English content changes
  if (operation !== 'create' && operation !== 'update') {
    return doc
  }

  // Check if DEEPL_API_KEY is set
  if (!process.env.DEEPL_API_KEY) {
    console.log('⚠️ DEEPL_API_KEY not set, skipping auto-translation')
    return doc
  }

  const { payload } = req
  const title = doc.title as string | undefined
  const luthierNotes = doc.luthierNotes as string | undefined

  // Only proceed if we have content to translate
  if (!title && !luthierNotes) {
    return doc
  }

  console.log(`🌍 Auto-translating instrument: ${title || doc.id}`)

  // Translate to each locale
  for (const locale of TRANSLATABLE_LOCALES) {
    try {
      // Batch translate both fields at once for efficiency
      const textsToTranslate = [title || '', luthierNotes || '']
      const translatedTexts = await translateTexts(textsToTranslate, locale)

      const updateData: Record<string, string> = {}

      if (title && translatedTexts[0]) {
        updateData.title = translatedTexts[0]
      }
      if (luthierNotes && translatedTexts[1]) {
        updateData.luthierNotes = translatedTexts[1]
      }

      if (Object.keys(updateData).length > 0) {
        await payload.update({
          collection: 'instruments',
          id: doc.id,
          locale: locale,
          data: updateData,
          context: {
            skipAutoTranslate: true, // Prevent recursive translation
          },
        })
        console.log(`   ✅ Translated to ${locale.toUpperCase()}`)
      }
    } catch (error) {
      console.error(`   ❌ Failed to translate to ${locale}:`, error)
    }
  }

  console.log(`🎉 Auto-translation complete for: ${title || doc.id}`)
  return doc
}
