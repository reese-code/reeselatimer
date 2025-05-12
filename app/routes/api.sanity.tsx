import { json } from "@remix-run/node";
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'usq45pnh',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2023-05-03',
});

if (!sanityClient.config().projectId) {
  throw new Error('Sanity Project ID is required');
}

export async function loader() {
  try {
    // Test Sanity connection first
    const config = sanityClient.config();
    if (!config.projectId) {
      throw new Error('Sanity configuration error: Missing project ID');
    }

    // Fetch projects
    const projectsQuery = `*[_type == "project"]{
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
    } | order(_createdAt desc)`;
    
    const projects = await sanityClient.fetch(projectsQuery);
    
    // Fetch hero data
    const heroQuery = `*[_type == "hero"][0]{
      title,
      contactText,
      "taglineIconUrl": taglineIcon.asset->url,
      tagline,
      subTagline,
      projectsLinkText
    }`;
    
    const hero = await sanityClient.fetch(heroQuery);
    
    if (!projects) {
      console.warn('No projects found in Sanity');
    }

    // Fetch services
    const servicesQuery = `*[_type == "service"]{
      _id,
      title,
      "slug": slug.current,
      description,
      tags,
      order
    } | order(order asc)`;
    
    const services = await sanityClient.fetch(servicesQuery);
    
    if (!services) {
      console.warn('No services found in Sanity');
    }

    return json({
      projects: projects || [],
      hero: hero || null,
      services: services || []
    });
  } catch (error) {
    console.error('Error in Sanity API route:', {
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      stack: error instanceof Error ? error.stack : undefined,
      config: sanityClient.config()
    });
    
    return json({
      error: 'Failed to fetch projects',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
      projectId: process.env.SANITY_PROJECT_ID || 'usq45pnh'
    }, { status: 500 });
  }
}
