import type { FlowchartDocument } from '@vanduo-oss/vd3-cbun/flowchart'
import { STORAGE_KEYS } from '@/data/site'
import { cloneSeed, isValidDocument } from '@/data/ikigaiSeed'
import { canUseInteractiveFeatures } from '@/lib/disclaimer'

export function loadDocument(): FlowchartDocument {
  if (typeof localStorage === 'undefined') return cloneSeed()
  if (!canUseInteractiveFeatures()) return cloneSeed()
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.document)
    if (!raw) return cloneSeed()
    const parsed: unknown = JSON.parse(raw)
    if (!isValidDocument(parsed)) return cloneSeed()
    return parsed
  } catch {
    return cloneSeed()
  }
}

export function saveDocument(doc: FlowchartDocument): boolean {
  if (typeof localStorage === 'undefined') return false
  if (!canUseInteractiveFeatures()) return false
  try {
    localStorage.setItem(STORAGE_KEYS.document, JSON.stringify(doc))
    return true
  } catch {
    return false
  }
}

export function clearDocument(): void {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(STORAGE_KEYS.document)
}

export function isOnboardingDone(): boolean {
  if (typeof localStorage === 'undefined') return true
  return localStorage.getItem(STORAGE_KEYS.onboardingDone) === '1'
}

export function setOnboardingDone(): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.onboardingDone, '1')
}

export function saveQuizScore(payload: unknown): void {
  if (typeof localStorage === 'undefined') return
  if (!canUseInteractiveFeatures()) return
  try {
    localStorage.setItem(STORAGE_KEYS.quizScore, JSON.stringify(payload))
  } catch {
    /* ignore quota */
  }
}

export {
  acceptDisclaimer,
  clearDisclaimerAcceptance,
  declineDisclaimer,
  hasAcceptedDisclaimer,
  readDisclaimerAcceptance,
  canUseInteractiveFeatures,
} from '@/lib/disclaimer'
