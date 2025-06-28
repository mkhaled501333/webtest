import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Box, Sphere, Html } from '@react-three/drei';
import { 
  CubeIcon, 
  ArrowsPointingOutIcon, 
  ArrowsPointingInIcon,
  EyeIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui';
import type { Product } from '../../types';
import * as THREE from 'three';

interface Product3DViewerProps {
  product: Product;
  onARModeToggle?: () => void;
}

// Simulated 3D Product Model Component
function ProductModel({ product, isRotating = true }: { product: Product; isRotating?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current && isRotating) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  // Simulate different product shapes based on category
  const getProductGeometry = () => {
    switch (product.category.toLowerCase()) {
      case 'tops':
      case 'shirts':
        return <Box args={[2, 2.5, 0.3]} />;
      case 'bottoms':
      case 'jeans':
        return <Box args={[1.8, 3, 0.4]} />;
      case 'dresses':
        return <Box args={[2.2, 3.5, 0.3]} />;
      case 'outerwear':
        return <Box args={[2.5, 2.8, 0.5]} />;
      case 'accessories':
        return <Sphere args={[1]} />;
      default:
        return <Box args={[2, 2.5, 0.3]} />;
    }
  };

  // Get primary color from product
  const primaryColor = product.colors[0]?.hex || '#3B82F6';

  return (
    <mesh
      ref={meshRef}
      scale={hovered ? 1.1 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {getProductGeometry()}
      <meshStandardMaterial 
        color={primaryColor} 
        roughness={0.3}
        metalness={0.1}
        transparent
        opacity={0.9}
      />
      
      {/* Product texture overlay */}
      <mesh position={[0, 0, 0.16]}>
        <planeGeometry args={[1.8, 1.8]} />
        <meshBasicMaterial 
          transparent 
          opacity={0.8}
          side={THREE.DoubleSide}
        >
          <primitive 
            object={new THREE.TextureLoader().load(product.images[0])} 
            attach="map" 
          />
        </meshBasicMaterial>
      </mesh>

      {/* Hover info */}
      {hovered && (
        <Html center>
          <div className="bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
            Click and drag to rotate
          </div>
        </Html>
      )}
    </mesh>
  );
}

// Loading component for 3D scene
function Loader() {
  return (
    <Html center>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
        <p className="text-gray-600 text-sm">Loading 3D model...</p>
      </div>
    </Html>
  );
}

// 3D Scene component
function Scene({ product, isRotating, showWireframe }: { 
  product: Product; 
  isRotating: boolean;
  showWireframe: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <ProductModel product={product} isRotating={isRotating} />
      
      {/* Wireframe mode */}
      {showWireframe && (
        <mesh>
          <Box args={[2, 2.5, 0.3]} />
          <meshBasicMaterial wireframe color="#3B82F6" />
        </mesh>
      )}

      <Environment preset="studio" />
      <OrbitControls 
        enableDamping
        dampingFactor={0.05}
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={8}
      />
    </>
  );
}

const Product3DViewer = ({ product, onARModeToggle }: Product3DViewerProps) => {
  const [isRotating, setIsRotating] = useState(true);
  const [showWireframe, setShowWireframe] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  // Size recommendations based on product and user data
  const getSizeRecommendations = () => {
    // This would use actual user measurements in a real implementation
    const userProfile = {
      height: 170, // cm
      weight: 65,  // kg
      chest: 88,   // cm
      waist: 74,   // cm
    };

    // Simple size recommendation algorithm
    const recommendations: string[] = [];
    
    if (product.category.toLowerCase() === 'tops') {
      if (userProfile.chest < 86) recommendations.push('S');
      else if (userProfile.chest < 92) recommendations.push('M');
      else if (userProfile.chest < 98) recommendations.push('L');
      else recommendations.push('XL');
    }

    return {
      recommended: recommendations[0] || 'M',
      confidence: 85,
      alternatives: product.sizes.map(s => s.name).filter(s => s !== recommendations[0])
    };
  };

  const sizeRec = getSizeRecommendations();

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${
      isFullscreen ? 'fixed inset-0 z-50 m-4' : 'h-96'
    }`}>
      {/* 3D Viewer Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h3 className="font-semibold text-gray-900">3D Preview</h3>
          <p className="text-sm text-gray-600">{product.name}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsRotating(!isRotating)}
            className="flex items-center gap-1"
          >
            {isRotating ? <PlayIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
            {isRotating ? 'Pause' : 'Rotate'}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={toggleFullscreen}
            className="flex items-center gap-1"
          >
            {isFullscreen ? 
              <ArrowsPointingInIcon className="w-4 h-4" /> : 
              <ArrowsPointingOutIcon className="w-4 h-4" />
            }
          </Button>

          {isFullscreen && (
            <Button
              size="sm"
              variant="outline"
              onClick={toggleFullscreen}
            >
              ✕
            </Button>
          )}
        </div>
      </div>

      {/* 3D Canvas */}
      <div className={`relative ${isFullscreen ? 'h-5/6' : 'h-80'}`}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}
        >
          <Suspense fallback={<Loader />}>
            <Scene 
              product={product} 
              isRotating={isRotating}
              showWireframe={showWireframe}
            />
          </Suspense>
        </Canvas>

        {/* 3D Controls Overlay */}
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Mouse:</strong> Rotate view</p>
            <p><strong>Scroll:</strong> Zoom in/out</p>
            <p><strong>Touch:</strong> Pinch to zoom</p>
          </div>
        </div>

        {/* Color Selector Overlay */}
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Colors:</p>
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full border-2 ${
                  selectedColor.id === color.id ? 'border-gray-900' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Size Recommendations */}
      {!isFullscreen && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Size Recommendation</h4>
              <p className="text-sm text-gray-600">
                Based on your profile: <strong className="text-primary-600">{sizeRec.recommended}</strong>
                <span className="text-green-600 ml-1">({sizeRec.confidence}% match)</span>
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowWireframe(!showWireframe)}
                className="flex items-center gap-1"
              >
                <CubeIcon className="w-4 h-4" />
                {showWireframe ? 'Hide' : 'Show'} Structure
              </Button>

              {onARModeToggle && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={onARModeToggle}
                  className="flex items-center gap-1"
                >
                  <EyeIcon className="w-4 h-4" />
                  Try AR
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product3DViewer; 