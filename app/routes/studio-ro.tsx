import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { StudioRo, Footer as FooterType } from "~/types/sanity";
import NavBar from "~/components/NavBar";
import Footer from "~/components/Footer";
import PixelizeImage from "~/components/PixelizeImage";
import { getStudioRo, getFooter } from "./api.sanity";
import { PortableText } from '@portabletext/react';

export const meta: MetaFunction = () => {
  return [
    { title: "Studio RO | Reese Latimer" },
    { name: "description", content: "Studio RO project by Reese Latimer - innovative design and development." },
  ];
};

export const loader: LoaderFunction = async () => {
  try {
    const [studioRo, footer] = await Promise.all([
      getStudioRo(),
      getFooter()
    ]);
    
    return { 
      studioRo: studioRo || null,
      footer: footer || { socialLinks: [] },
      error: null 
    };
  } catch (error: unknown) {
    console.error('Error fetching Studio RO data:', error);
    return { 
      studioRo: null,
      footer: { socialLinks: [] },
      error: (error as Error).message || 'Failed to fetch data' 
    };
  }
};

export default function StudioRoPage() {
  const { studioRo, footer, error } = useLoaderData<typeof loader>();
  const problemCardRef = useRef<HTMLDivElement>(null);
  const solutionCardRef = useRef<HTMLDivElement>(null);

  const defaultStudioRo = {
    title: "Studio RO",
    heroLogoUrl: "",
    firstImageUrl: "",
    secondImageUrl: "",
    problemCard: { title: "Problem", content: [] },
    solutionCard: { title: "Solution", content: [] },
    bottomFirstImageUrl: "",
    bottomSecondImageUrl: "",
    extraContent: []
  };

  const studioRoData = studioRo || defaultStudioRo;

  useEffect(() => {
    let ScrollTrigger: any;
    let problemAnimation: any;
    let solutionAnimation: any;

    const initializeAnimations = async () => {
      try {
        // Dynamically import ScrollTrigger
        const scrollTriggerModule = await import('gsap/ScrollTrigger');
        ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default;
        
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Set initial state for cards (hidden and translated down)
        if (problemCardRef.current) {
          gsap.set(problemCardRef.current, { 
            opacity: 0, 
            y: 50,
            willChange: "transform, opacity"
          });
        }
        
        if (solutionCardRef.current) {
          gsap.set(solutionCardRef.current, { 
            opacity: 0, 
            y: 50,
            willChange: "transform, opacity"
          });
        }

        // Create scroll-triggered animations that only happen once
        problemAnimation = gsap.to(problemCardRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: problemCardRef.current,
            start: "top 80%",
            once: true, // Only animate once
          }
        });

        solutionAnimation = gsap.to(solutionCardRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          delay: 0.2, // Slight delay for staggered effect
          scrollTrigger: {
            trigger: solutionCardRef.current,
            start: "top 80%",
            once: true, // Only animate once
          }
        });
      } catch (error) {
        console.error('Error loading ScrollTrigger:', error);
      }
    };

    initializeAnimations();

    // Cleanup function
    return () => {
      if (problemAnimation) problemAnimation.kill();
      if (solutionAnimation) solutionAnimation.kill();
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
      }
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Error loading Studio RO data: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Transparent NavBar with gradient like AI art page */}
      <NavBar 
        title="Reese Latimer •"
        contactText="Let's get in touch"
        isHomePage={false}
        textColor="text-hero-white"
        forceTransparent={true}
        useGradient={true}
      />

      {/* Hero Section with Studio RO Logo */}
      <section className="relative min-h-[400px] max-w-[100vw] flex items-start justify-center overflow-hidden">
        {studioRoData.heroLogoUrl ? (
          <PixelizeImage 
            src={studioRoData.heroLogoUrl}
            alt="Studio RO Logo"
            className="max-w-[100vw] object-contain"
          />
        ) : (
          <h1 className="text-8xl md:text-[12rem] font-editorial text-white font-light">
            {studioRoData.title}
          </h1>
        )}
      </section>

      {/* First Two Images Section */}
      <section className="px-3 md:px-10">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-10 max-w-7xl mx-auto">
          {studioRoData.firstImageUrl && (
            <div className="relative">
              <PixelizeImage 
                src={studioRoData.firstImageUrl}
                alt="First Studio RO image"
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
          {studioRoData.secondImageUrl && (
            <div className="relative">
              <PixelizeImage 
                src={studioRoData.secondImageUrl}
                alt="Second Studio RO image"
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
        </div>
      </section>

      {/* Problem-Solution Cards Section */}
      <section className="px-3 md:px-10 py-20">
        <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
          {/* Problem Card - Sticky like About section profile picture */}
          <div ref={problemCardRef} className="md:sticky md:top-20 md:self-start md:w-1/2 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-8 w-full h-fit">
            <h2 className="text-project-title-small md:text-project-title font-editorial font-light text-white mb-6">
              {studioRoData.problemCard?.title || "Problem"}
            </h2>
            {studioRoData.problemCard?.content && (
              <div className="text-[20px] text-white/60 max-w-none">
                <PortableText 
                  value={studioRoData.problemCard.content}
                  components={{
                    block: {
                      normal: ({children}) => <p className="mb-4">{children}</p>,
                    },
                    marks: {
                      strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                      em: ({children}) => <em className="italic">{children}</em>,
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Solution Card */}
          <div ref={solutionCardRef} className="flex-1 md:w-1/2 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-8 w-full">
            <h2 className="text-project-title-small md:text-project-title font-editorial font-light text-white mb-6">
              {studioRoData.solutionCard?.title || "Solution"}
            </h2>
            {studioRoData.solutionCard?.content && (
              <div className="text-[20px] text-white/60 max-w-none">
                <PortableText 
                  value={studioRoData.solutionCard.content}
                  components={{
                    block: {
                      normal: ({children}) => <p className="mb-4">{children}</p>,
                    },
                    marks: {
                      strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                      em: ({children}) => <em className="italic">{children}</em>,
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Extra Content Section */}
      {studioRoData.extraContent && studioRoData.extraContent.length > 0 && (
        <section className="px-3 md:px-10 py-20">
          <div className="max-w-4xl mx-auto text-[20px] text-white/80">
            <PortableText 
              value={studioRoData.extraContent}
              components={{
                block: {
                  normal: ({children}) => <p className="mb-4">{children}</p>,
                },
                marks: {
                  strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                  em: ({children}) => <em className="italic">{children}</em>,
                }
              }}
            />
          </div>
        </section>
      )}

      {/* Bottom Two Images Section (Flipped) */}
      <section className="px-3 md:px-10 py-20">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 max-w-7xl mx-auto">
          {studioRoData.bottomSecondImageUrl && (
            <div className="relative md:order-2">
              <PixelizeImage 
                src={studioRoData.bottomSecondImageUrl}
                alt="Bottom second Studio RO image"
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
          {studioRoData.bottomFirstImageUrl && (
            <div className="relative md:order-1">
              <PixelizeImage 
                src={studioRoData.bottomFirstImageUrl}
                alt="Bottom first Studio RO image"
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
        </div>
      </section>

      {/* White Footer for black background */}
      <Footer socialLinks={footer?.socialLinks} textColor="white" />
    </div>
  );
}
