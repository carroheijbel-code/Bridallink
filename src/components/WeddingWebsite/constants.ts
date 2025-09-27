import { ThemeConfig, ThemeType, WeddingWebsiteData } from './types';

export const THEMES: Record<ThemeType, ThemeConfig> = {
  romantic: {
    name: 'Romantic Blush',
    preview: 'bg-gradient-to-br from-rose-100 to-pink-200',
    colors: { primary: '#f43f5e', secondary: '#fda4af', accent: '#fed7d7' }
  },
  elegant: {
    name: 'Elegant Ivory',
    preview: 'bg-gradient-to-br from-amber-50 to-yellow-100',
    colors: { primary: '#d97706', secondary: '#fbbf24', accent: '#fef3c7' }
  },
  rustic: {
    name: 'Rustic Earth',
    preview: 'bg-gradient-to-br from-amber-100 to-orange-200',
    colors: { primary: '#ea580c', secondary: '#fb923c', accent: '#fed7aa' }
  },
  modern: {
    name: 'Modern Minimalist',
    preview: 'bg-gradient-to-br from-gray-100 to-slate-200',
    colors: { primary: '#374151', secondary: '#6b7280', accent: '#f3f4f6' }
  },
  garden: {
    name: 'Garden Fresh',
    preview: 'bg-gradient-to-br from-green-100 to-emerald-200',
    colors: { primary: '#059669', secondary: '#34d399', accent: '#d1fae5' }
  }
};

export const DEFAULT_WEBSITE_DATA: WeddingWebsiteData = {
  isPublished: false,
  url: '',
  theme: 'romantic',
  coupleNames: { bride: '', groom: '' },
  weddingDate: '',
  venue: {
    name: '',
    address: '',
    ceremonyTime: '',
    receptionTime: ''
  },
  story: '',
  schedule: [],
  photos: [],
  giftRegistry: {
    message: '',
    links: []
  },
  rsvp: {
    enabled: true,
    deadline: '',
    message: ''
  },
  accommodations: [],
  customSections: []
};