/**
 * Polishé-inspired palette — rose gold, burgundy & warm cream.
 * Matches the ThemeForest Polishé Beauty Salon theme direction.
 */
export const theme = {
  burgundy: '#7A2E3E',
  burgundyDark: '#5C2230',
  rose: '#B76E79',
  roseLight: '#D4A5AE',
  roseGold: '#C9A46C',
  roseGoldLight: '#E8C9A0',
  cream: '#FAF6F3',
  creamDark: '#F5EDE8',
  charcoal: '#2D1F22',
  warmGray: '#6B5B57',
  border: '#E8DCD4',
} as const

export const gradients = {
  primary: 'from-[#7A2E3E] via-[#9B3D52] to-[#B76E79]',
  accent: 'from-[#C9A46C] via-[#D4A574] to-[#B76E79]',
  sidebar: 'from-[#7A2E3E]/12 to-[#C9A46C]/8',
  hero: 'from-[#5C2230] via-[#7A2E3E] to-[#9B3D52]',
} as const
