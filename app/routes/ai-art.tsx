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

  const filteredImages = focusedTab
    ? images.filter((img: AiArtImage) => img.groupName === focusedTab)
    : images;

  const findGroupByName = (groupName: string | undefined): AiArtGroup | undefined => {
    if (!groupName) return undefined;
    return groups.find((group: AiArtGroup) => group.name === groupName);
  };

  const handleImageClick = (image: AiArtImage) => setSelectedImage(image);
  const closeModal = () => setSelectedImage(null);

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    setIsTransitioning(true);
    
    const clickedTab = tabRefs.current.get(tabName);
    if (!clickedTab || !clearButtonRef.current) return;

    // Get the position where the tab should move (next to the clear button)
    const clearButtonRect = clearButtonRef.current.getBoundingClientRect();
    const clickedTabRect = clickedTab.getBoundingClientRect();
    const container = tabsContainerRef.current?.getBoundingClientRect();
    
    if (!container) return;

    // Calculate the target position (next to clear button)
    const targetX = clearButtonRect.right + 16 - clickedTabRect.left; // 16px gap

    // Create GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setFocusedTab(tabName);
        setIsTransitioning(false);
      }
    });

    // Animate the clicked tab moving to position
    tl.to(clickedTab, {
      x: targetX,
      scale: 1.1,
      backgroundColor: findGroupByName(tabName)?.color || "#AAA8A8",
      color: "#000",
      duration: 0.5,
      ease: "power2.inOut"
    });

    // Fade out other tabs
    tabRefs.current.forEach((tab, groupName) => {
      if (groupName !== tabName) {
        tl.to(tab, {
          opacity: 0,
          scale: 0.9,
          duration: 0.3,
          ease: "power2.inOut"
        }, 0);
      }
    });

    // Show clear button
    tl.to(clearButtonRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: "back.out(1.7)"
    }, 0.2);
  };

  const handleClearFocus = () => {
    setIsTransitioning(true);
    
    const activatedTab = tabRefs.current.get(focusedTab || "");
    if (!activatedTab) return;

    // Create GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setFocusedTab(null);
        setIsTransitioning(false);
      }
    });

    // Hide clear button
    tl.to(clearButtonRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.2,
      ease: "power2.inOut"
    });

    // Reset the focused tab position
    tl.to(activatedTab, {
      x: 0,
      scale: 1,
      backgroundColor: "transparent",
      color: "#AAA8A8",
      duration: 0.4,
      ease: "power2.inOut"
    }, 0.1);

    // Show all other tabs
    tabRefs.current.forEach((tab, groupName) => {
      if (groupName !== focusedTab) {
        tl.to(tab, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "power2.inOut"
        }, 0.1);
      }
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
        <div className="z-[2000]  inset-0 w-screen h-screen p-3 sticky sm:inset-auto sm:w-auto sm:h-auto sm:top-[35%] sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-[400px] sm:max-h-[500px] sm:m-[-250px]">
          <div className="backdrop-blur-md bg-[#777]/30 flex flex-col overflow-hidden rounded-2xl pt-4 px-5 h-full border border-[#AAA8A880]">
            {/* Close */}
            <button
              onClick={closeModal}
              className="mb-4 h-10 w-10 rounded-full bg-black/50 text-white transition-all duration-300 hover:bg-black/70"
              aria-label="Close"
            >
              <svg
                className="m-auto block"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 12H5M12 19L5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

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

            {/* Prompt */}
            {selectedImage.prompt && (
              <div className="py-6">
                <h3 className="mb-2 text-lg font-medium text-white">{selectedImage.title}</h3>
                <p className="text-sm leading-relaxed text-[#AAA8A8]">
                  {selectedImage.prompt}
                </p>
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

              {/* Tab buttons */}
              {groups.map((group: AiArtGroup, index: number) => {
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

        {/* Images Grid */}
        <div className="sm-p-10 bg-black p-3">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
            {filteredImages.length > 0 ? (
              filteredImages.map((image: AiArtImage, index: number) => {
                const group = findGroupByName(image.groupName);
                return (
                  <div
                    key={index}
                    className="group relative cursor-pointer"
                    onClick={() => handleImageClick(image)}
                  >
                    <PixelizeImage
                      src={image.imageUrl}
                      alt={image.title}
                      className="h-auto w-full object-cover transition-all duration-300 group-hover:opacity-90"
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
              <div className="col-span-full py-16 text-center">
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
