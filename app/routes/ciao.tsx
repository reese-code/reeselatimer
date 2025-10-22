import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { Ciao, Footer as FooterType } from "~/types/sanity";
import NavBar from "~/components/NavBar";
import Footer from "~/components/Footer";
import PixelizeImage from "~/components/PixelizeImage";
import { getCiao, getFooter } from "./api.sanity";
import { PortableText } from '@portabletext/react';

export const meta: MetaFunction = () => {
  return [
    { title: "CIAO | Reese Latimer" },
    { name: "description", content: "CIAO project by Reese Latimer - innovative social platform design and development." },
  ];
};

export const loader: LoaderFunction = async () => {
  try {
    const [ciao, footer] = await Promise.all([
      getCiao(),
      getFooter()
    ]);
    
    return { 
      ciao: ciao || null,
      footer: footer || { socialLinks: [] },
      error: null 
    };
  } catch (error: unknown) {
    console.error('Error fetching CIAO data:', error);
    return { 
      ciao: null,
      footer: { socialLinks: [] },
      error: (error as Error).message || 'Failed to fetch data' 
    };
  }
};

export default function CiaoPage() {
  const { ciao, footer, error } = useLoaderData<typeof loader>();
  const problemCardRef = useRef<HTMLDivElement>(null);
  const solutionCardRef = useRef<HTMLDivElement>(null);

  const defaultCiao = {
    title: "CIAO",
    heroLogoUrl: "",
    firstImageUrl: "",
    secondImageUrl: "",
    problemCard: { title: "Problem", content: [] },
    solutionCard: { title: "Solution", content: [] },
    bottomFirstImageUrl: "",
    bottomSecondImageUrl: "",
    extraContent: []
  };

  const ciaoData = ciao || defaultCiao;

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
        <p>Error loading CIAO data: {error}</p>
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

      {/* Hero Section with CIAO Logo */}
      <section className="sm:p-0 p-3 pt-20 relative min-h-[400px] max-w-[100vw] sm:pb-10 flex items-start justify-center overflow-hidden">
        {ciaoData.heroLogoUrl ? (
          <PixelizeImage 
            src={ciaoData.heroLogoUrl}
            alt="CIAO Logo"
            className="max-w-[100vw] object-contain rounded-xl sm:rounded-bl-xl sm:rounded-br-xl sm:rounded-t-none"
          />
        ) : (
          <h1 className="text-8xl md:text-[12rem] font-editorial text-white font-light">
            {ciaoData.title}
          </h1>
        )}
      </section>

      {/* First Two Images Section */}
      <section className="px-3 md:px-10 pt-3 sm:pt-0">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-10 max-w-7xl mx-auto">
          {ciaoData.firstImageUrl && (
            <div className="relative">
              <PixelizeImage 
                src={ciaoData.firstImageUrl}
                alt="First CIAO image"
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
          {ciaoData.secondImageUrl && (
            <div className="relative">
              <PixelizeImage 
                src={ciaoData.secondImageUrl}
                alt="Second CIAO image"
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-project-title-small md:text-project-title font-editorial font-light text-white">
                {ciaoData.problemCard?.title || "Problem"}
              </h2>
              <button 
                className="px-6 py-2 bg-white text-black rounded-btn-bdrd text-type-small"
                onClick={() => window.location.href = '/contact'}
              >
                Work Together
              </button>
            </div>
            {ciaoData.problemCard?.content && (
              <div className="text-[20px] text-white/60 max-w-none">
                <PortableText 
                  value={ciaoData.problemCard.content}
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-project-title-small md:text-project-title font-editorial font-light text-white">
                {ciaoData.solutionCard?.title || "Solution"}
              </h2>
              <button 
                className="px-6 py-2 bg-white text-black rounded-btn-bdrd text-type-small"
                onClick={() => window.location.href = '/contact'}
              >
                Work Together
              </button>
            </div>
            {ciaoData.solutionCard?.content && (
              <div className="text-[20px] text-white/60 max-w-none">
                <PortableText 
                  value={ciaoData.solutionCard.content}
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
      {ciaoData.extraContent && ciaoData.extraContent.length > 0 && (
        <section className="px-3 md:px-10 py-20">
          <div className="max-w-4xl mx-auto text-[20px] text-white/80">
            <PortableText 
              value={ciaoData.extraContent}
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
          {ciaoData.bottomSecondImageUrl && (
            <div className="relative md:order-2">
              <PixelizeImage 
                src={ciaoData.bottomSecondImageUrl}
                alt="Bottom second CIAO image"
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
          {ciaoData.bottomFirstImageUrl && (
            <div className="relative md:order-1">
              <PixelizeImage 
                src={ciaoData.bottomFirstImageUrl}
                alt="Bottom first CIAO image"
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
