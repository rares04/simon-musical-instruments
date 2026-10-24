/**
 * Public facts about the workshop, used by structured data and `llms.txt`.
 * Keep them identical to the Google Business Profile and directory listings.
 * The public brand name is pending the owner's decision (docs/seo/README.md §5).
 */
export const business = {
  name: 'Simon Musical Instruments',
  alternateNames: ['Paul Simon - Musical Instruments'],
  founders: [
    { id: 'paul-simon', name: 'Paul-Răzvan Simon', jobTitle: 'Luthier' },
    { id: 'ecaterina-simon', name: 'Ecaterina Simon', jobTitle: 'Luthier' },
  ],
  foundingDate: '2014-02',
  telephone: '+40744960722',
  email: 'paul.simon@simoninstruments.com',
  address: {
    streetAddress: 'Strada 1 Decembrie 1918 nr. 8',
    postalCode: '545300',
    addressLocality: 'Reghin',
    addressRegion: 'Mureș',
    addressCountry: 'RO',
  },
  /** Only profiles the owner has confirmed. */
  sameAs: ['https://www.instagram.com/simon_musicalinstruments/'],
  knowsAbout: ['Violin making', 'Cello', 'Double bass', 'Viola', 'Tonewood', 'Spirit varnish'],
} as const
