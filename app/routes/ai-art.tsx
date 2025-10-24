import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { AiArt, AiArtImage, AiArtGroup, Footer as FooterType } from "~/types/sanity";
import NavBar from "~/components/NavBar";
import Footer from "~/components/Footer";
import PixelizeImage from "~/components/PixelizeImage.jsx";
import { getAiArt, getFooter } from "./api.sanity";

export const meta: MetaFunction = () => {
  return [
    { title: "AI Art | Reese Latimer" },
    { name: "description", content: "Explore AI-generated art by Reese Latimer. Creative technology projects experimenting with artificial intelligence and digital art." },
  ];
};

export const loader: LoaderFunction = async () => {
  try {
    const [aiArt, footer] = await Promise.all([getAiArt(), getFooter()]);
    return {
      aiArt: aiArt || null,
      footer: footer || { socialLinks: [] },
      error: null
    };
  } catch (error: unknown) {
    console.error("Error fetching AI Art data:", error);
    return {
      aiArt: null,
      footer: { socialLinks: [] },
      error: (error as Error).message || "Failed to fetch data"
    };
  }
};

export default function AiArt() {
  const { aiArt, footer, error } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<AiArtImage | null>(null);
  const [focusedTab, setFocusedTab] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Refs for GSAP animations
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const clearButtonRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const focusedGroup = focusedTab ? (aiArt?.groups || []).find((g: AiArtGroup) => g.name === focusedTab) : null;
  const selectedGroup = selectedImage ? (aiArt?.groups || []).find((g: AiArtGroup) => g.name === selectedImage.groupName) : null;

  const aiArtContent = aiArt || {
    title: "AI Art",
    subtitle: "Ai Artist & Creative Technologist",
    description: "I craft AI art for clients and spend my free time experimenting with creative tech projects.",
    images: [],
    groups: []
  };

  const images = aiArt?.images || [];
  const groups = aiArt?.groups || [];

  // Get unique group names from images that actually have images assigned
  const usedGroupNames = [...new Set(images.map((img: AiArtImage) => img.groupName).filter(Boolean))] as string[];
  
  // Create dynamic groups based on actually used categories with default colors
  const dynamicGroups = usedGroupNames.map((groupName: string) => {
    // Try to find existing group definition first
    const existingGroup = groups.find((group: AiArtGroup) => group.name === groupName);
    if (existingGroup) {
      return existingGroup;
    }
    // If no existing group, create a default one
    return {
      name: groupName,
      description: `${groupName} AI Art`,
      color: '#AAA8A8'
    };
  });

  const filteredImages = focusedTab
    ? images.filter((img: AiArtImage) => img.groupName === focusedTab)
    : images;

  const findGroupByName = (groupName: string | undefined): AiArtGroup | undefined => {
    if (!groupName) return undefined;
    return dynamicGroups.find((group: any) => group.name === groupName);
  };

  const handleImageClick = (image: AiArtImage) => {
    setSelectedImage(image);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    setSelectedImage(null);
    // Restore body scroll when modal is closed
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    const currentIndex = filteredImages.findIndex((img: AiArtImage) => img.imageUrl === selectedImage.imageUrl);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === filteredImages.length - 1 ? 0 : currentIndex + 1;
    }
    
    setSelectedImage(filteredImages[newIndex]);
  };

  // Cleanup body scroll on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!selectedImage) return;
      
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        navigateImage('prev');
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        navigateImage('next');
      } else if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [selectedImage, navigateImage]);

  const handleTabClick = (tabName: string) => {
    // Prevent animation if this tab is already focused
    if (focusedTab === tabName) return;
    
    setActiveTab(tabName);
    setIsTransitioning(true);
    
    const clickedTab = tabRefs.current.get(tabName);
    if (!clickedTab || !clearButtonRef.current) return;

    // Create GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setFocusedTab(tabName);
        setIsTransitioning(false);
      }
    });

    // Step 1: Set all tabs to absolute positioning to prevent layout shift when X appears
    tabRefs.current.forEach((tab, groupName) => {
      const rect = tab.getBoundingClientRect();
      const container = tabsContainerRef.current?.getBoundingClientRect();
      if (container) {
        tl.set(tab, {
          position: "absolute",
          left: rect.left - container.left,
          top: rect.top - container.top,
        }, 0);
      }
    });

    // Step 2: Now show the clear button (won't cause layout shift since tabs are absolute)
    tl.set(clearButtonRef.current, { display: "block" }, 0.1)
      .to(clearButtonRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.7)"
      }, 0.1);

    // Step 3: Hide other tabs FIRST (before selected tab moves)
    tabRefs.current.forEach((tab, groupName) => {
      if (groupName !== tabName) {
        tl.to(tab, {
          opacity: 0,
          scale: 0.9,
          duration: 0.2,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(tab, { display: "none" });
          }
        }, 0.1);
      }
    });

    // Step 3: Calculate exact position next to X and move the clicked tab there
    const clickedTabRect = clickedTab.getBoundingClientRect();
    const clearButtonRect = clearButtonRef.current.getBoundingClientRect();
    const container = tabsContainerRef.current?.getBoundingClientRect();
    
    if (container) {
      // Calculate the distance needed to position tab right next to clear button
      const targetX = clearButtonRect.right + 112 - clickedTabRect.left; // 16px gap
      
      tl.to(clickedTab, {
        x: targetX,
        scale: 1.1,
        backgroundColor: findGroupByName(tabName)?.color || "#AAA8A8",
        color: "#000",
        duration: 0.4,
        ease: "power2.inOut"
      }, 0.2);
    }

    
  };

  const handleClearFocus = () => {
    setIsTransitioning(true);
    
    const activatedTab = tabRefs.current.get(focusedTab || "");
    if (!activatedTab || !clearButtonRef.current) return;

    // Create GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setFocusedTab(null);
        setIsTransitioning(false);
      }
    });

    // Step 1: Move the selected tab back to its original position and reset its style
    tl.to(activatedTab, {
      x: 0,
      scale: 1,
      backgroundColor: "transparent",
      color: "#AAA8A8",
      duration: 0.4,
      ease: "power2.inOut"
    });

    // Step 2: Hide the clear button
    tl.to(clearButtonRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.2,
      ease: "power2.inOut"
    }, 0.2)
    .set(clearButtonRef.current, { display: "none" });

    // Step 3: NOW show all other hidden tabs back (after selected tab has moved back)
    tabRefs.current.forEach((tab, groupName) => {
      if (groupName !== focusedTab) {
        tl.set(tab, { display: "block" }, 0.5)
          .to(tab, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "power2.inOut"
          }, 0.5);
      }
    });

    // Step 4: Reset all tabs back to normal positioning (not absolute)
    tabRefs.current.forEach((tab, groupName) => {
      tl.set(tab, {
        position: "static",
        left: "auto",
        top: "auto",
      }, 0.9);
    });
  };

  // Set ref for tab buttons
  const setTabRef = (groupName: string) => (el: HTMLButtonElement | null) => {
    if (el) {
      tabRefs.current.set(groupName, el);
    } else {
      tabRefs.current.delete(groupName);
    }
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* NavBar */}
      <NavBar
        title="Reese Latimer •"
        contactText="Let's get in touch"
        isHomePage={false}
        textColor="text-hero-white"
        forceTransparent={true}
        useGradient={true}
      />

      {/* Modal directly under NavBar, desktop centers like before; mobile fills viewport */}
      {selectedImage && (
        <div className="z-[2000] sticky inset-0 w-screen h-screen p-3 sm:inset-auto sm:w-auto sm:h-auto sm:top-[35%] sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-[400px] sm:max-h-[500px] sm:m-[-250px]">
          <div className="backdrop-blur-md bg-[#777]/30 flex flex-col rounded-2xl pt-4 px-5 h-full border border-[#AAA8A880] sm:max-h-[800px]">
            {/* Top Controls: Close and Navigation */}
            <div className="flex items-center justify-between mb-4">
              {/* Close button */}
              <button
                onClick={closeModal}
                className="h-10 w-10 rounded-full bg-black/30 text-white transition-all duration-300 hover:bg-black/70 flex items-center justify-center"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Navigation buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigateImage('prev')}
                  className="h-10 w-10 rounded-full bg-black/30 text-white transition-all duration-300 hover:bg-black/70 flex items-center justify-center"
                  aria-label="Previous image"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="h-10 w-10 rounded-full bg-black/30 text-white transition-all duration-300 hover:bg-black/70 flex items-center justify-center"
                  aria-label="Next image"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <PixelizeImage
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="max-h-[70vh] w-full rounded-xl object-contain"
                disableEffect={true}
              />
              {selectedGroup && (
                <div
                  className="backdrop-blur-md bg-[#444]/30 absolute right-2 top-2 rounded-full px-3 py-1 text-sm font-medium"
                  style={{ backgroundColor: `${selectedGroup.color || "#AAA8A8"}80`, color: "#000" }}
                >
                  {selectedGroup.name}
                </div>
              )}
            </div>

            {/* Prompt - Fixed title with scrollable text */}
            {selectedImage.prompt && (
              <div className="flex-1 flex flex-col pt-6 pb-5 -mx-5 px-5 min-h-0">
                {/* Fixed title at top */}
                <h3 className="mb-4 text-lg font-medium text-white flex-shrink-0">{selectedImage.title}</h3>
                
                {/* Scrollable text content */}
                <div className="flex-1 overflow-y-scroll modal-scroll pr-2 min-h-0" 
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(170, 168, 168, 0.3) transparent'
                  }}
                >
                  <p className="text-sm leading-relaxed text-[#fff]">
                    {selectedImage.prompt}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Art Section */}
      <section className="bg-black px-3 py-16 pt-28 md:px-10">
        {error && <p className="mb-4 text-red-500">Error: {error}</p>}

        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-4">
            <div className="mx-auto mb-6 h-[200px] w-[200px] overflow-hidden rounded-full">
              <img
                src="/images/ai_portrait.png"
                alt="AI Portrait"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <h1 className="font-editorial text-project-title-small font-light text-white md:text-project-title">
            {aiArtContent.title}
          </h1>

          <h2 className="mb-4 text-[32px] font-light text-[#AAA8A8]">
            {aiArtContent.subtitle}
          </h2>

          <p className="mx-auto max-w-[400px] text-type-small text-[#AAA8A8]">
            {aiArtContent.description}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 relative h-16" ref={tabsContainerRef}>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex items-center pb-4 pt-2 px-4 gap-4">
              {/* Clear Focus Button (X) - initially hidden */}
              <div 
                ref={clearButtonRef}
                className="flex-shrink-0 opacity-0 scale-75"
                style={{ display: "none" }}
              >
                <button
                  onClick={handleClearFocus}
                  className="h-8 w-8 rounded-full bg-[#AAA8A8]/20 text-[#AAA8A8] hover:bg-[#AAA8A8]/30 hover:text-white flex items-center justify-center"
                  aria-label="Clear filter"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Tab buttons - only show groups that have images */}
              {dynamicGroups.map((group: any, index: number) => {
                return (
                  <button
                    key={group.name}
                    ref={setTabRef(group.name)}
                    onClick={() => handleTabClick(group.name)}
                    className="flex-shrink-0 rounded-full px-6 py-2 text-sm font-medium border border-[#AAA8A8] bg-transparent text-[#AAA8A8] hover:border-white hover:text-white"
                    style={{
                      borderColor: "#AAA8A8"
                    }}
                  >
                    {group.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Images Grid - Masonry Layout */}
        <div className="sm-p-10 bg-black p-3">
          <div className="columns-2 gap-5 md:columns-3 lg:columns-5">
            {filteredImages.length > 0 ? (
              filteredImages.map((image: AiArtImage, index: number) => {
                const group = findGroupByName(image.groupName);
                return (
                  <div
                    key={index}
                    className="group relative cursor-pointer mb-5 break-inside-avoid"
                    onClick={() => handleImageClick(image)}
                  >
                    <PixelizeImage
                      src={image.imageUrl}
                      alt={image.title}
                      className="h-auto w-full object-cover transition-all duration-300 group-hover:opacity-90 rounded-lg"
                      lazy={true}
                    />
                    {group && (
                      <div
                        className="backdrop-blur-sm absolute right-2 top-2 rounded-full px-2 py-1 text-xs font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                          backgroundColor: group.color || "#AAA8A8",
                          color: "#000"
                        }}
                      >
                        {group.name}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="w-full py-16 text-center">
                <p className="text-type-small text-white">
                  {focusedTab ? `No images in ${focusedTab} group.` : "No AI art images available."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer socialLinks={footer?.socialLinks} textColor="white" />
    </div>
  );
}
