import React, { useEffect, useRef, useState } from 'react';

const UnicornStudioEmbed = () => {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [key, setKey] = useState(0); // Force re-render key

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    let timeoutId;

    const initializeUnicornStudio = () => {
      // Force a re-render by updating the key
      setKey(prev => prev + 1);
      
      // Clear any existing UnicornStudio instances
      if (window.UnicornStudio && window.UnicornStudio.destroy) {
        try {
          window.UnicornStudio.destroy();
        } catch (e) {
          console.log('UnicornStudio destroy not available or failed');
        }
      }

      // Reset the initialization flag
      if (window.UnicornStudio) {
        window.UnicornStudio.isInitialized = false;
      }

      // Initialize UnicornStudio
      if (!window.UnicornStudio || !window.UnicornStudio.isInitialized) {
        if (!window.UnicornStudio) {
          window.UnicornStudio = { isInitialized: false };
        }
        
        // Remove existing script if present
        const existingScript = document.querySelector('script[src*="unicornstudio.js"]');
        if (existingScript) {
          existingScript.remove();
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js';
        script.onload = function() {
          // Small delay to ensure DOM is ready
          timeoutId = setTimeout(() => {
            if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
              try {
                window.UnicornStudio.init();
                window.UnicornStudio.isInitialized = true;
                setIsLoaded(true);
              } catch (error) {
                console.error('UnicornStudio initialization failed:', error);
                // Retry after a short delay
                setTimeout(() => {
                  try {
                    window.UnicornStudio.init();
                    window.UnicornStudio.isInitialized = true;
                    setIsLoaded(true);
                  } catch (retryError) {
                    console.error('UnicornStudio retry failed:', retryError);
                  }
                }, 1000);
              }
            }
          }, 100);
        };
        
        (document.head || document.body).appendChild(script);
      } else {
        // UnicornStudio is already loaded, just reinitialize
        timeoutId = setTimeout(() => {
          try {
            if (window.UnicornStudio.init) {
              window.UnicornStudio.init();
              setIsLoaded(true);
            }
          } catch (error) {
            console.error('UnicornStudio reinit failed:', error);
          }
        }, 100);
      }
    };

    // Initialize immediately
    initializeUnicornStudio();

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []); // Empty dependency array to run on every mount

  return (
    <div
      key={key} // Force re-render when key changes
      ref={containerRef}
      data-us-project="ny3zlNrcGhfZeMVpCrgT"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0,
      }}
    />
  );
};

export default UnicornStudioEmbed;
