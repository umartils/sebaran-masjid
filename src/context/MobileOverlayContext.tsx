// context/MobileOverlayContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const MOBILE_BREAKPOINT = 800; // samakan dengan breakpoint di SCSS

type MobileOverlayContextType = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
};

const MobileOverlayContext = createContext<
  MobileOverlayContextType | undefined
>(undefined);

export function MobileOverlayProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
    );

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    // Set state awal sesuai ukuran viewport asli
    handleChange(mediaQuery);
    setIsSidebarOpen(!mediaQuery.matches);

    // Pantau perubahan ukuran viewport (misal resize browser atau rotate device)
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <MobileOverlayContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        isChatOpen,
        setIsChatOpen,
        isMobile,
        setIsMobile,
      }}
    >
      {children}
    </MobileOverlayContext.Provider>
  );
}

export function useMobileOverlay() {
  const ctx = useContext(MobileOverlayContext);
  if (!ctx) {
    throw new Error('useMobileOverlay must be used within MobileOverlayProvider');
  }
  return ctx;
}