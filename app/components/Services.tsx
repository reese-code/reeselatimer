import { useEffect, useRef } from "react";
import type { Service } from "~/types/sanity";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ServicesProps {
  services: Service[];
  error: string | null;
}

export default function Services({ services, error }: ServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    if (services.length === 0 || !sectionRef.current || !counterRef.current || !cardsRef.current) {
      return;
    }

    // Create a counter animation that updates as we scroll through the services
    const totalServices = services.length;
    const counterElement = counterRef.current;
    const cardsElement = cardsRef.current;
    
    // Set up the scroll animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        scrub: true,
      }
    });

    // Animate the counter from 1 to the total number of services
    tl.fromTo(
      counterElement,
      { innerHTML: "01" },
      {
        innerHTML: totalServices.toString().padStart(2, '0'),
        duration: totalServices,
        snap: { innerHTML: 1 },
        onUpdate: function() {
          // Format the number with leading zero
          const currentValue = Math.round(this.targets()[0].innerHTML);
          this.targets()[0].innerHTML = currentValue.toString().padStart(2, '0');
        }
      }
    );

    // Clean up ScrollTrigger on component unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [services]);

  return (
    <section ref={sectionRef} id="services" className="px-3 sm:px-10 py-16 bg-white">
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      
      {/* Services Header */}
      <div className="flex items-start mb-8 border-b border-black pb-4 justify-center">
        <h2 className="text-projects-heading-small sm:text-projects-heading font-editorial font-light text-black mr-4">Services</h2>
        <span className="sm:text-projects-subheading text-projects-subheading-small font-editorial font-light text-black">02</span>
      </div>
      
      {/* Services Content */}
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 ">
        {/* Fixed Counter */}
        <div className="sm:sticky sm:top-1/4 sm:self-start w-1/2">
          <div ref={counterRef} className="text-[120px] sm:text-[200px] font-editorial font-light leading-none">
            01
          </div>
        </div>
        
        {/* Service Cards */}
        <div ref={cardsRef} className="flex-1 space-y-12 w-1/2">
          {services.length > 0 ? (
            services.map((service, index) => (
              <div key={service._id} className="border-b border-black pb-8">
                <h3 className="text-project-title-small sm:text-project-title font-editorial font-light text-black mb-4">
                  {service.title}
                </h3>
                <p className="text-[20px] mb-6">
                  {service.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {service.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex} 
                      className="px-4 py-2 border border-black rounded-full text-sm"
                    >
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
