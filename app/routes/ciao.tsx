import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import type { Ciao, Footer as FooterType } from "~/types/sanity";
import NavBar from "~/components/NavBar";
import Footer from "~/components/Footer";
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
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const problemCard = problemCardRef.current;
    const solutionCard = solutionCardRef.current;
    const cardsContainer = cardsContainerRef.current;

    if (!problemCard || !solutionCard || !cardsContainer) return;

    const handleScroll = () => {
      const containerRect = cardsContainer.getBoundingClientRect();
      const problemRect = problemCard.getBoundingClientRect();
      const solutionRect = solutionCard.getBoundingClientRect();
      
      // Check if the cards container is in viewport
      if (containerRect.top <= 0 && containerRect.bottom > window.innerHeight) {
        // Calculate how much the solution card extends beyond the problem card
        const heightDifference = solutionCard.offsetHeight - problemCard.offsetHeight;
        
        if (heightDifference > 0) {
          // Calculate scroll progress within the container
          const scrollProgress = Math.abs(containerRect.top) / heightDifference;
          const clampedProgress = Math.min(Math.max(scrollProgress, 0), 1);
          
          // Apply sticky positioning to problem card
          problemCard.style.position = 'sticky';
          problemCard.style.top = '2rem';
          problemCard.style.transform = `translateY(${clampedProgress * heightDifference}px)`;
        }
      } else {
        // Reset positioning when not in the sticky zone
        problemCard.style.position = 'static';
        problemCard.style.transform = 'none';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const defaultCiao = {
    title: "CIAO",
    heroLogoUrl: "",
    firstImage: { imageUrl: "", alt: "First image" },
    secondImage: { imageUrl: "", alt: "Second image" },
    problemCard: { title: "Problem", content: [] },
    solutionCard: { title: "Solution", content: [] },
    bottomFirstImage: { imageUrl: "", alt: "Bottom first image" },
    bottomSecondImage: { imageUrl: "", alt: "Bottom second image" },
    extraContent: []
  };

  const ciaoData = ciao || defaultCiao;

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Error loading CIAO data: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* White NavBar for black background */}
      <NavBar 
        title="Reese Latimer •"
        contactText="Let's get in touch"
        isHomePage={false}
        textColor="text-hero-white"
      />

      {/* Hero Section with CIAO Logo */}
      <section className="relative h-screen flex items-center justify-center px-3 md:px-10">
        {ciaoData.heroLogoUrl ? (
          <img 
            src={ciaoData.heroLogoUrl}
            alt="CIAO Logo"
            className="max-h-[60vh] max-w-[80vw] object-contain"
          />
        ) : (
          <h1 className="text-8xl md:text-[12rem] font-editorial text-white font-light">
            {ciaoData.title}
          </h1>
        )}
      </section>

      {/* First Two Images Section */}
      <section className="px-3 md:px-10 py-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {ciaoData.firstImage?.imageUrl && (
            <div className="relative">
              <img 
                src={ciaoData.firstImage.imageUrl}
                alt={ciaoData.firstImage.alt}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
          {ciaoData.secondImage?.imageUrl && (
            <div className="relative">
              <img 
                src={ciaoData.secondImage.imageUrl}
                alt={ciaoData.secondImage.alt}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
        </div>
      </section>

      {/* Problem-Solution Cards Section */}
      <section ref={cardsContainerRef} className="px-3 md:px-10 py-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Problem Card */}
          <div ref={problemCardRef} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl md:text-3xl font-editorial text-white mb-6">
              {ciaoData.problemCard?.title || "Problem"}
            </h2>
            {ciaoData.problemCard?.content && (
              <div className="text-white/80 prose prose-invert max-w-none">
                <PortableText value={ciaoData.problemCard.content} />
              </div>
            )}
          </div>

          {/* Solution Card */}
          <div ref={solutionCardRef} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl md:text-3xl font-editorial text-white mb-6">
              {ciaoData.solutionCard?.title || "Solution"}
            </h2>
            {ciaoData.solutionCard?.content && (
              <div className="text-white/80 prose prose-invert max-w-none">
                <PortableText value={ciaoData.solutionCard.content} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Extra Content Section */}
      {ciaoData.extraContent && ciaoData.extraContent.length > 0 && (
        <section className="px-3 md:px-10 py-20">
          <div className="max-w-4xl mx-auto text-white/80 prose prose-invert prose-lg">
            <PortableText value={ciaoData.extraContent} />
          </div>
        </section>
      )}

      {/* Bottom Two Images Section (Flipped) */}
      <section className="px-3 md:px-10 py-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {ciaoData.bottomSecondImage?.imageUrl && (
            <div className="relative md:order-2">
              <img 
                src={ciaoData.bottomSecondImage.imageUrl}
                alt={ciaoData.bottomSecondImage.alt}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
          {ciaoData.bottomFirstImage?.imageUrl && (
            <div className="relative md:order-1">
              <img 
                src={ciaoData.bottomFirstImage.imageUrl}
                alt={ciaoData.bottomFirstImage.alt}
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
