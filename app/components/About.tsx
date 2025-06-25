import { useRef } from "react";
import type { About } from "~/types/sanity";
import PixelizeImage from "./PixelizeImage";

interface AboutProps {
  about: About | null;
  error: string | null;
}

export default function About({ about, error }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const defaultAbout = {
    title: "About",
    mainImageUrl: "/images/action_figure_reese.png",
    svgIconUrl: "/images/about-graphic.svg",
    mainText: "For over half a decade, I have collaborated with multiple brands, teams, and individuals to create high performing interactive web experiences.",
    firstParagraph: "I specialize in optimizing e commerce performance, as well as planning, designing, and programming of web projects. At the the moment, I'm working on freelance and growing my personal portfolio and brand in Denver, Colorado.",
    secondParagraph: "When I'm not designing and developing, you can find me spending time working out, hiking, and playing my guitar."
  };

  const content = about || defaultAbout;

  return (
    <section ref={sectionRef} id="about" className="px-3 md:px-10 py-16 bg-white">
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      {/* About Header */}
      <div className="flex items-start mb-8 border-b border-black pb-4 justify-center">
        <h2 
          className="text-projects-heading-small md:text-projects-heading font-editorial font-light text-black mr-4"
        >
          About
        </h2>
        <span 
          className="md:text-projects-subheading text-projects-subheading-small font-editorial font-light text-black"
        >
          03
        </span>
      </div>

      {/* About Content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Image */}
        <div className="md:w-1/3">
          <PixelizeImage 
            src="/images/ai_portrait.png"
            alt="About image" 
            className="w-full h-auto object-cover rounded-[20px]"
          />
        </div>

        {/* Right Column - Text Content */}
        <div className="md:w-2/3 relative">
          {/* SVG Icon */}
          <img 
            src="/images/about-graphic.svg" 
            alt="Info icon" 
            className="absolute top-[2px] left-0 w-[46.5px] md:w-[85px] h-auto"
          />

          {/* Main Text - only indent the first line */}
          <h3 className="indent-[46px] md:indent-[83px] text-project-title-small md:text-project-title font-editorial font-light text-black mb-6 leading-tight">
            {content.mainText}
          </h3>

          {/* Paragraphs */}
          <div className="space-y-6 md:w-[500px]">
            <p className="text-[20px]">{content.firstParagraph}</p>
            <p className="text-[20px]">{content.secondParagraph}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
