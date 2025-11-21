import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { TransitionLink } from "~/components/PageTransition";
import type {
  Project,
  Hero,
  Service,
  About as AboutType,
  Footer as FooterType,
} from "~/types/sanity";
import UnicornStudioEmbed from "~/components/UnicornStudioEmbed.jsx";
import TargetIcon from "~/components/TargetIcon.jsx";
import PixelizeImage from "~/components/PixelizeImage.jsx";
import NavBar from "~/components/NavBar";
import Projects from "~/components/Projects";
import Services from "~/components/Services";
import About from "~/components/About";
import Footer from "~/components/Footer";

export const meta: MetaFunction = () => {
  const canonicalUrl = "https://reeselatimer.com";
  
  return [
    { title: "Reese Latimer | Web Design, Development & Branding" },
    { name: "description", content: "Web designer & developer crafting bold, high-performing websites with refined branding and smooth user experiences." },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
    { property: "og:title", content: "Reese Latimer | Web Design, Development & Branding" },
    { property: "og:description", content: "Web designer & developer crafting bold, high-performing websites with refined branding and smooth user experiences." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonicalUrl },
    { property: "og:site_name", content: "Reese Latimer" },
    { property: "og:locale", content: "en_US" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Reese Latimer | Web Design, Development & Branding" },
    { name: "twitter:description", content: "Web designer & developer crafting bold, high-performing websites with refined branding and smooth user experiences." },
    { name: "author", content: "Reese Latimer" },
    { name: "robots", content: "index, follow" },
  ];
};

import { getProjects, getServices, getAbout, getFooter, getHero } from "./api.sanity";

export const loader: LoaderFunction = async () => {
  try {
    const [projects, hero, services, about, footer] = await Promise.all([
      getProjects(),
      getHero(),
      getServices(),
      getAbout(),
      getFooter(),
    ]);
    
    return { 
      projects: projects || [], 
      hero: hero || null,
      services: services || [],
      about: about || null,
      footer: footer || { socialLinks: [] },
      error: null,
    };
  } catch (error: unknown) {
    console.error("Error fetching data:", error);
    return { 
      projects: [], 
      hero: null,
      services: [],
      about: null,
      footer: { socialLinks: [] },
      error: (error as Error).message || "Failed to fetch data",
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
    projectsLinkText: "Selected projects",
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
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    let mouseMoveTimeout: NodeJS.Timeout;
    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(mouseMoveTimeout);
      mouseMoveTimeout = setTimeout(() => {
        const rect = heroSection.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      }, 16);
    };

    const animateButton = (currentTime: number) => {
      if (currentTime - lastFrameTime < frameInterval) {
        animationId = requestAnimationFrame(animateButton);
        return;
      }
      
      lastFrameTime = currentTime;
      
      const lerpFactor = 0.08;
      const targetX = mouseX - button.offsetWidth / 2;
      const targetY = mouseY - button.offsetHeight / 2;
      
      buttonX += (targetX - buttonX) * lerpFactor;
      buttonY += (targetY - buttonY) * lerpFactor;
      
      gsap.set(button, {
        x: buttonX,
        y: buttonY,
        force3D: true,
      });
      
      animationId = requestAnimationFrame(animateButton);
    };

    heroSection.addEventListener("mousemove", handleMouseMove, { passive: true });
    animationId = requestAnimationFrame(animateButton);

    return () => {
      heroSection.removeEventListener("mousemove", handleMouseMove);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      clearTimeout(mouseMoveTimeout);
    };
  }, []);


  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Reese Latimer",
    "jobTitle": "Web Designer & Developer",
    "description": "Web designer & developer crafting bold, high-performing websites with refined branding and smooth user experiences.",
    "url": "https://reeselatimer.com",
    "sameAs": [
      "https://github.com/reese-code"
    ],
    "knowsAbout": [
      "Web Design",
      "Web Development", 
      "Branding",
      "User Experience Design",
      "Frontend Development"
    ],
    "offers": {
      "@type": "Service",
      "name": "Web Design & Development Services",
      "description": "Custom web design and development services including branding, user experience design, and high-performance website creation."
    }
  };

  return (
    <div id="top" className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />
      
      <NavBar 
        title={heroContent.title}
        contactText={heroContent.contactText}
        isHomePage={true}
      />

      {/* Hero Section */}
      <section
        ref={heroSectionRef}
        id="hero"
        className="hero relative z-10 h-screen flex flex-col px-3 md:px-10 bg-black"
      >
        <UnicornStudioEmbed />

        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-black/80 to-transparent z-[5] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-b from-transparent to-black/100 z-[5] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-b from-transparent to-black/100 z-[5] pointer-events-none"></div>


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
              <h1 className="md:text-nav-big text-[30px] font-editorial editorial text-hero-white font-light leading-none">
                 Crafting digital experiences
              </h1>
            </div>
            <div className="md:text-nav-big text-[30px] font-editorial editorial text-hero-white font-light leading-none">
              that engage, delight, and reflect your brand.
            </div>
          </div>

          <TransitionLink to="#work" className="text-nav text-hero-white border-b border-hero-white">
            {heroContent.projectsLinkText}
          </TransitionLink>
        </div>
      </section>

      <Projects projects={projects} error={error} />
      <Services services={services} error={error} />
      <About about={about} error={error} />
      <Footer socialLinks={footer?.socialLinks} />
    </div>
  );
}
