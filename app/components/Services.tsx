import { useEffect, useRef } from "react";
import type { Service } from "~/types/sanity";
import { gsap } from "gsap";

interface ServicesProps {
  services: Service[];
  error: string | null;
}

export default function Services({ services, error }: ServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (services.length === 0 || !sectionRef.current || !counterRef.current || !cardsRef.current) {
      return;
    }

    let ScrollTrigger: any;

    // Dynamic import to avoid build issues with CommonJS modules
    import("gsap/ScrollTrigger").then((mod) => {
      ScrollTrigger = mod.ScrollTrigger || mod.default || mod;
      gsap.registerPlugin(ScrollTrigger);

      const counterElement = counterRef.current!;
      const cardsElement = cardsRef.current!;
      const serviceCards = cardsElement.querySelectorAll(':scope > div');

      // Initialize service cards with starting animation state
      gsap.set(serviceCards, {
        y: 60,
        opacity: 0
      });

      counterElement.innerHTML = '';

      // Create fixed "0" element
      const fixedZero = document.createElement('div');
      fixedZero.textContent = '0';
      fixedZero.style.position = 'absolute';
      fixedZero.style.top = '0';
      fixedZero.style.left = '0';
      fixedZero.style.height = '250px';
      fixedZero.style.fontSize = '200px';
      fixedZero.style.fontFamily = 'editorial new, serif';
      fixedZero.style.fontWeight = '300';
      fixedZero.style.display = 'flex';
      fixedZero.style.alignItems = 'center';
      fixedZero.style.justifyContent = 'flex-start';
      counterElement.appendChild(fixedZero);

      // Create container to hold scrolling digits
      const digitList = document.createElement('div');
      digitList.style.position = 'absolute';
      digitList.style.top = '0';
      digitList.style.left = '100px'; // Position after the "0"
      digitList.style.width = '100%';

      // Create digits 1 to 3
      for (let i = 1; i <= 3; i++) {
        const digitItem = document.createElement('div');
        digitItem.textContent = String(i);
        digitItem.style.height = '250px';
        digitItem.style.fontSize = '200px';
        digitItem.style.fontFamily = 'editorial new, serif';
        digitItem.style.fontWeight = '300';
        digitItem.style.opacity = '1';
        digitItem.style.display = 'flex';
        digitItem.style.alignItems = 'center';
        digitItem.style.justifyContent = 'flex-start';
        digitList.appendChild(digitItem);
      }

      counterElement.appendChild(digitList);

      // Create scroll animation for the digits
      gsap.to(digitList, {
        y: `-${2 * 250}px`, // 2 because we're going from 1 to 3 (2 transitions)
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: serviceCards[0], // Start when the first card hits the top
          start: "top 80px",
          endTrigger: serviceCards[serviceCards.length - 1],
          end: "top 80px",
          scrub: 0.8,
          markers: false,
        }
      });

      // Animate each service card individually
      serviceCards.forEach((card, index) => {
        gsap.to(card, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          delay: index * 0.1, // Stagger effect
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
            markers: false,
          }
        });
      });
    });

    return () => {
      if (typeof window !== "undefined" && ScrollTrigger) {
        ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
      }
    };
  }, [services]);

  return (
    <section ref={sectionRef} id="services" className="px-3 md:px-10 py-16 bg-white">
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      {/* Services Header */}
      <div className="flex items-start mb-8 border-b border-black pb-0 justify-center">
        <h2 
          className="text-projects-heading-small md:text-projects-heading font-editorial font-light text-black mr-4"
        >
          Services
        </h2>
        <span 
          className="md:text-projects-subheading text-projects-subheading-small font-editorial font-light text-black"
        >
          02
        </span>
      </div>

      {/* Services Content */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-16">
        {/* Fixed Counter */}
        <div className="md:sticky md:top-20 md:self-start md:w-1/2 hidden md:block">
          <div className="relative overflow-hidden h-[190px]">
            <div ref={counterRef} className="absolute top-0 left-0 w-full flex"></div>
          </div>
        </div>

        {/* Service Cards */}
        <div ref={cardsRef} className="flex-1 space-y-12 md:w-1/2">
          {services.length > 0 ? (
            services.map((service) => (
              <div key={service._id} className="border-b border-black pb-8">
                <h3 className="text-project-title-small md:text-project-title font-editorial font-light text-black mb-4">
                  {service.title}
                </h3>
                <p className="text-[20px] mb-6">{service.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {service.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-4 py-2 border border-[#9F9F9F] text-[#9F9F9F] rounded-btn-bdrd text-type-small">
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
