import { useRef } from "react";
import type { About } from "~/types/sanity";
import PixelizeImage from "./PixelizeImage";

interface AboutProps {
  about: About | null;
  error: string | null;
}

export default function About({ about, error }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // Default content in case Sanity data is not available
  const defaultAbout = {
    title: "About",
    mainImageUrl: "/images/about-image.png",
    svgIconUrl: "",
    mainText: "For over half a decade, I have collaborated with multiple brands, teams, and individuals to create high performing interactive web experiences.",
    firstParagraph: "I specialize in optimizing e commerce performance, as well as planning, designing, and programming of web projects. At the the moment, I'm working on freelance and growing my personal portfolio and brand in Denver, Colorado.",
    secondParagraph: "When I'm not designing and developing, you can find me spending time working out, hiking, and playing my guitar."
  };

  // Use Sanity data if available, otherwise use default content
  const content = about || defaultAbout;

  return (
    <section ref={sectionRef} id="about" className="px-3 sm:px-10 py-16 bg-white">
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      {/* About Header */}
      <div className="flex items-start mb-8 border-b border-black pb-4 justify-center">
        <h2 className="text-projects-heading-small sm:text-projects-heading font-editorial font-light text-black mr-4">About</h2>
        <span className="sm:text-projects-subheading text-projects-subheading-small font-editorial font-light text-black">03</span>
      </div>

      {/* About Content */}
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Left Column - Image */}
        <div className="sm:w-1/2">
          <PixelizeImage 
            src={content.mainImageUrl} 
            alt="About image" 
            className="w-full h-auto object-cover rounded-[20px]"
          />
        </div>

        {/* Right Column - Text Content */}
        <div className="sm:w-1/2">
          <div className="flex items-start mb-6">
            {/* SVG Icon */}
            {content.svgIconUrl && (
              <div className="mr-3 mt-2">
                <img 
                  src={content.svgIconUrl} 
                  alt="Info icon" 
                  className="w-12 h-12"
                />
              </div>
            )}
            
            {/* Main Text */}
            <h3 className="text-project-title-small sm:text-project-title font-editorial font-light text-black">
              {content.mainText}
            </h3>
          </div>

          {/* Paragraphs */}
          <div className="space-y-6">
            <p className="text-[20px]">{content.firstParagraph}</p>
            <p className="text-[20px]">{content.secondParagraph}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
