// Mobile utility functions for StyleHub

// Mobile device detection
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// iOS device detection
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Android device detection
export const isAndroid = (): boolean => {
  return /Android/i.test(navigator.userAgent);
};

// Check if running as PWA
export const isPWA = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
};

// Check if PWA installation is available
export const canInstallPWA = (): boolean => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

// Mobile viewport utilities
export const getViewportHeight = (): number => {
  return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
};

export const getViewportWidth = (): number => {
  return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
};

// Safe area utilities for mobile notches
export const getSafeAreaInsets = () => {
  const style = getComputedStyle(document.documentElement);
  return {
    top: style.getPropertyValue('--safe-area-inset-top') || '0px',
    right: style.getPropertyValue('--safe-area-inset-right') || '0px',
    bottom: style.getPropertyValue('--safe-area-inset-bottom') || '0px',
    left: style.getPropertyValue('--safe-area-inset-left') || '0px',
  };
};

// PWA Installation Manager
export class PWAInstallManager {
  private deferredPrompt: any = null;
  private installCallbacks: Array<() => void> = [];

  constructor() {
    this.setupInstallPrompt();
  }

  private setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.notifyInstallAvailable();
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      console.log('PWA was installed');
    });
  }

  public isInstallAvailable(): boolean {
    return this.deferredPrompt !== null;
  }

  public async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
    
    return outcome === 'accepted';
  }

  public onInstallAvailable(callback: () => void) {
    this.installCallbacks.push(callback);
  }

  private notifyInstallAvailable() {
    this.installCallbacks.forEach(callback => callback());
  }
}

// Mobile performance utilities
export const optimizeForMobile = () => {
  // Disable hover effects on mobile
  if (isMobile()) {
    document.body.classList.add('mobile-device');
  }

  // Handle orientation changes
  window.addEventListener('orientationchange', () => {
    // Force reflow after orientation change
    setTimeout(() => {
      window.scrollTo(0, window.scrollY);
    }, 100);
  });

  // Optimize touch events
  document.addEventListener('touchstart', () => {}, { passive: true });
  document.addEventListener('touchmove', () => {}, { passive: true });
};

// Mobile-specific navigation helpers
export const handleMobileShare = async (data: {
  title?: string;
  text?: string;
  url?: string;
}) => {
  if (navigator.share && isMobile()) {
    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      console.log('Error sharing:', error);
      return false;
    }
  }
  
  // Fallback: copy to clipboard
  if (data.url && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(data.url);
      return true;
    } catch (error) {
      console.log('Error copying to clipboard:', error);
      return false;
    }
  }
  
  return false;
};

// Mobile-specific image optimization
export const getOptimizedImageUrl = (baseUrl: string, width?: number): string => {
  if (!width) {
    width = isMobile() ? 400 : 800;
  }
  
  // Adjust for device pixel ratio on mobile
  if (isMobile() && window.devicePixelRatio > 1) {
    width = Math.round(width * window.devicePixelRatio);
  }
  
  // Add width parameter to image URL (if your CDN supports it)
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}w=${width}&q=75&auto=format`;
};

// Mobile keyboard handling
export const setupMobileKeyboardHandling = () => {
  if (!isMobile()) return;

  let initialViewportHeight = getViewportHeight();
  
  const handleResize = () => {
    const currentHeight = getViewportHeight();
    const heightDiff = initialViewportHeight - currentHeight;
    
    // Keyboard is probably open if height decreased significantly
    if (heightDiff > 150) {
      document.body.classList.add('keyboard-open');
    } else {
      document.body.classList.remove('keyboard-open');
    }
  };

  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      initialViewportHeight = getViewportHeight();
      handleResize();
    }, 500);
  });
};

// Initialize mobile optimizations
export const initMobileOptimizations = () => {
  optimizeForMobile();
  setupMobileKeyboardHandling();
  
  // Add mobile-specific CSS classes
  document.documentElement.classList.add(isMobile() ? 'mobile' : 'desktop');
  
  if (isIOS()) {
    document.documentElement.classList.add('ios');
  } else if (isAndroid()) {
    document.documentElement.classList.add('android');
  }
  
  if (isPWA()) {
    document.documentElement.classList.add('pwa');
  }
};

// Export PWA manager instance
export const pwaInstallManager = new PWAInstallManager(); 