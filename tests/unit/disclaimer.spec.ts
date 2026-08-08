import { beforeEach, describe, expect, it } from 'vitest'
import { DISCLAIMER_VERSION, STORAGE_KEYS } from '@/data/site'
import {
  acceptDisclaimer,
  canUseInteractiveFeatures,
  clearDisclaimerAcceptance,
  declineDisclaimer,
  hasAcceptedDisclaimer,
  readDisclaimerAcceptance,
} from '@/lib/disclaimer'
import { loadDocument, saveDocument, saveQuizScore } from '@/lib/storage'
import { cloneSeed } from '@/data/ikigaiSeed'
import {
  resetDisclaimerConsentState,
  useDisclaimerConsent,
} from '@/composables/useDisclaimerConsent'

describe('disclaimer acceptance', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    resetDisclaimerConsentState()
  })

  it('starts unaccepted', () => {
    expect(hasAcceptedDisclaimer()).toBe(false)
    expect(readDisclaimerAcceptance()).toBeNull()
    expect(canUseInteractiveFeatures()).toBe(false)
  })

  it('accept persists versioned payload', () => {
    const payload = acceptDisclaimer()
    expect(payload.version).toBe(DISCLAIMER_VERSION)
    expect(payload.acceptedAt).toMatch(/^\d{4}-/)
    expect(hasAcceptedDisclaimer()).toBe(true)
    expect(canUseInteractiveFeatures()).toBe(true)
    const raw = localStorage.getItem(STORAGE_KEYS.disclaimerAccepted)
    expect(raw).toContain(`"version":"${DISCLAIMER_VERSION}"`)
  })

  it('decline does not write acceptance', () => {
    declineDisclaimer()
    expect(localStorage.getItem(STORAGE_KEYS.disclaimerAccepted)).toBeNull()
    expect(hasAcceptedDisclaimer()).toBe(false)
  })

  it('decline sets session farewell flag without acceptance', () => {
    declineDisclaimer()
    expect(sessionStorage.getItem('ikigai-disclaimer-declined')).toBe(DISCLAIMER_VERSION)
    expect(hasAcceptedDisclaimer()).toBe(false)
  })

  it('mismatched version is treated as not accepted', () => {
    localStorage.setItem(
      STORAGE_KEYS.disclaimerAccepted,
      JSON.stringify({ version: '0-legacy', acceptedAt: '2020-01-01T00:00:00.000Z' }),
    )
    expect(hasAcceptedDisclaimer(DISCLAIMER_VERSION)).toBe(false)
    expect(canUseInteractiveFeatures()).toBe(false)
  })

  it('blocks map/quiz persistence without acceptance', () => {
    const seed = cloneSeed()
    seed.nodes[0].text = 'Should not save'
    expect(saveDocument(seed)).toBe(false)
    expect(localStorage.getItem(STORAGE_KEYS.document)).toBeNull()
    saveQuizScore({ total: 9 })
    expect(localStorage.getItem(STORAGE_KEYS.quizScore)).toBeNull()
  })

  it('allows persistence after accept', () => {
    acceptDisclaimer()
    const seed = cloneSeed()
    seed.nodes[0].text = 'Saved'
    expect(saveDocument(seed)).toBe(true)
    expect(loadDocument().nodes[0].text).toBe('Saved')
  })

  it('clearDisclaimerAcceptance removes consent', () => {
    acceptDisclaimer()
    clearDisclaimerAcceptance()
    expect(hasAcceptedDisclaimer()).toBe(false)
  })

  it('composable accept/decline views', () => {
    const consent = useDisclaimerConsent()
    expect(consent.showGate.value).toBe(true)
    consent.decline()
    expect(consent.showFarewell.value).toBe(true)
    expect(hasAcceptedDisclaimer()).toBe(false)
    consent.reopenGate()
    expect(consent.showGate.value).toBe(true)
    consent.accept()
    expect(consent.accepted.value).toBe(true)
    expect(consent.showGate.value).toBe(false)
  })
})
