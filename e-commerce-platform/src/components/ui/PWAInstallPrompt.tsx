import { useState, useEffect } from 'react';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { pwaInstallManager, isMobile, isPWA } from '../../utils/mobile';
import Button from './Button';

const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Only show on mobile devices that aren't already PWA
    if (!isMobile() || isPWA()) {
      return;
    }

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      return;
    }

    // Listen for install availability
    pwaInstallManager.onInstallAvailable(() => {
      setShowPrompt(true);
    });

    // Show prompt if already available
    if (pwaInstallManager.isInstallAvailable()) {
      setShowPrompt(true);
    }
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const installed = await pwaInstallManager.promptInstall();
      if (installed) {
        setShowPrompt(false);
        localStorage.setItem('pwa-install-accepted', 'true');
      }
    } catch (error) {
      console.log('Install failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-sm">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
              <ArrowDownTrayIcon className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Install StyleHub
              </h3>
              <p className="text-xs text-gray-600">
                Get the app for a better experience
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="Dismiss"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleInstall}
            disabled={isInstalling}
            className="flex-1 text-xs"
          >
            {isInstalling ? 'Installing...' : 'Install'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismiss}
            className="text-xs"
          >
            Later
          </Button>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          ✓ Faster loading • ✓ Offline access • ✓ Home screen shortcut
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt; 