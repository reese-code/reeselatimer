import { json } from "@remix-run/node";
import { createClient } from '@sanity/client';
import type { About, Project, Service, Footer, Hero, AiArt, Ciao, StudioRo } from "~/types/sanity";

// Create a Sanity client with CDN enabled for development too
// This helps with performance in local development
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'usq45pnh',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: true, // Always use CDN for better performance
  apiVersion: '2023-05-03',
});

if (!sanityClient.config().projectId) {
  throw new Error('Sanity Project ID is required');
}

// Enhanced caching system with individual timestamps and longer TTL
const cache = {
  about: { data: null as About | null, timestamp: 0 },
  projects: { data: null as Project[] | null, timestamp: 0 },
  services: { data: null as Service[] | null, timestamp: 0 },
  footer: { data: null as Footer | null, timestamp: 0 },
  hero: { data: null as Hero | null, timestamp: 0 },
  aiArt: { data: null as AiArt | null, timestamp: 0 },
  ciao: { data: null as Ciao | null, timestamp: 0 },
  studioRo: { data: null as StudioRo | null, timestamp: 0 },
};

const CACHE_TTL = 300000; // 5 minutes cache TTL for better performance

// Helper to check if specific cache entry is valid
const isCacheValid = (cacheEntry: { timestamp: number }) => {
  return Date.now() - cacheEntry.timestamp < CACHE_TTL;
};

export async function getHero(): Promise<Hero | null> {
  if (cache.hero.data && isCacheValid(cache.hero)) return cache.hero.data;
  const result = await sanityClient.fetch<Hero | null>(`*[_type == "hero"][0]{
    title,
    contactText,
    "taglineIconUrl": taglineIcon.asset->url,
    tagline,
    subTagline,
    projectsLinkText
  }`);
  cache.hero.data = result;
  cache.hero.timestamp = Date.now();
  return result;
}

export async function getAbout(): Promise<About | null> {
  if (cache.about.data && isCacheValid(cache.about)) return cache.about.data;
  const result = await sanityClient.fetch<About | null>(`*[_type == "about"][0]`);
  cache.about.data = result;
  cache.about.timestamp = Date.now();
  return result;
}

export async function getProjects(): Promise<Project[]> {
  if (cache.projects.data && isCacheValid(cache.projects)) return cache.projects.data;
  const result = await sanityClient.fetch<Project[]>(`*[_type == "project"]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    client,
    projectDate,
    technologies,
    "mainImageUrl": mainImage.asset->url,
    "secondaryImageUrl": secondaryImage.asset->url,
    "tertiaryImageUrl": tertiaryImage.asset->url,
    "iconSvgUrl": iconSvg.asset->url,
    description,
    websiteUrl,
    tags,
    buttons
  } | order(_createdAt desc)`);
  cache.projects.data = result;
  cache.projects.timestamp = Date.now();
  return result;
}

export async function getServices(): Promise<Service[]> {
  if (cache.services.data && isCacheValid(cache.services)) return cache.services.data;
  const result = await sanityClient.fetch<Service[]>(`*[_type == "service"] | order(order asc)`);
  cache.services.data = result;
  cache.services.timestamp = Date.now();
  return result;
}

export async function getFooter(): Promise<Footer | null> {
  if (cache.footer.data && isCacheValid(cache.footer)) return cache.footer.data;
  const result = await sanityClient.fetch<Footer | null>(`*[_type == "footer"][0] {
    socialLinks[] {
      platform,
      url
    }
  }`);
  cache.footer.data = result;
  cache.footer.timestamp = Date.now();
  return result;
}

export async function getAiArt(): Promise<AiArt | null> {
  if (cache.aiArt.data && isCacheValid(cache.aiArt)) return cache.aiArt.data;
  const result = await sanityClient.fetch<AiArt | null>(`*[_type == "aiArt"][0]{
    _id,
    title,
    subtitle,
    description,
    groups[]{
      name,
      description,
      color
    },
    images[] | order(createdAt desc){
      title,
      "imageUrl": image.asset->url,
      prompt,
      groupName,
      createdAt
    }
  }`);
  cache.aiArt.data = result;
  cache.aiArt.timestamp = Date.now();
  return result;
}

export async function getCiao(): Promise<Ciao | null> {
  if (cache.ciao.data && isCacheValid(cache.ciao)) return cache.ciao.data;
  const result = await sanityClient.fetch<Ciao | null>(`*[_type == "ciao"][0]{
    _id,
    title,
    "heroLogoUrl": heroLogo.asset->url,
    "firstImageUrl": firstImage.asset->url,
    "secondImageUrl": secondImage.asset->url,
    problemCard{
      title,
      content
    },
    solutionCard{
      title,
      content
    },
    "bottomFirstImageUrl": bottomFirstImage.asset->url,
    "bottomSecondImageUrl": bottomSecondImage.asset->url,
    extraContent
  }`);
  cache.ciao.data = result;
  cache.ciao.timestamp = Date.now();
  return result;
}

export async function getStudioRo(): Promise<StudioRo | null> {
  if (cache.studioRo.data && isCacheValid(cache.studioRo)) return cache.studioRo.data;
  const result = await sanityClient.fetch<StudioRo | null>(`*[_type == "studioRo"][0]{
    _id,
    title,
    "heroLogoUrl": heroLogo.asset->url,
    "firstImageUrl": firstImage.asset->url,
    "secondImageUrl": secondImage.asset->url,
    problemCard{
      title,
      content
    },
    solutionCard{
      title,
      content
    },
    "bottomFirstImageUrl": bottomFirstImage.asset->url,
    "bottomSecondImageUrl": bottomSecondImage.asset->url,
    extraContent
  }`);
  cache.studioRo.data = result;
  cache.studioRo.timestamp = Date.now();
  return result;
}

export async function loader() {
  try {
    // Use Promise.all to fetch data in parallel
    const [projects, hero, services, about, footer] = await Promise.all([
      sanityClient.fetch(`*[_type == "project"]{
        _id,
        title,
        "slug": slug.current,
        excerpt,
        client,
        projectDate,
        technologies,
        "mainImageUrl": mainImage.asset->url,
        "secondaryImageUrl": secondaryImage.asset->url,
        "tertiaryImageUrl": tertiaryImage.asset->url,
        "iconSvgUrl": iconSvg.asset->url,
        description,
        websiteUrl,
        tags,
        buttons
      } | order(_createdAt desc)`),
      
      sanityClient.fetch(`*[_type == "hero"][0]{
        title,
        contactText,
        "taglineIconUrl": taglineIcon.asset->url,
        tagline,
        subTagline,
        projectsLinkText
      }`),
      
      sanityClient.fetch(`*[_type == "service"]{
        _id,
        title,
        "slug": slug.current,
        description,
        tags,
        order
      } | order(order asc)`),
      
      sanityClient.fetch(`*[_type == "about"][0]{
        _id,
        title,
        "mainImageUrl": mainImage.asset->url,
        "svgIconUrl": svgIcon.asset->url,
        mainText,
        firstParagraph,
        secondParagraph
      }`),
      
      sanityClient.fetch(`*[_type == "footer"][0]{
        socialLinks[] {
          platform,
          url
        }
      }`)
    ]);

    // Update cache
    cache.projects.data = projects;
    cache.services.data = services;
    cache.about.data = about;
    cache.footer.data = footer;
    const now = Date.now();
    cache.projects.timestamp = now;
    cache.services.timestamp = now;
    cache.about.timestamp = now;
    cache.footer.timestamp = now;

    return json({
      projects: projects || [],
      hero: hero || null,
      services: services || [],
      about: about || null,
      footer: footer || { socialLinks: [] }
    });
  } catch (error) {
    console.error('Error in Sanity API route:', {
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      stack: error instanceof Error ? error.stack : undefined,
      config: sanityClient.config()
    });
    
    return json({
      error: 'Failed to fetch data',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      projectId: process.env.SANITY_PROJECT_ID || 'usq45pnh'
    }, { status: 500 });
  }
}
