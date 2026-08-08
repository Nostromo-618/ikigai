export const DISCLAIMER_TITLE = 'Before you continue'

export const DISCLAIMER_INTRO =
  'Please read and accept these terms to use this site (including the map, quiz, and Read pages). If you decline, the site stays locked until you accept — you can return later to re-read these terms.'

export interface DisclaimerSection {
  heading: string
  body: string
}

export const DISCLAIMER_SECTIONS: DisclaimerSection[] = [
  {
    heading: 'Privacy & local storage',
    body: 'Your map, quiz answers, theme preferences, and similar data stay in this browser’s localStorage. They are not uploaded to a server, and there is no account or cloud sync. Clearing site data, switching browsers or devices, or using private/incognito mode can erase everything. Exports (PNG, SVG, HTML) are downloads you choose to save on your own device.',
  },
  {
    heading: 'Not professional advice',
    body: 'This site is an educational and self-reflection tool only. It is not career counseling, medical advice, mental-health treatment, financial advice, or any other professional service. Do not rely on it for decisions that affect your health, livelihood, relationships, or finances. Consult qualified professionals when those stakes apply.',
  },
  {
    heading: 'AI-assisted content (transparency)',
    body: 'Parts of this site’s content and structure were generated or assisted with AI tools. Treat the material as a starting point for reflection, not as authoritative human professional judgment or a certified assessment. You remain responsible for how you interpret and use anything here.',
  },
  {
    heading: 'Intellectual honesty about “Ikigai”',
    body: 'The popular four-circle Venn diagram labeled “Ikigai” is a modern Western mash-up (notably linking Andrés Zuzunaga’s Propósito diagram with the Japanese word ikigai). It is not an ancient Japanese diagram. Authentic Japanese ikigai philosophy is broader and more everyday than career-optimization graphics. This site uses the diagram as a practical UX while stating that history clearly.',
  },
  {
    heading: 'No warranties — use at your own risk',
    body: 'The site is provided free of charge, “as is,” without warranties of any kind, express or implied — including fitness for a particular purpose, accuracy, or uninterrupted availability. To the fullest extent permitted by law, the author and contributors are not liable for any loss, damage, or decision arising from your use of the site, its content, or your exports.',
  },
  {
    heading: 'Your responsibility',
    body: 'By accepting, you confirm you are old enough to use the site where you live, that you understand the limits above, and that you will not treat scores, diagrams, or generated pages as clinical or legal conclusions. If you do not agree, decline — you can re-read these terms later, but the site remains unavailable until you accept.',
  },
]

export const FAREWELL_TITLE = 'You chose not to accept'
export const FAREWELL_BODY =
  'That’s okay. Without accepting the terms, this project cannot unlock the map, quiz, Read pages, or related storage features. Come back to re-read the disclaimer whenever you are ready.'
