import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import type { AiArt, AiArtImage, Footer as FooterType } from "~/types/sanity";
import NavBar from "~/components/NavBar";
import Footer from "~/components/Footer";
import { getAiArt, getAiArtImages, getFooter } from "./api.sanity";

export const meta: MetaFunction = () => {
  return [
    { title: "AI Art | Reese Latimer" },
    { name: "description", content: "Explore AI-generated art by Reese Latimer. Creative technology projects experimenting with artificial intelligence and digital art." },
  ];
};

export const loader: LoaderFunction = async () => {
  try {
    const [aiArt, aiArtImages, footer] = await Promise.all([
      getAiArt(),
      getAiArtImages(),
      getFooter()
    ]);
    
    return { 
      aiArt: aiArt || null,
      aiArtImages: aiArtImages || [],
      footer: footer || { socialLinks: [] },
      error: null 
    };
  } catch (error: unknown) {
    console.error('Error fetching AI Art data:', error);
    return { 
      aiArt: null,
      aiArtImages: [],
      footer: { socialLinks: [] },
      error: (error as Error).message || 'Failed to fetch data' 
    };
  }
};

export default function AiArt() {
  const { aiArt, aiArtImages, footer, error } = useLoaderData<typeof loader>();
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const aiArtContent = aiArt || {
    title: "AI Art",
    subtitle: "Ai Artist & Creative Technologist",
    description: "I craft AI art for clients and spend my free time experimenting with creative tech projects."
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
            <span className="text-type-small">{aiArtImages.length} images</span>
            <span className="mx-2 text-[#AAA8A8]">•</span>
            <span className="text-type-small text-[#AAA8A8]">
              {new Set(aiArtImages.map((img: AiArtImage) => img.group?.name)).size} groups
            </span>
          </div>
        </div>

        {/* Images Grid */}
        <div className="p-10 bg-black">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {aiArtImages.length > 0 ? (
              aiArtImages.map((image: AiArtImage) => (
                <div 
                  key={image._id} 
                  className="relative group"
                  onMouseEnter={() => setHoveredImage(image._id)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <img 
                    src={image.imageUrl} 
                    alt={image.title}
                    className="w-full h-auto object-cover transition-all duration-300 group-hover:opacity-90"
                  />
                  
                  {/* Group Tag on Hover */}
                  {hoveredImage === image._id && image.group && (
                    <div 
                      className="absolute top-4 left-4 px-3 py-1 rounded-btn-bdrd text-sm font-medium transition-all duration-300"
                      style={{ 
                        backgroundColor: image.group.color || '#AAA8A8',
                        color: '#000'
                      }}
                    >
                      {image.group.name}
                    </div>
                  )}
                </div>
              ))
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
