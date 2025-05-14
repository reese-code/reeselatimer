import { Link } from '@remix-run/react';
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="py-16 px-4 sm:px-10 ">
      <div className="flex w-full gap-8 mb-16">
        {/* Menu Links */}
        <div className="w-1/3">
          <h3 className="text-xl mb-4 border-b border-black pb-2">Menu</h3>
          <ul className="space-y-4">
            <li>
              <button 
                onClick={() => scrollToSection('work')}
                className="text-lg font-light hover:underline"
              >
                Work
              </button>
            </li>
            <li>
              <Link 
                to="/contact" 
                className="text-lg font-light hover:underline"
              >
                Contact
              </Link>
            </li>
            <li>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-lg font-light hover:underline"
              >
                About
              </button>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="w-1/3">
          <h3 className="text-xl mb-4 border-b border-black pb-2 ">Socials</h3>
          <ul className="space-y-4">
            {socialLinks && socialLinks.map((link, index) => (
              <li key={index}>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lg font-light hover:underline"
                >
                  {link.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="space-y-12">
        {/* First Line */}
        <div className="flex items-center flex-wrap gap-6">
          <img src="/images/mountain.svg" alt="Mountain" className="w-[78px] h-auto" />
          <span className="text-[65px] font-light leading-none font-editorial">Denver</span>

          <div className="text-[23px] font-neue w-[220px]">
            <div className="flex flex-row justify-between">
              <img src="/images/arrow.svg" alt="Arrow Left" className="w-6 h-auto rotate-180" />
              <div className='text-[23px] font-neue'>39.7392</div>
              <img src="/images/arrow.svg" alt="Arrow Left" className="w-6 h-auto " />
            </div>
            <div className="flex flex-row justify-between">
              <img src="/images/arrow.svg" alt="Arrow Right" className="w-6 h-auto" />
              <div className='text-[23px] font-neue'>104.9903</div>
              <img src="/images/arrow.svg" alt="Arrow Right" className="w-6 h-auto rotate-180" />
            </div>
          </div>

          <span className=" font-light leading-none text-[65px] font-editorial">Colorado</span>
          <img src="/images/state_colorado.svg" alt="Colorado" className="w-[63px] h-auto" />
          <img src="/images/C.svg" alt="C" className="w-[77px] h-auto" />
          <img src="/images/O.svg" alt="O" className="w-[77px] h-auto" />
        </div>

        {/* Second Line */}
        <div className="flex items-center flex-wrap gap-6 border-b pb-6">
          <Link to="/about" className="group font-light inline-block text-[65px] font-editorial transition-all duration-300 hover:underline">
            Creative Studio <span className="font-light font-neue text-[23px]">BY</span> Reese Latimer
          </Link>

          {/* Star SVG */}
          <img src="/images/Star.svg" alt="Star" className="w-[52px] h-auto font-[65px] " />

          {/* Work Together */}
          <Link to="/contact" className="flex items-start gap-2 text-[65px] font-editorial font-light hover:underline transition-all duration-300">
            <span>work</span>
            <img src="/images/connecting_arrow.svg" alt="Connecting Arrow" className="w-[66px] h-auto" />
            <span>together</span>
          </Link>

          <div className="ml-auto">
            <span>©2024</span>
          </div>
        </div>
      </div>
    </footer>
  );
}