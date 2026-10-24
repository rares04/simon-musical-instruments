import { describe, expect, it } from 'vitest'
import { instrumentSlug, slugify, uniqueSlug, woodDescriptor } from '@/lib/seo/slug'

describe('slugify', () => {
  it('keeps lowercase ASCII words joined by hyphens', () => {
    expect(slugify('Stradivari Davidoff')).toBe('stradivari-davidoff')
    expect(slugify('  Ș Gamba Vivală! ')).toBe('s-gamba-vivala')
    expect(slugify('Cello 4/4 (10)')).toBe('cello-4-4-10')
  })
})

describe('woodDescriptor', () => {
  it('reads the figure and species from free text, typos included', () => {
    expect(woodDescriptor('Very well wild flamed romanian maple')).toBe('flamed-maple')
    expect(woodDescriptor('Very well flamed mapple')).toBe('flamed-maple')
    expect(woodDescriptor('Beautiful bird-eye romanian maple')).toBe('birdseye-maple')
    expect(woodDescriptor('Romanian Quilted maple')).toBe('quilted-maple')
    expect(woodDescriptor('Flamed romanian poplar')).toBe('flamed-poplar')
    expect(woodDescriptor('Plain alder')).toBe('alder')
    expect(woodDescriptor('Ebony')).toBeNull()
    expect(woodDescriptor(null)).toBeNull()
  })
})

describe('instrumentSlug', () => {
  // Rows from the 2026-10-24 dry run on live data (.private/seo/drafts/b2-slug-dryrun.md).
  it('builds {type}-{model}-{year}-{back wood}', () => {
    expect(
      instrumentSlug({
        instrumentType: 'cello',
        model: 'Stradivari Davidoff',
        year: 2025,
        specs: { bodyWood: 'Well flamed romanian alder' },
      }),
    ).toBe('cello-stradivari-davidoff-2025-flamed-alder')
    expect(
      instrumentSlug({
        instrumentType: 'contrabass',
        title: 'Double Bass 3/4',
        model: 'French Gamba',
        year: 2024,
        specs: { bodyWood: 'Very well flamed romanian maple' },
      }),
    ).toBe('double-bass-french-gamba-2024-flamed-maple')
  })

  it('marks 5-string double basses', () => {
    expect(
      instrumentSlug({
        instrumentType: 'contrabass',
        title: 'Double Bass 3/4 - 5 Strings',
        model: 'Gamba Vivala',
        year: 2025,
        specs: { bodyWood: 'Well flamed romanian maple' },
      }),
    ).toBe('double-bass-5-string-gamba-vivala-2025-flamed-maple')
  })

  it("uses Paul's number instead of the wood when there is one", () => {
    expect(
      instrumentSlug({
        instrumentType: 'cello',
        model: 'Goffriller',
        year: 2024,
        specs: { bodyWood: 'Well flamed romanian maple' },
        number: 12,
      }),
    ).toBe('cello-goffriller-2024-no-12')
  })

  it('skips missing parts instead of leaving empty segments', () => {
    expect(instrumentSlug({ instrumentType: 'viola', model: null, year: null })).toBe('viola')
  })
})

describe('uniqueSlug', () => {
  it('appends -2, -3… on a clash', () => {
    const taken = new Set(['cello-x', 'cello-x-2'])
    expect(uniqueSlug('cello-y', taken)).toBe('cello-y')
    expect(uniqueSlug('cello-x', taken)).toBe('cello-x-3')
  })
})
