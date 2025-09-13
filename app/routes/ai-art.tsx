import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import type { AiArt, AiArtImage, AiArtGroup, Footer as FooterType } from "~/types/sanity";
import NavBar from "~/components/NavBar";
import Footer from "~/components/Footer";
import { getAiArt, getFooter } from "./api.sanity";

export const meta: MetaFunction = () => {
  return [
    { title: "AI Art | Reese Latimer" },
    { name: "description", content: "Explore AI-generated art by Reese Latimer. Creative technology projects experimenting with artificial intelligence and digital art." },
  ];
};

export const loader: LoaderFunction = async () => {
  try {
    const [aiArt, footer] = await Promise.all([
      getAiArt(),
      getFooter()
    ]);
    
    return { 
      aiArt: aiArt || null,
      footer: footer || { socialLinks: [] },
      error: null 
    };
  } catch (error: unknown) {
    console.error('Error fetching AI Art data:', error);
    return { 
      aiArt: null,
      footer: { socialLinks: [] },
      error: (error as Error).message || 'Failed to fetch data' 
    };
  }
};

export default function AiArt() {
  const { aiArt, footer, error } = useLoaderData<typeof loader>();
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  const aiArtContent = aiArt || {
    title: "AI Art",
    subtitle: "Ai Artist & Creative Technologist",
    description: "I craft AI art for clients and spend my free time experimenting with creative tech projects.",
    images: [],
    groups: []
  };

  const images = aiArt?.images || [];
  const groups = aiArt?.groups || [];

  // Helper function to find group by name
  const findGroupByName = (groupName: string | undefined): AiArtGroup | undefined => {
    if (!groupName) return undefined;
    return groups.find((group: AiArtGroup) => group.name === groupName);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* NavBar Component */}
      <NavBar 
        title="Reese Latimer •"
        contactText="Let's get in touch"
        isHomePage={false}
        textColor="text-hero-white"
        forceTransparent={true}
      />

      {/* AI Art Section */}
      <section className="px-3 md:px-10 py-16 bg-black">
        {error && <p className="text-red-500 mb-4">Error: {error}</p>}

        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-4">
            <img 
              src="/images/ai_portrait.png" 
              alt="AI Portrait" 
              className="w-24 h-24 rounded-full mx-auto mb-6"
            />
          </div>
          
          <h1 className="text-project-title-small md:text-project-title font-editorial font-light text-white mb-4">
            {aiArtContent.title}
          </h1>
          
          <h2 className="text-[32px] font-editorial font-light text-white mb-4">
            {aiArtContent.subtitle}
          </h2>
          
          <p className="text-type-small text-white max-w-2xl mx-auto">
            {aiArtContent.description}
          </p>
          
          <div className="mt-6 text-white">
            <span className="text-type-small">{images.length} images</span>
            <span className="mx-2 text-[#AAA8A8]">•</span>
            <span className="text-type-small text-[#AAA8A8]">
              {new Set(images.map((img: AiArtImage) => img.groupName).filter(Boolean)).size} groups
            </span>
          </div>
        </div>

        {/* Images Grid */}
        <div className="sm-p-10 p-3 bg-black">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {images.length > 0 ? (
              images.map((image: AiArtImage, index: number) => {
                const group = findGroupByName(image.groupName);
                return (
                  <div 
                    key={index} 
                    className="relative group"
                    onMouseEnter={() => setHoveredImage(index)}
                    onMouseLeave={() => setHoveredImage(null)}
                  >
                    <img 
                      src={image.imageUrl} 
                      alt={image.title}
                      className="w-full h-auto object-cover transition-all duration-300 group-hover:opacity-90"
                    />
                    
                    {/* Group Tag on Hover */}
                    {hoveredImage === index && group && (
                      <div 
                        className="absolute top-4 left-4 px-3 py-1 rounded-btn-bdrd text-sm font-medium transition-all duration-300"
                        style={{ 
                          backgroundColor: group.color || '#AAA8A8',
                          color: '#000'
                        }}
                      >
                        {group.name}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-white text-type-small">No AI art images available.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Footer Component */}
      <Footer socialLinks={footer?.socialLinks} />
    </div>
  );
}
