import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { TransitionLink } from "~/components/PageTransition";
import type { Project, Hero, Service, About as AboutType, Footer as FooterType } from "~/types/sanity";
import UnicornStudioEmbed from "~/components/UnicornStudioEmbed.jsx";
import TargetIcon from "~/components/TargetIcon.jsx";
import PixelizeImage from "~/components/PixelizeImage.jsx";
import NavBar from "~/components/NavBar";
import Projects from "~/components/Projects";
import Services from "~/components/Services";
import About from "~/components/About";
import Footer from "~/components/Footer";

export const meta: MetaFunction = () => {
  return [
    { title: "Reese Latimer | Web Design, Development & Branding" },
    { name: "description", content: "Reese Latimer is a web designer and developer crafting bold, high-performing websites with refined branding, modern design systems, and smooth user experiences. From custom code to creative strategy, I build with precision and purpose." },
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
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);

  const heroContent = hero || {
    title: "Reese Latimer •",
    contactText: "Let's get in touch",
    tagline: "Designer blending strategy",
    subTagline: "and design to achieve online growth.",
    projectsLinkText: "Selected projects"
  };

  useEffect(() => {
    const button = buttonRef.current;
    const heroSection = heroSectionRef.current;
    
    if (!button || !heroSection) return;

    let mouseX = 0;
    let mouseY = 0;
    let buttonX = 0;
    let buttonY = 0;
    let animationId: number;
    let lastFrameTime = 0;
    const targetFPS = 30; // Reduced from 60fps
    const frameInterval = 1000 / targetFPS;

    // Throttled mouse move handler
    let mouseMoveTimeout: NodeJS.Timeout;
    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(mouseMoveTimeout);
      mouseMoveTimeout = setTimeout(() => {
        const rect = heroSection.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      }, 16); // ~60fps throttling for mouse input
    };

    const animateButton = (currentTime: number) => {
      // Frame rate limiting
      if (currentTime - lastFrameTime < frameInterval) {
        animationId = requestAnimationFrame(animateButton);
        return;
      }
      
      lastFrameTime = currentTime;
      
      // Lerp factor - lower values = smoother/slower following
      const lerpFactor = 0.08; // Slightly reduced for smoother motion
      
      // Calculate target position (offset from mouse)
      const targetX = mouseX - button.offsetWidth / 2;
      const targetY = mouseY - button.offsetHeight / 2;
      
      // Apply lerp
      buttonX += (targetX - buttonX) * lerpFactor;
      buttonY += (targetY - buttonY) * lerpFactor;
      
      // Apply transform with GPU acceleration
      gsap.set(button, {
        x: buttonX,
        y: buttonY,
        force3D: true, // Force GPU acceleration
      });
      
      animationId = requestAnimationFrame(animateButton);
    };

    heroSection.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationId = requestAnimationFrame(animateButton);

    return () => {
      heroSection.removeEventListener('mousemove', handleMouseMove);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      clearTimeout(mouseMoveTimeout);
    };
  }, []);

  return (
    <div id="top" className="min-h-screen">
      {/* NavBar Component */}
      <NavBar 
        title={heroContent.title}
        contactText={heroContent.contactText}
        isHomePage={true}
      />

      {/* Hero Section */}
      <section ref={heroSectionRef} id="hero" className="relative z-10 h-screen flex flex-col px-3 md:px-10 bg-black">
        {/* Background */}
        <UnicornStudioEmbed />

        {/* Gradient Overlay: black to transparent, positioned above waves but below content */}
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-black/80 to-transparent z-[5] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-b from-transparent to-black/100 z-[5] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-b from-transparent to-black/100 z-[5] pointer-events-none"></div>

        {/* Centered Work Together Button */}
        

        {/* Hero Tagline & Link */}
        <div className="mt-auto flex md:flex-row flex-col justify-between items-end gap-4 pb-8 relative z-10">
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
