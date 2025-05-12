import { useEffect, useRef } from "react";
import type { Service } from "~/types/sanity";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ServicesProps {
  services: Service[];
  error: string | null;
}

gsap.registerPlugin(ScrollTrigger);

export default function Services({ services, error }: ServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (services.length === 0 || !sectionRef.current || !counterRef.current || !cardsRef.current) {
      return;
    }

    const counterElement = counterRef.current;
    const cardsElement = cardsRef.current;
    const serviceCards = cardsElement.querySelectorAll(':scope > div');

    counterElement.innerHTML = '';

    // Create container to hold all numbers
    const numberList = document.createElement('div');
    numberList.style.position = 'absolute';
    numberList.style.top = '0';
    numberList.style.left = '0';
    numberList.style.width = '100%';

    // Create numbers 1 to 3 regardless of service.number
    for (let i = 1; i <= 3; i++) {
      const numberItem = document.createElement('div');
      numberItem.textContent = String(i).padStart(2, '0');
      numberItem.style.height = '250px';
      numberItem.style.fontSize = '200px';
      numberItem.style.fontFamily = 'editorial new, serif';
      numberItem.style.fontWeight = '300';
      numberItem.style.opacity = '1';
      numberItem.style.display = 'flex';
      numberItem.style.alignItems = 'center';
      numberItem.style.justifyContent = 'flex-start';
      numberList.appendChild(numberItem);
      
    }

    counterElement.appendChild(numberList);

    gsap.to(numberList, {
      y: () => `-${2 * 200}px`, // 2 because we're going from 1 to 3 (2 transitions)
      ease: "linear",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top", // Start when the section enters the viewport
        endTrigger: serviceCards[serviceCards.length - 1], // Target the last service card
        end: "top top", // End when the last card hits the top of the viewport
        scrub: 0.8,
        markers: true, // Set to true for debugging
      },
    });

    return () => ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }, [services]);

  return (
    <section ref={sectionRef} id="services" className="px-3 sm:px-10 py-16 bg-white mb-[1000px]">
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      {/* Services Header */}
      <div className="flex items-start mb-8 border-b border-black pb-4 justify-center">
        <h2 className="text-projects-heading-small sm:text-projects-heading font-editorial font-light text-black mr-4">Services</h2>
        <span className="sm:text-projects-subheading text-projects-subheading-small font-editorial font-light text-black">02</span>
      </div>

      {/* Services Content */}
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
        {/* Fixed Counter */}
        <div className="sm:sticky sm:top-20 sm:self-start sm:w-1/3">
          <div className="relative overflow-hidden h-[250px]">
            <div ref={counterRef} className="absolute top-0 left-0 w-full">0</div>
          </div>
        </div>

        {/* Service Cards */}
        <div ref={cardsRef} className="flex-1 space-y-12 sm:w-2/3">
          {services.length > 0 ? (
            services.map((service) => (
              <div key={service._id} className="border-b border-black pb-8">
                <h3 className="text-project-title-small sm:text-project-title font-editorial font-light text-black mb-4">
                  {service.title}
                </h3>
                <p className="text-[20px] mb-6">{service.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {service.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-4 py-2 border border-black rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No services available.</p>
          )}
        </div>
      </div>
    </section>
  );
}
