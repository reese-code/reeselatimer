import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { TransitionLink } from "~/components/PageTransition";
import type { Project, Hero, Service, About as AboutType, Footer as FooterType } from "~/types/sanity";
import WavesBackground from "~/components/AWaves.jsx";
import TargetIcon from "~/components/TargetIcon.jsx";
import PixelizeImage from "~/components/PixelizeImage.jsx";
import NavBar from "~/components/NavBar";
import Projects from "~/components/Projects";
import Services from "~/components/Services";
import About from "~/components/About";
import Footer from "~/components/Footer";

export const meta: MetaFunction = () => {
  return [
    { title: "Reese Latimer - Portfolio" },
    { name: "description", content: "Portfolio of Reese Latimer" },
  ];
};

import { getProjects, getServices, getAbout, getFooter, getHero } from "./api.sanity";

export const loader: LoaderFunction = async () => {
  try {
    // Use the cached data fetching functions for all data
    const [projects, hero, services, about, footer] = await Promise.all([
      getProjects(),
      getHero(),
      getServices(),
      getAbout(),
      getFooter()
    ]);
    
    return { 
      projects: projects || [], 
      hero: hero || null,
      services: services || [],
      about: about || null,
      footer: footer || { socialLinks: [] },
      error: null 
    };
  } catch (error: unknown) {
    console.error('Error fetching data:', error);
    return { 
      projects: [], 
      hero: null,
      services: [],
      about: null,
      footer: { socialLinks: [] },
      error: (error as Error).message || 'Failed to fetch data' 
    };
  }
};

export default function Index() {
  const { projects, hero, services, about, footer, error } = useLoaderData<typeof loader>();

  const heroContent = hero || {
    title: "Reese Latimer •",
    contactText: "Let's get in touch",
    tagline: "Designer blending strategy",
    subTagline: "and design to achieve online growth.",
    projectsLinkText: "Selected projects"
  };

  return (
    <div id="top" className="min-h-screen">
      {/* NavBar Component */}
      <NavBar 
        title={heroContent.title}
        contactText={heroContent.contactText}
        isHomePage={true}
      />

      {/* Hero Section */}
      <section id="hero" className="relative z-10 h-screen flex flex-col px-3 md:px-10 bg-black">
        {/* Background */}
        <WavesBackground />

        {/* Gradient Overlay: black to transparent, positioned above waves but below content */}
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-black/80 to-transparent z-[5] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-b from-transparent to-black/80 z-[5] pointer-events-none"></div>

        {/* Centered Work Together Button */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <TransitionLink 
            to="/contact" 
            className="bg-white text-black px-6 py-2 rounded-btn-bdrd font-medium text-type-small hover:bg-gray-100 transition-colors duration-200"
          >
          Work together
          </TransitionLink>
        </div>

        {/* Hero Tagline & Link */}
        <div className="mt-auto flex md:flex-row flex-col justify-between items-center gap-4 pb-8 relative z-10">
          <div className="flex flex-col items-end gap-0">
            <div className="flex items-center gap-2 mb-2">
              {hero?.taglineIconUrl && (
                <img 
                  src={hero.taglineIconUrl} 
                  alt="Icon" 
                  className="w-9 h-9 text-hero-white"
                />
              )}
              <p className="md:text-nav-big text-[30px] font-editorial editorial text-hero-white font-light leading-none">
                {heroContent.tagline}
              </p>
            </div>
            <p className="md:text-nav-big text-[30px]  font-editorial editorial text-hero-white font-light leading-none">
              {heroContent.subTagline}
            </p>
          </div>

          <TransitionLink to="#work" className="text-nav text-hero-white border-b border-hero-white">
            {heroContent.projectsLinkText}
          </TransitionLink>
        </div>
      </section>






      {/* Projects Component */}
      <Projects projects={projects} error={error} />
      
      {/* Services Component */}
      <Services services={services} error={error} />
      
      {/* About Component */}
      <About about={about} error={error} />
      
      {/* Footer Component */}
      <Footer socialLinks={footer?.socialLinks} />
    </div>
  );
}
