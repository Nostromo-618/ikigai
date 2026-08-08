import type { Directive } from 'vue'

export const reveal: Directive<HTMLElement> = {
  mounted(el, binding) {
    const delay = Number(binding.value) || 0
    if (delay) el.style.transitionDelay = `${delay}ms`

    if (typeof IntersectionObserver === 'undefined') {
      return
    }

    const revealIfNeeded = () => {
      const rect = el.getBoundingClientRect()
      const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0
      if (inView) {
        el.classList.add('is-visible')
        return false
      }
      el.classList.add('reveal')
      return true
    }

    const needsReveal = revealIfNeeded()
    if (!needsReveal) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('is-visible')
            io.unobserve(el)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
  },
}
