import { computed, ref } from 'vue'
import { DISCLAIMER_VERSION } from '@/data/site'
import {
  acceptDisclaimer,
  clearDeclinedDisclaimer,
  clearDisclaimerAcceptance,
  declineDisclaimer,
  hasAcceptedDisclaimer,
  hasDeclinedDisclaimer,
  readDisclaimerAcceptance,
} from '@/lib/disclaimer'

export type ConsentView = 'gate' | 'farewell' | 'accepted'

const view = ref<ConsentView>('gate')
const hydrated = ref(false)

function syncFromStorage() {
  if (typeof localStorage === 'undefined') {
    view.value = 'gate'
    hydrated.value = true
    return
  }
  if (hasAcceptedDisclaimer(DISCLAIMER_VERSION)) {
    view.value = 'accepted'
  } else if (hasDeclinedDisclaimer(DISCLAIMER_VERSION)) {
    view.value = 'farewell'
  } else {
    view.value = 'gate'
  }
  hydrated.value = true
}

/** Test helper — resets module singleton between Vitest cases. */
export function resetDisclaimerConsentState() {
  view.value = 'gate'
  hydrated.value = false
  clearDeclinedDisclaimer()
}

export function useDisclaimerConsent() {
  if (!hydrated.value) {
    syncFromStorage()
  }

  const accepted = computed(() => view.value === 'accepted')
  const showGate = computed(() => hydrated.value && view.value === 'gate')
  const showFarewell = computed(() => hydrated.value && view.value === 'farewell')

  function accept() {
    acceptDisclaimer(DISCLAIMER_VERSION)
    view.value = 'accepted'
  }

  function decline() {
    declineDisclaimer()
    view.value = 'farewell'
  }

  function reopenGate() {
    clearDeclinedDisclaimer()
    view.value = hasAcceptedDisclaimer(DISCLAIMER_VERSION) ? 'accepted' : 'gate'
  }

  function resetAcceptance() {
    clearDisclaimerAcceptance()
    clearDeclinedDisclaimer()
    view.value = 'gate'
  }

  function refresh() {
    syncFromStorage()
  }

  return {
    view,
    hydrated,
    accepted,
    showGate,
    showFarewell,
    version: DISCLAIMER_VERSION,
    acceptance: computed(() => readDisclaimerAcceptance()),
    accept,
    decline,
    reopenGate,
    resetAcceptance,
    refresh,
  }
}
