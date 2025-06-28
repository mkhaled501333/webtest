import { useState, useRef, useEffect } from 'react';
import { XMarkIcon, CameraIcon, ArrowPathIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui';
import type { Product } from '../../types';

interface ARTryOnModalProps {
  product: Product;
  onClose: () => void;
}

const ARTryOnModal = ({ product, onClose }: ARTryOnModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCamera, setHasCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Simulate camera initialization
    const initCamera = async () => {
      try {
        // In a real app, you would use getUserMedia here
        // navigator.mediaDevices.getUserMedia({ video: true })
        
        // Simulate loading time
        setTimeout(() => {
          setIsLoading(false);
          setHasCamera(true);
        }, 2000);
      } catch (error) {
        setIsLoading(false);
        setHasCamera(false);
      }
    };

    initCamera();

    // Cleanup function
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        // In a real app, you would save or share the captured image
        const imageData = canvas.toDataURL('image/png');
        console.log('Captured AR image:', imageData);
      }
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // In a real app, start video recording
    setTimeout(() => setIsRecording(false), 3000); // Auto-stop after 3 seconds for demo
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AR Try-On</h2>
            <p className="text-gray-600">{product.name} by {product.brand.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            /* Loading State */
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Initializing AR camera...</p>
                <p className="text-sm text-gray-500 mt-2">Please allow camera access when prompted</p>
              </div>
            </div>
          ) : !hasCamera ? (
            /* No Camera State */
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <CameraIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Camera Access Required</h3>
                <p className="text-gray-600 mb-4">
                  To use AR try-on, please enable camera access in your browser settings.
                </p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            /* AR Camera View */
            <div className="relative">
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                {/* Simulated Camera Feed */}
                <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <CameraIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">AR Try-On Simulation</p>
                    <p className="text-sm opacity-75">
                      In a real implementation, this would show your camera feed<br/>
                      with the {product.name} virtually overlaid
                    </p>
                  </div>
                </div>

                {/* AR Overlay Elements */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Face Detection Frame */}
                  <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-48 h-64 border-2 border-primary-400 rounded-lg opacity-60">
                    <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-primary-400"></div>
                    <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-primary-400"></div>
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-primary-400"></div>
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-primary-400"></div>
                  </div>

                  {/* Product Info Overlay */}
                  <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm opacity-75">{product.brand.name}</p>
                  </div>

                  {/* Recording Indicator */}
                  {isRecording && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">REC</span>
                    </div>
                  )}
                </div>

                {/* Controls Overlay */}
                {showControls && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                    <div className="flex items-center justify-center gap-4">
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
                        onClick={handleStartRecording}
                        disabled={isRecording}
                        className={isRecording ? 'bg-red-600 hover:bg-red-700' : ''}
                      >
                        <div className={`w-5 h-5 mr-2 ${isRecording ? 'animate-pulse' : ''}`}>
                          {isRecording ? (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1.5"></div>
                          ) : (
                            <CameraIcon className="w-5 h-5" />
                          )}
                        </div>
                        {isRecording ? 'Recording...' : 'Record'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="lg"
                        className="bg-white bg-opacity-20 border-white text-white hover:bg-opacity-30"
                      >
                        <ArrowPathIcon className="w-5 h-5 mr-2" />
                        Flip
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Hidden video and canvas elements for real implementation */}
              <video
                ref={videoRef}
                className="hidden"
                autoPlay
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">How to use AR Try-On:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Position your face within the detection frame</li>
              <li>• Ensure good lighting for best results</li>
              <li>• Take photos or record videos to share</li>
              <li>• Try different colors and sizes available</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                // Add to cart with current selection
                onClose();
              }}
            >
              Add to Cart
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                // Share AR experience
                navigator.share?.({
                  title: `Try on ${product.name}`,
                  text: `Check out this ${product.name} from ${product.brand.name}!`,
                  url: window.location.href
                });
              }}
            >
              Share Experience
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARTryOnModal; 