import { DISCLAIMER_VERSION, STORAGE_KEYS } from '@/data/site'

export interface DisclaimerAcceptance {
  version: string
  acceptedAt: string
}

const DECLINED_SESSION_KEY = 'ikigai-disclaimer-declined'

function canUseStorage(): boolean {
  return typeof localStorage !== 'undefined'
}

function canUseSession(): boolean {
  return typeof sessionStorage !== 'undefined'
}

export function readDisclaimerAcceptance(): DisclaimerAcceptance | null {
  if (!canUseStorage()) return null
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.disclaimerAccepted)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    const rec = parsed as Partial<DisclaimerAcceptance>
    if (typeof rec.version !== 'string' || typeof rec.acceptedAt !== 'string') return null
    return { version: rec.version, acceptedAt: rec.acceptedAt }
  } catch {
    return null
  }
}

/** True only when stored acceptance matches the current DISCLAIMER_VERSION. */
export function hasAcceptedDisclaimer(version: string = DISCLAIMER_VERSION): boolean {
  const current = readDisclaimerAcceptance()
  return current?.version === version
}

export function acceptDisclaimer(version: string = DISCLAIMER_VERSION, at: Date = new Date()): DisclaimerAcceptance {
  const payload: DisclaimerAcceptance = {
    version,
    acceptedAt: at.toISOString(),
  }
  if (canUseStorage()) {
    localStorage.setItem(STORAGE_KEYS.disclaimerAccepted, JSON.stringify(payload))
    localStorage.removeItem(STORAGE_KEYS.disclaimerDismissed)
  }
  if (canUseSession()) {
    sessionStorage.removeItem(DECLINED_SESSION_KEY)
  }
  return payload
}

/** Decline must not write acceptance; session flag keeps farewell across navigations. */
export function declineDisclaimer(): void {
  if (canUseSession()) {
    sessionStorage.setItem(DECLINED_SESSION_KEY, DISCLAIMER_VERSION)
  }
}

export function hasDeclinedDisclaimer(version: string = DISCLAIMER_VERSION): boolean {
  if (!canUseSession()) return false
  return sessionStorage.getItem(DECLINED_SESSION_KEY) === version
}

export function clearDeclinedDisclaimer(): void {
  if (!canUseSession()) return
  sessionStorage.removeItem(DECLINED_SESSION_KEY)
}

export function clearDisclaimerAcceptance(): void {
  if (!canUseStorage()) return
  localStorage.removeItem(STORAGE_KEYS.disclaimerAccepted)
}

/** Interactive features (map persistence, quiz save) require acceptance. */
export function canUseInteractiveFeatures(version: string = DISCLAIMER_VERSION): boolean {
  return hasAcceptedDisclaimer(version)
}
