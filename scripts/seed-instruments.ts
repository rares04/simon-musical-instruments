import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const instruments = [
  {
    title: 'Professional Concert Violin',
    instrumentType: 'violin' as const,
    status: 'available' as const,
    price: 3500,
    year: 2024,
    image: 'professional-violin-front-view-on-white-background.jpg',
    luthierNotes:
      "This violin represents the culmination of traditional Transylvanian craftsmanship. The spruce top was selected from wood that began its natural curing process in 2001, allowing it to develop exceptional resonance properties. The maple back and sides provide brilliant projection while maintaining warmth. Each layer of varnish was hand-applied and allowed to cure naturally over several months, creating a finish that enhances rather than dampens the wood's natural voice. The instrument produces a warm, singing tone with excellent clarity across all registers, making it ideal for both solo and orchestral performance.",
    specs: {
      bodyWood: 'Maple',
      topWood: 'European Spruce (cured since 2001)',
      neckWood: 'Maple',
      fingerboardWood: 'Ebony',
      varnish: 'Traditional oil-based, hand-applied',
      strings: 'Dominant with Gold E',
      bodyLength: '356mm',
    },
  },
  {
    title: 'Master Series Cello',
    instrumentType: 'cello' as const,
    status: 'available' as const,
    price: 8500,
    year: 2023,
    image: 'professional-cello-front-view-warm-wood.jpg',
    luthierNotes:
      "The Master Series Cello is a pinnacle achievement in our workshop. Crafted from premium Alpine spruce and flamed maple that has been naturally curing since 2001, this instrument offers unparalleled depth and resonance. The wood's extended aging has allowed the cellular structure to stabilize and open up, resulting in a voice that is both powerful and nuanced. The varnish was applied in thin layers over several months, each coat hand-rubbed and allowed to cure completely. This patient process creates a finish that protects the wood while allowing it to vibrate freely, producing a sound rich in overtones and capable of filling concert halls with effortless projection.",
    specs: {
      bodyWood: 'Flamed Maple',
      topWood: 'Alpine Spruce (aged since 2001)',
      neckWood: 'Maple',
      fingerboardWood: 'Ebony',
      varnish: 'Traditional oil-based, hand-applied',
      strings: 'Larsen A&D, Spirocore G&C',
      bodyLength: '755mm',
    },
  },
  {
    title: 'Studio Violin No. 47',
    instrumentType: 'violin' as const,
    status: 'sold' as const,
    price: 2200,
    year: 2024,
    image: 'violin-craftsmanship-warm-lighting.jpg',
    luthierNotes:
      'Studio Violin No. 47 was crafted for the advancing student or professional seeking excellent quality at an accessible price point. The instrument features our signature warm tone with surprising projection for its class. The carefully selected spruce and maple were aged naturally in our workshop, and the traditional varnish application gives it a beautiful golden-amber appearance. This violin has found its home with a promising young soloist in Vienna.',
    specs: {
      bodyWood: 'Maple',
      topWood: 'Spruce',
      neckWood: 'Maple',
      fingerboardWood: 'Ebony',
      varnish: 'Traditional oil-based',
      strings: 'Dominant',
      bodyLength: '356mm',
    },
  },
  {
    title: 'Grand Contrabass',
    instrumentType: 'contrabass' as const,
    status: 'available' as const,
    price: 12000,
    year: 2023,
    image: 'double-bass-contrabass-full-view.jpg',
    luthierNotes:
      'Our Grand Contrabass is designed for the professional orchestral musician who demands both power and refinement. The willow back and sides provide exceptional resonance while keeping the weight manageable for extended playing. The European spruce top has been carefully graduated to produce a full-bodied sound with exceptional clarity in the upper registers. This instrument excels in both arco and pizzicato playing, making it equally suited for classical orchestral work and jazz performance.',
    specs: {
      bodyWood: 'Willow',
      topWood: 'European Spruce',
      neckWood: 'Maple',
      fingerboardWood: 'Ebony',
      varnish: 'Traditional oil-based, hand-applied',
      strings: 'Spirocore',
      bodyLength: '1120mm (3/4 size)',
    },
  },
  {
    title: 'Chamber Viola',
    instrumentType: 'viola' as const,
    status: 'available' as const,
    price: 4200,
    year: 2024,
    image: 'viola-instrument-wood-grain.jpg',
    luthierNotes:
      'The Chamber Viola was designed specifically for the demands of intimate ensemble playing while maintaining the projection needed for solo work. At 15.5 inches, it offers a comfortable playing experience without sacrificing the deep, rich tone that defines a fine viola. The flamed maple back showcases exceptional figure, and the spruce top responds beautifully across all dynamics. This instrument particularly excels in the middle register, producing the warm, vocal quality that chamber musicians prize.',
    specs: {
      bodyWood: 'Flamed Maple',
      topWood: 'Spruce',
      neckWood: 'Maple',
      fingerboardWood: 'Ebony',
      varnish: 'Traditional oil-based',
      strings: 'Dominant',
      bodyLength: '394mm (15.5")',
    },
  },
  {
    title: 'Heritage Violin No. 23',
    instrumentType: 'violin' as const,
    status: 'sold' as const,
    price: 5800,
    year: 2022,
    image: 'vintage-violin-detailed-craftsmanship.jpg',
    luthierNotes:
      "Heritage Violin No. 23 represents our finest work, featuring exceptional bird's eye maple and Italian spruce sourced from the Dolomites. This instrument was two years in the making, with extended aging between each stage of construction. The result is a violin with extraordinary tonal complexity—bright and focused for solo passages, yet warm and blending for ensemble work. It was awarded First Prize at the 2022 Romanian Luthier Competition and now resides with a concertmaster in Bucharest.",
    specs: {
      bodyWood: "Bird's Eye Maple",
      topWood: 'Italian Spruce (Dolomites)',
      neckWood: 'Maple',
      fingerboardWood: 'Ebony',
      varnish: 'Traditional oil-based, antiqued finish',
      strings: 'Evah Pirazzi Gold',
      bodyLength: '356mm',
    },
  },
  {
    title: 'Professional Cello No. 12',
    instrumentType: 'cello' as const,
    status: 'available' as const,
    price: 6500,
    year: 2024,
    image: 'cello-dark-wood-professional.jpg',
    luthierNotes:
      'Professional Cello No. 12 was built for the working musician who needs a reliable, beautiful-sounding instrument for daily performance. The European maple and Carpathian spruce combination produces a balanced tone across all registers, with particular strength in the singing upper positions. The traditional varnish has a warm amber color that will continue to develop character with years of playing. This cello responds equally well to aggressive bow strokes and the most delicate pianissimo.',
    specs: {
      bodyWood: 'European Maple',
      topWood: 'Carpathian Spruce',
      neckWood: 'Maple',
      fingerboardWood: 'Ebony',
      varnish: 'Traditional oil-based, hand-applied',
      strings: 'Larsen',
      bodyLength: '755mm',
    },
  },
  {
    title: 'Concert Contrabass',
    instrumentType: 'contrabass' as const,
    status: 'sold' as const,
    price: 9800,
    year: 2023,
    image: 'upright-bass-concert-hall.jpg',
    luthierNotes:
      'The Concert Contrabass was commissioned by a principal bassist of a major European orchestra and built to their specifications. The combination of willow body and Engelmann spruce top produces exceptional clarity even in the lowest registers, with powerful projection that cuts through a full orchestra. After two years of heavy professional use, the instrument has developed even greater complexity and depth. This bass has found a new home with an orchestral musician in Germany.',
    specs: {
      bodyWood: 'Willow',
      topWood: 'Engelmann Spruce',
      neckWood: 'Maple',
      fingerboardWood: 'Ebony',
      varnish: 'Traditional oil-based',
      strings: 'Spirocore Solo',
      bodyLength: '1120mm (3/4 size)',
    },
  },
]

async function seed() {
  console.log('🌱 Starting seed...')

  const payload = await getPayload({ config })

  // Delete existing data for fresh seed (order matters due to foreign keys)
  console.log('🗑️  Clearing existing data...')

  // Delete orders first (they reference instruments)
  const existingOrders = await payload.find({
    collection: 'orders',
    limit: 100,
  })

  for (const order of existingOrders.docs) {
    await payload.delete({
      collection: 'orders',
      id: order.id,
    })
  }
  console.log(`   Deleted ${existingOrders.docs.length} orders`)

  // Then delete instruments
  const existingInstruments = await payload.find({
    collection: 'instruments',
    limit: 100,
  })

  for (const instrument of existingInstruments.docs) {
    await payload.delete({
      collection: 'instruments',
      id: instrument.id,
    })
  }
  console.log(`   Deleted ${existingInstruments.docs.length} instruments`)

  // Finally delete media
  const existingMedia = await payload.find({
    collection: 'media',
    limit: 100,
  })

  for (const media of existingMedia.docs) {
    await payload.delete({
      collection: 'media',
      id: media.id,
    })
  }
  console.log(`   Deleted ${existingMedia.docs.length} media files`)

  const publicDir = path.resolve(__dirname, '../public')

  for (const instrument of instruments) {
    console.log(`📦 Creating: ${instrument.title}`)

    // Upload the image first
    const imagePath = path.join(publicDir, instrument.image)

    if (!fs.existsSync(imagePath)) {
      console.log(`   ⚠️ Image not found: ${instrument.image}, skipping...`)
      continue
    }

    // Read the file
    const fileBuffer = fs.readFileSync(imagePath)
    const file = {
      name: instrument.image,
      data: fileBuffer,
      mimetype: 'image/jpeg',
      size: fileBuffer.length,
    }

    // Create media
    const media = await payload.create({
      collection: 'media',
      data: {
        alt: instrument.title,
      },
      file,
    })

    console.log(`   📷 Uploaded image: ${media.id}`)

    // Create instrument
    await payload.create({
      collection: 'instruments',
      data: {
        title: instrument.title,
        instrumentType: instrument.instrumentType,
        status: instrument.status,
        price: instrument.price,
        year: instrument.year,
        mainImage: media.id,
        luthierNotes: instrument.luthierNotes,
        specs: instrument.specs,
      },
    })

    console.log(`   ✅ Created instrument`)
  }

  console.log('\n🎉 Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
