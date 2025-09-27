export type ThemeType = 'romantic' | 'elegant' | 'rustic' | 'modern' | 'garden';

export interface WeddingWebsiteData {
  isPublished: boolean;
  url: string;
  theme: ThemeType;
  coupleNames: {
    bride: string;
    groom: string;
  };
  weddingDate: string;
  venue: {
    name: string;
    address: string;
    ceremonyTime: string;
    receptionTime: string;
  };
  story: string;
  schedule: Array<{
    time: string;
    event: string;
    location: string;
  }>;
  photos: string[];
  giftRegistry: {
    message: string;
    links: Array<{
      store: string;
      url: string;
    }>;
  };
  rsvp: {
    enabled: boolean;
    deadline: string;
    message: string;
  };
  accommodations: Array<{
    name: string;
    address: string;
    phone: string;
    website: string;
    specialRate: boolean;
  }>;
  customSections: Array<{
    title: string;
    content: string;
  }>;
}

export interface ThemeConfig {
  name: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}