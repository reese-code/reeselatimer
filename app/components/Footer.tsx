import { useLocation } from '@remix-run/react';
import { TransitionLink } from './PageTransition';
import { useEffect, useState } from 'react';

interface SocialLink {
  platform: string;
  url: string;
}

interface FooterProps {
  socialLinks?: SocialLink[];
}

export default function Footer({ socialLinks: propSocialLinks }: FooterProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(propSocialLinks || []);

  useEffect(() => {
    if (!propSocialLinks || propSocialLinks.length === 0) {
      // Placeholder for data fetching logic if needed
    }
  }, [propSocialLinks]);

  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="pt-16 px-4 md:px-10 ">
      <div className="flex w-full gap-5 md:gap-10 mb-16">
        {/* Menu Links */}
        <div className="w-1/2 md:w-1/3">
          <h3 className="text-xl mb-4 border-b border-black pb-2">Menu</h3>
          <ul className="flex flex-col gap-[10px]">
            <li>
              {isHomePage ? (
                <button 
                  onClick={() => scrollToSection('hero')}
                  className="text-type-small font-light hover:underline"
                >
                  Index
                </button>
              ) : (
                <TransitionLink 
                  to="/#hero" 
                  className="text-type-small font-light hover:underline"
                >
                  Index
                </TransitionLink>
              )}
            </li>
            <li>
              {isHomePage ? (
                <button 
                  onClick={() => scrollToSection('work')}
                  className="text-type-small font-light hover:underline"
                >
                  Work
                </button>
              ) : (
                <TransitionLink 
                  to="/#work" 
                  className="text-type-small font-light hover:underline"
                >
                  Work
                </TransitionLink>
              )}
            </li>
            <li>
              <TransitionLink 
                to="/contact" 
                className="text-type-small font-light hover:underline"
              >
                Contact
              </TransitionLink>
            </li>
            <li>
              {isHomePage ? (
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-type-small font-light hover:underline"
                >
                  About
                </button>
              ) : (
                <TransitionLink 
                  to="/#about" 
                  className="text-type-small font-light hover:underline"
                >
                  About
                </TransitionLink>
              )}
            </li>
            <li>
              <TransitionLink 
                to="/ai-art" 
                className="text-type-small font-light hover:underline"
              >
                AI Art
              </TransitionLink>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="w-1/2 md:w-1/3">
          <h3 className="text-xl mb-4 border-b border-black pb-2 ">Socials</h3>
          <ul className="flex flex-col gap-[10px]">
            {socialLinks && socialLinks.map((link, index) => (
              <li key={index}>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-type-small font-light hover:underline"
                >
                  {link.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex w-auto flex-col">
        {/* First Line */}
        <div className="flex items-center flex-wrap gap-4">
          <img src="/images/mountain.svg" alt="Mountain" className="w-[48px] md:w-[78px] h-auto" />
          <span className="text-[36px] md:text-[65px] font-light leading-none font-editorial">Denver</span>

          <div className="text-[23px] font-neue w-[140px] md:w-[220px]">
            <div className="flex flex-row justify-between">
              <img src="/images/arrow.svg" alt="Arrow Left" className="w-4 md:w-6 h-auto rotate-180" />
              <div className='text-[16px] md:text-[23px] font-neue'>39.7392</div>
              <img src="/images/arrow.svg" alt="Arrow Left" className="w-4 md:w-6 h-auto " />
            </div>
            <div className="flex flex-row justify-between">
              <img src="/images/arrow.svg" alt="Arrow Right" className="w-4 md:w-6 h-auto" />
              <div className='text-[16px] md:text-[23px] font-neue'>104.9903</div>
              <img src="/images/arrow.svg" alt="Arrow Right" className="w-4 md:w-6 h-auto rotate-180" />
            </div>
          </div>

          <span className=" font-light leading-none text-[36px] md:text-[65px] font-editorial">Colorado</span>
          <img src="/images/state_colorado.svg" alt="Colorado" className="w-[42px] md:w-[63px] h-auto" />
          <img src="/images/C.svg" alt="C" className="w-[42px] md:w-[77px] h-auto" />
          <img src="/images/O.svg" alt="O" className="w-[42px] md:w-[77px] h-auto" />
        </div>

        {/* Second Line */}
        <div className="flex items-center flex-wrap gap-4 pb-6">
          {isHomePage ? (
            <button 
              onClick={() => scrollToSection('about')}
              className="group font-light inline-block text-[36px] md:text-[65px] font-editorial transition-all duration-300 hover:underline"
            >
              Creative Studio <span className="font-light font-neue text-[16px] md:text-[23px]">BY</span> Reese Latimer
            </button>
          ) : (
            <TransitionLink 
              to="/#about" 
              className="group font-light inline-block text-[36px] md:text-[65px] font-editorial transition-all duration-300 hover:underline"
            >
              Creative Studio <span className="font-light font-neue text-[16px] md:text-[23px]">BY</span> Reese Latimer
            </TransitionLink>
          )}

          {/* Star SVG */}
          <img src="/images/Star.svg" alt="Star" className="w-[32px] md:w-[52px] h-auto text-[36px] md:text-[65px] " />

          {/* Work Together */}
          <TransitionLink to="/contact" className="flex items-start gap-2 text-[36px] md:text-[65px] font-editorial font-light hover:underline transition-all duration-300">
            <span>work</span>
            <img src="/images/connecting_arrow.svg" alt="Connecting Arrow" className="w-[40px] md:w-[66px] h-auto" />
            <span>together</span>
          </TransitionLink>

          <div className="ml-auto text-type-small">
            <span>©2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
