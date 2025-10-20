import { json } from "@remix-run/node";
import { createClient } from '@sanity/client';
import type { About, Project, Service, Footer, Hero, AiArt, Ciao } from "~/types/sanity";

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

// Export individual query functions with memoization for direct use in components
let cachedAbout: About | null = null;
let cachedProjects: Project[] | null = null;
let cachedServices: Service[] | null = null;
let cachedFooter: Footer | null = null;
let cachedHero: Hero | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 1 minute cache TTL

// Helper to check if cache is valid
const isCacheValid = () => {
  return Date.now() - cacheTimestamp < CACHE_TTL;
};

export async function getHero(): Promise<Hero | null> {
  if (cachedHero && isCacheValid()) return cachedHero;
  const result = await sanityClient.fetch<Hero | null>(`*[_type == "hero"][0]{
    title,
    contactText,
    "taglineIconUrl": taglineIcon.asset->url,
    tagline,
    subTagline,
    projectsLinkText
  }`);
  cachedHero = result;
  cacheTimestamp = Date.now();
  return result;
}

export async function getAbout(): Promise<About | null> {
  if (cachedAbout && isCacheValid()) return cachedAbout;
  const result = await sanityClient.fetch<About | null>(`*[_type == "about"][0]`);
  cachedAbout = result;
  cacheTimestamp = Date.now();
  return result;
}

export async function getProjects(): Promise<Project[]> {
  if (cachedProjects && isCacheValid()) return cachedProjects;
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
  cachedProjects = result;
  cacheTimestamp = Date.now();
  return result;
}

export async function getServices(): Promise<Service[]> {
  if (cachedServices && isCacheValid()) return cachedServices;
  const result = await sanityClient.fetch<Service[]>(`*[_type == "service"] | order(order asc)`);
  cachedServices = result;
  cacheTimestamp = Date.now();
  return result;
}

export async function getFooter(): Promise<Footer | null> {
  if (cachedFooter && isCacheValid()) return cachedFooter;
  const result = await sanityClient.fetch<Footer | null>(`*[_type == "footer"][0] {
    socialLinks[] {
      platform,
      url
    }
  }`);
  cachedFooter = result;
  cacheTimestamp = Date.now();
  return result;
}

export async function getAiArt(): Promise<AiArt | null> {
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
  return result;
}

export async function getCiao(): Promise<Ciao | null> {
  const result = await sanityClient.fetch<Ciao | null>(`*[_type == "ciao"][0]{
    _id,
    title,
    heroLogoUrl,
    firstImage{
      imageUrl,
      alt
    },
    secondImage{
      imageUrl,
      alt
    },
    problemCard{
      title,
      content
    },
    solutionCard{
      title,
      content
    },
    bottomFirstImage{
      imageUrl,
      alt
    },
    bottomSecondImage{
      imageUrl,
      alt
    },
    extraContent
  }`);
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
    cachedProjects = projects;
    cachedServices = services;
    cachedAbout = about;
    cachedFooter = footer;
    cacheTimestamp = Date.now();

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
