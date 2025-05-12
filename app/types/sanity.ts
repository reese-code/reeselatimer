export interface Project {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  client?: string;
  projectDate?: string;
  technologies?: string[];
  mainImageUrl?: string;
  secondaryImageUrl?: string;
  tertiaryImageUrl?: string;
  iconSvgUrl?: string;
  description?: string;
  websiteUrl?: string;
  tags?: string[];
  buttons?: {
    text: string;
    url?: string;
  }[];
}

export interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  order: number;
}

export interface Hero {
  title: string;
  contactText: string;
  taglineIconUrl?: string;
  tagline: string;
  subTagline: string;
  projectsLinkText: string;
}

export interface About {
  _id: string;
  title: string;
  mainImageUrl: string;
  svgIconUrl?: string;
  mainText: string;
  firstParagraph: string;
  secondParagraph: string;
}
