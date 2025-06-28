import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  XMarkIcon, 
  CameraIcon, 
  PhotoIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  ShareIcon,
  HeartIcon,
  ShoppingBagIcon,
  EyeIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { Button, Badge } from '../ui';
import type { Product } from '../../types';
import { useAppStore } from '../../store';

interface EnhancedARTryOnProps {
  product: Product;
  onClose: () => void;
}

interface ARFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
}

interface ARSettings {
  autoFit: boolean;
  showLighting: boolean;
  enableGestures: boolean;
  hd: boolean;
}

const EnhancedARTryOn = ({ product, onClose }: EnhancedARTryOnProps) => {
  const { addToCart, addToWishlist, isInWishlist } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCamera, setHasCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showControls] = useState(true);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [currentLighting, setCurrentLighting] = useState<'day' | 'night' | 'studio'>('day');
  const [isLiked, setIsLiked] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [arFilters, setArFilters] = useState<ARFilters>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0
  });

  const [arSettings, setArSettings] = useState<ARSettings>({
    autoFit: true,
    showLighting: true,
    enableGestures: true,
    hd: false
  });

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        // Simulate camera access request
        setIsLoading(true);
        
        // In real implementation, use:
        // const stream = await navigator.mediaDevices.getUserMedia({ 
        //   video: { 
        //     width: arSettings.hd ? 1920 : 1280,
        //     height: arSettings.hd ? 1080 : 720,
        //     facingMode: 'user'
        //   }
        // });
        // streamRef.current = stream;
        // if (videoRef.current) {
        //   videoRef.current.srcObject = stream;
        // }
        
        // Simulate loading
        setTimeout(() => {
          setIsLoading(false);
          setHasCamera(true);
        }, 2000);
      } catch (error) {
        console.error('Camera access denied:', error);
        setIsLoading(false);
        setHasCamera(false);
      }
    };

    initCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [arSettings.hd]);

  const handleCapture = useCallback(() => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        
        // Apply AR filters to the image
        context.filter = `
          brightness(${arFilters.brightness}%) 
          contrast(${arFilters.contrast}%) 
          saturate(${arFilters.saturation}%) 
          blur(${arFilters.blur}px)
        `;
        
        context.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/png');
        setCapturedImages(prev => [imageData, ...prev.slice(0, 4)]);
      }
    }
  }, [arFilters]);

  const handleShare = () => {
    // In real implementation, integrate with Web Share API
    if (navigator.share) {
      navigator.share({
        title: `${product.name} - AR Try-On`,
        text: `Check out how I look in this ${product.name} from ${product.brand.name}!`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleAddToCart = () => {
    addToCart(
      product,
      selectedSize.id,
      selectedColor.id,
      1
    );
  };

  const toggleWishlist = () => {
    if (isInWishlist(product.id)) {
      // In real implementation, remove from wishlist
      setIsLiked(false);
    } else {
      addToWishlist(product);
      setIsLiked(true);
    }
  };

  const getLightingClass = () => {
    switch (currentLighting) {
      case 'day':
        return 'from-blue-400 to-blue-600';
      case 'night':
        return 'from-purple-900 to-indigo-900';
      case 'studio':
        return 'from-gray-200 to-gray-400';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Enhanced AR Try-On</h2>
              <p className="text-gray-600">{product.name} by {product.brand.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="primary" className="animate-pulse">
              LIVE
            </Badge>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Main AR Camera View */}
          <div className="flex-1 p-6">
            {isLoading ? (
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
                    <SparklesIcon className="w-6 h-6 text-primary-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-gray-700 font-medium">Initializing AR Experience...</p>
                  <p className="text-sm text-gray-500 mt-2">Preparing advanced AR technology</p>
                </div>
              </div>
            ) : !hasCamera ? (
              <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <CameraIcon className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Camera Access Required</h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    To experience our advanced AR try-on technology, please enable camera access.
                  </p>
                  <Button onClick={() => window.location.reload()} className="mr-3">
                    Enable Camera
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    Browse Without AR
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative">
                  {/* Enhanced Camera Simulation */}
                  <div className={`w-full h-full bg-gradient-to-br ${getLightingClass()} flex items-center justify-center relative`}>
                    <div className="text-center text-white relative z-10">
                      <div className="relative mb-4">
                        <EyeIcon className="w-20 h-20 mx-auto opacity-60" />
                        <div className="absolute inset-0 animate-ping">
                          <EyeIcon className="w-20 h-20 mx-auto opacity-20" />
                        </div>
                      </div>
                      <p className="text-xl font-semibold mb-2">Advanced AR Simulation</p>
                      <p className="text-sm opacity-90 max-w-md">
                        Real-time rendering of {product.name} with {selectedColor.name} color
                        in {currentLighting} lighting environment
                      </p>
                    </div>

                    {/* Enhanced AR Overlays */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Advanced Face Detection Grid */}
                      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
                        <div className="relative w-52 h-72">
                          {/* Main detection frame */}
                          <div className="w-full h-full border-2 border-green-400 rounded-lg shadow-lg">
                            {/* Corner indicators */}
                            {[...Array(4)].map((_, i) => (
                              <div
                                key={i}
                                className={`absolute w-4 h-4 border-2 border-green-400 animate-pulse ${
                                  i === 0 ? '-top-2 -left-2 border-l-2 border-t-2 rounded-tl-lg' :
                                  i === 1 ? '-top-2 -right-2 border-r-2 border-t-2 rounded-tr-lg' :
                                  i === 2 ? '-bottom-2 -left-2 border-l-2 border-b-2 rounded-bl-lg' :
                                  '-bottom-2 -right-2 border-r-2 border-b-2 rounded-br-lg'
                                }`}
                              />
                            ))}
                            
                            {/* Scanning lines */}
                            <div className="absolute inset-0 overflow-hidden rounded-lg">
                              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent absolute animate-pulse" 
                                   style={{ animation: 'scan 2s linear infinite' }} />
                            </div>
                          </div>
                          
                          {/* Fit indicators */}
                          <div className="absolute -right-8 top-4 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                            PERFECT FIT
                          </div>
                        </div>
                      </div>

                      {/* Product Info with Enhanced Data */}
                      <div className="absolute top-4 left-4 bg-black bg-opacity-70 backdrop-blur-sm text-white p-4 rounded-xl border border-white border-opacity-20">
                        <div className="flex items-center gap-3 mb-2">
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white"
                            style={{ backgroundColor: selectedColor.hex }}
                          />
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm opacity-90">{product.brand.name}</p>
                          </div>
                        </div>
                        <div className="text-xs space-y-1 opacity-75">
                          <p>Size: {selectedSize.name}</p>
                          <p>Color: {selectedColor.name}</p>
                          <p>Lighting: {currentLighting.charAt(0).toUpperCase() + currentLighting.slice(1)}</p>
                        </div>
                      </div>

                      {/* Recording Indicator */}
                      {isRecording && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl shadow-lg">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                          <span className="font-medium">Recording AR Session</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Control Bar */}
                  {showControls && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-6">
                      <div className="flex items-center justify-between">
                        {/* Left Controls */}
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white bg-opacity-20 border-white text-white hover:bg-opacity-30"
                            onClick={() => setCurrentLighting(currentLighting === 'day' ? 'night' : currentLighting === 'night' ? 'studio' : 'day')}
                          >
                            {currentLighting === 'day' ? <SunIcon className="w-4 h-4" /> : 
                             currentLighting === 'night' ? <MoonIcon className="w-4 h-4" /> : 
                             <SparklesIcon className="w-4 h-4" />}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white bg-opacity-20 border-white text-white hover:bg-opacity-30"
                            onClick={toggleWishlist}
                          >
                            <HeartIcon className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                          </Button>
                        </div>

                        {/* Center Controls */}
                        <div className="flex items-center gap-4">
                          <Button
                            variant="outline"
                            size="lg"
                            className="bg-white bg-opacity-20 border-white text-white hover:bg-opacity-30"
                            onClick={handleCapture}
                          >
                            <PhotoIcon className="w-5 h-5 mr-2" />
                            Capture
                          </Button>
                          
                          <Button
                            variant="primary"
                            size="lg"
                            onClick={() => setIsRecording(!isRecording)}
                            className={isRecording ? 'bg-red-600 hover:bg-red-700' : ''}
                          >
                            <CameraIcon className="w-5 h-5 mr-2" />
                            {isRecording ? 'Stop' : 'Record'}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="lg"
                            className="bg-white bg-opacity-20 border-white text-white hover:bg-opacity-30"
                            onClick={handleShare}
                          >
                            <ShareIcon className="w-5 h-5 mr-2" />
                            Share
                          </Button>
                        </div>

                        {/* Right Controls */}
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white bg-opacity-20 border-white text-white hover:bg-opacity-30"
                            onClick={() => setShowSettings(!showSettings)}
                          >
                            <AdjustmentsHorizontalIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hidden elements for real implementation */}
                <video ref={videoRef} className="hidden" autoPlay muted playsInline />
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}
          </div>

          {/* Enhanced Side Panel */}
          <div className="w-full lg:w-96 border-l border-gray-200 bg-gray-50">
            <div className="p-6 space-y-6">
              {/* Product Selection */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Customize Your Look</h3>
                
                {/* Color Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color: {selectedColor.name}
                  </label>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor.id === color.id 
                            ? 'border-gray-900 scale-110 shadow-lg' 
                            : 'border-gray-300 hover:border-gray-500'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size: {selectedSize.name}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size)}
                        disabled={!size.inStock}
                        className={`py-2 px-3 text-sm font-medium rounded-lg border transition-all ${
                          selectedSize.id === size.id
                            ? 'border-primary-600 bg-primary-600 text-white'
                            : size.inStock
                            ? 'border-gray-300 text-gray-700 hover:border-primary-300'
                            : 'border-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-2"
                    size="lg"
                  >
                    <ShoppingBagIcon className="w-5 h-5" />
                    Add to Cart - ${product.price}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={toggleWishlist}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <HeartIcon className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'Saved to Wishlist' : 'Save to Wishlist'}
                  </Button>
                </div>
              </div>

              {/* Captured Images Gallery */}
              {capturedImages.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Your AR Photos</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {capturedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`AR Capture ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                          <ShareIcon className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AR Settings Panel */}
              {showSettings && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">AR Settings</h4>
                  
                  <div className="space-y-4">
                    {/* Filter Controls */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brightness: {arFilters.brightness}%
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={arFilters.brightness}
                        onChange={(e) => setArFilters(prev => ({ ...prev, brightness: Number(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contrast: {arFilters.contrast}%
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={arFilters.contrast}
                        onChange={(e) => setArFilters(prev => ({ ...prev, contrast: Number(e.target.value) }))}
                        className="w-full"
                      />
                    </div>

                    {/* Quality Settings */}
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={arSettings.hd}
                          onChange={(e) => setArSettings(prev => ({ ...prev, hd: e.target.checked }))}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">HD Quality</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={arSettings.autoFit}
                          onChange={(e) => setArSettings(prev => ({ ...prev, autoFit: e.target.checked }))}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Auto-fit Detection</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for scanning animation */}
      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 1; }
          50% { opacity: 0.5; }
          100% { top: 100%; opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default EnhancedARTryOn; 