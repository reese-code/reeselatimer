import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, useEffect } from "react";
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
    
    // Start transition immediately, then set focused after animation begins
    setTimeout(() => {
      setFocusedTab(tabName);
      setIsTransitioning(false);
    }, 500);
  };

  const handleClearFocus = () => {
    setIsTransitioning(true);
    setFocusedTab(null);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
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
        <div className="mb-8 relative h-16">
          <div className="relative">
            {/* Scrollable container when not focused */}
            <div className={`transition-opacity duration-300 ${focusedTab ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex items-center pb-4 pt-2 px-4 gap-4">
                  {groups.map((group: AiArtGroup, index: number) => {
                    const isClickedTab = isTransitioning && activeTab === group.name;
                    return (
                      <button
                        key={group.name}
                        onClick={() => handleTabClick(group.name)}
                        className={`flex-shrink-0 rounded-full px-6 py-2 text-sm font-medium transition-all duration-500 ${
                          isClickedTab
                            ? "text-black scale-110 z-20"
                            : "border border-[#AAA8A8] bg-transparent text-[#AAA8A8] hover:border-white hover:text-white"
                        }`}
                        style={{
                          backgroundColor: isClickedTab 
                            ? group.color || "#AAA8A8" 
                            : "transparent",
                          borderColor: isClickedTab 
                            ? group.color || "#AAA8A8" 
                            : "#AAA8A8",
                          transform: isClickedTab 
                            ? `translateX(${-index * 120 + 40}px) scale(1.1)` 
                            : "translateX(0) scale(1)",
                          opacity: isTransitioning && !isClickedTab ? 0 : 1,
                          transitionDelay: isTransitioning ? "0ms" : `${index * 50}ms`,
                          position: isClickedTab ? "relative" : "static"
                        }}
                      >
                        {group.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Focused state overlay */}
            {focusedTab && (
              <div className="absolute inset-0 flex items-center px-4">
                {/* Clear Focus Button (X) */}
                <div 
                  className="flex-shrink-0 mr-4 transition-all duration-300 delay-200"
                  style={{
                    opacity: focusedTab && !isTransitioning ? 1 : 0,
                    transform: focusedTab && !isTransitioning ? "scale(1)" : "scale(0.8)"
                  }}
                >
                  <button
                    onClick={handleClearFocus}
                    className="h-8 w-8 rounded-full bg-[#AAA8A8]/20 text-[#AAA8A8] hover:bg-[#AAA8A8]/30 hover:text-white transition-all duration-300 flex items-center justify-center"
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

                {/* Focused Tab */}
                {(() => {
                  const focusedGroup = groups.find((g: AiArtGroup) => g.name === focusedTab);
                  return focusedGroup ? (
                    <button
                      className="flex-shrink-0 rounded-full px-6 py-2 text-sm font-medium text-black scale-110 transition-all duration-300 delay-200"
                      style={{
                        backgroundColor: focusedGroup.color || "#AAA8A8",
                        borderColor: focusedGroup.color || "#AAA8A8",
                        opacity: focusedTab && !isTransitioning ? 1 : 0,
                        transform: focusedTab && !isTransitioning ? "scale(1.1)" : "scale(0.9)"
                      }}
                    >
                      {focusedGroup.name}
                    </button>
                  ) : null;
                })()}
              </div>
            )}
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

      {/* Image Modal */}
      {selectedImage && (
        <div className="sticky top-4 left-4 z-[1010] max-w-6xl max-h-[calc(100vh-2rem)]">
          <div className="backdrop-blur-md bg-[#444]/30 flex flex-col overflow-hidden rounded-2xl pt-4 px-5 h-full">
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
                {(() => {
                  const group = findGroupByName(selectedImage.groupName);
                  const bg = group?.color ? `${group.color}80` : "#AAA8A880";
                  return group ? (
                    <div
                      className="backdrop-blur-md bg-[#444]/30 absolute right-2 top-2 rounded-full px-3 py-1 text-sm font-medium"
                      style={{ backgroundColor: bg, color: "#000" }}
                    >
                      {group.name}
                    </div>
                  ) : null;
                })()}
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

      {/* Footer */}
      <Footer socialLinks={footer?.socialLinks} textColor="white" />
    </div>
  );
}
