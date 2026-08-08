import { describe, expect, it, beforeEach } from 'vitest'
import {
  clearDocument,
  loadDocument,
  saveDocument,
  isOnboardingDone,
  setOnboardingDone,
} from '@/lib/storage'
import { acceptDisclaimer } from '@/lib/disclaimer'
import { IKIGAI_SEED, cloneSeed, isValidDocument, hasPillars } from '@/data/ikigaiSeed'
import { STORAGE_KEYS } from '@/data/site'

describe('ikigaiSeed', () => {
  it('has valid version, unique ids, and pillar categories', () => {
    expect(IKIGAI_SEED.version).toBe('1.2.0')
    expect(isValidDocument(IKIGAI_SEED)).toBe(true)
    expect(hasPillars(IKIGAI_SEED)).toBe(true)
    expect(IKIGAI_SEED.edges).toHaveLength(0)
    const ids = IKIGAI_SEED.nodes.map((n) => n.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('cloneSeed returns a deep copy', () => {
    const a = cloneSeed()
    a.nodes[0].text = 'changed'
    expect(IKIGAI_SEED.nodes[0].text).not.toBe('changed')
  })

  it('rejects invalid documents', () => {
    expect(isValidDocument(null)).toBe(false)
    expect(isValidDocument({ nodes: [], edges: 'nope' })).toBe(false)
    expect(isValidDocument({ nodes: [{ id: 'a' }, { id: 'a' }], edges: [] })).toBe(false)
  })
})

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
    acceptDisclaimer()
  })

  it('loads seed when empty', () => {
    const doc = loadDocument()
    expect(hasPillars(doc)).toBe(true)
  })

  it('round-trips a saved document', () => {
    const seed = cloneSeed()
    seed.nodes[0].text = 'My Ikigai'
    expect(saveDocument(seed)).toBe(true)
    expect(localStorage.getItem(STORAGE_KEYS.document)).toContain('My Ikigai')
    expect(loadDocument().nodes[0].text).toBe('My Ikigai')
  })

  it('falls back to seed on corrupt JSON', () => {
    localStorage.setItem(STORAGE_KEYS.document, '{not-json')
    expect(hasPillars(loadDocument())).toBe(true)
  })

  it('clearDocument removes map key only', () => {
    saveDocument(cloneSeed())
    setOnboardingDone()
    clearDocument()
    expect(localStorage.getItem(STORAGE_KEYS.document)).toBeNull()
    expect(isOnboardingDone()).toBe(true)
  })
})
