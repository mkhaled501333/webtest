// Performance monitoring and optimization utilities
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();

  /**
   * Start monitoring a specific metric
   */
  startMonitoring(metricName: string) {
    if (this.observers.has(metricName)) {
      return; // Already monitoring
    }

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.recordMetric(metricName, entry.duration);
      });
    });

    observer.observe({ 
      entryTypes: ['measure', 'navigation', 'resource', 'paint'] 
    });
    
    this.observers.set(metricName, observer);
  }

  /**
   * Record a custom metric
   */
  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
  }

  /**
   * Get average for a metric
   */
  getAverage(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;
    
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Get performance report
   */
  getReport(): PerformanceReport {
    const report: PerformanceReport = {
      timestamp: Date.now(),
      metrics: {},
      recommendations: []
    };

    // Collect metrics
    this.metrics.forEach((values, name) => {
      if (values.length > 0) {
        report.metrics[name] = {
          average: this.getAverage(name),
          min: Math.min(...values),
          max: Math.max(...values),
          count: values.length
        };
      }
    });

    // Generate recommendations
    report.recommendations = this.generateRecommendations(report.metrics);

    return report;
  }

  private generateRecommendations(metrics: Record<string, MetricData>): string[] {
    const recommendations: string[] = [];

    // Check render performance
    if (metrics['3d-render']?.average > 16.67) {
      recommendations.push('3D rendering is dropping frames. Consider reducing polygon count or texture resolution.');
    }

    if (metrics['ar-processing']?.average > 33) {
      recommendations.push('AR processing is slow. Consider reducing camera resolution or processing frequency.');
    }

    if (metrics['bundle-size']?.average > 2000000) { // 2MB
      recommendations.push('Bundle size is large. Consider code splitting or lazy loading for 3D components.');
    }

    return recommendations;
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(metricName?: string) {
    if (metricName) {
      const observer = this.observers.get(metricName);
      if (observer) {
        observer.disconnect();
        this.observers.delete(metricName);
      }
    } else {
      // Stop all monitoring
      this.observers.forEach((observer) => observer.disconnect());
      this.observers.clear();
    }
  }
}

export interface MetricData {
  average: number;
  min: number;
  max: number;
  count: number;
}

export interface PerformanceReport {
  timestamp: number;
  metrics: Record<string, MetricData>;
  recommendations: string[];
}

// 3D Performance Optimizations
export class ThreeDOptimizer {
  static readonly GEOMETRY_CACHE = new Map<string, any>();
  static readonly TEXTURE_CACHE = new Map<string, any>();
  static readonly MATERIAL_CACHE = new Map<string, any>();

  /**
   * Get or create cached geometry
   */
  static getGeometry(key: string, factory: () => any) {
    if (!this.GEOMETRY_CACHE.has(key)) {
      this.GEOMETRY_CACHE.set(key, factory());
    }
    return this.GEOMETRY_CACHE.get(key);
  }

  /**
   * Get or create cached texture
   */
  static getTexture(key: string, factory: () => any) {
    if (!this.TEXTURE_CACHE.has(key)) {
      this.TEXTURE_CACHE.set(key, factory());
    }
    return this.TEXTURE_CACHE.get(key);
  }

  /**
   * Get or create cached material
   */
  static getMaterial(key: string, factory: () => any) {
    if (!this.MATERIAL_CACHE.has(key)) {
      this.MATERIAL_CACHE.set(key, factory());
    }
    return this.MATERIAL_CACHE.get(key);
  }

  /**
   * Clean up unused resources
   */
  static cleanup() {
    // Dispose of WebGL resources
    this.GEOMETRY_CACHE.forEach((geometry) => {
      if (geometry.dispose) geometry.dispose();
    });
    
    this.TEXTURE_CACHE.forEach((texture) => {
      if (texture.dispose) texture.dispose();
    });
    
    this.MATERIAL_CACHE.forEach((material) => {
      if (material.dispose) material.dispose();
    });

    this.GEOMETRY_CACHE.clear();
    this.TEXTURE_CACHE.clear();
    this.MATERIAL_CACHE.clear();
  }
}

// AR Performance Optimizations
export class AROptimizer {
  private static frameSkip = 0;
  private static targetFPS = 30;

  /**
   * Adaptive frame rate control for AR processing
   */
  static shouldProcessFrame(): boolean {
    this.frameSkip++;
    const skipEvery = Math.max(1, Math.floor(60 / this.targetFPS));
    
    if (this.frameSkip >= skipEvery) {
      this.frameSkip = 0;
      return true;
    }
    
    return false;
  }

  /**
   * Adjust target FPS based on device performance
   */
  static adjustTargetFPS(currentFPS: number) {
    if (currentFPS < 20) {
      this.targetFPS = Math.max(15, this.targetFPS - 5);
    } else if (currentFPS > 45) {
      this.targetFPS = Math.min(60, this.targetFPS + 5);
    }
  }

  /**
   * Get optimal camera resolution based on device
   */
  static getOptimalCameraResolution(): { width: number; height: number } {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    // Reduce resolution for lower-end devices
    if (devicePixelRatio < 2 || screenWidth < 768) {
      return { width: 640, height: 480 };
    } else if (screenWidth < 1200) {
      return { width: 1280, height: 720 };
    } else {
      return { width: 1920, height: 1080 };
    }
  }
}

// Device capability detection
export class DeviceCapabilities {
  static webGLSupported(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!context;
    } catch {
      return false;
    }
  }

  static webGL2Supported(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2');
      return !!context;
    } catch {
      return false;
    }
  }

  static cameraSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  static getGPUInfo(): { vendor: string; renderer: string } | null {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) return null;

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) return null;

      return {
        vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      };
    } catch {
      return null;
    }
  }

  static getDeviceMemory(): number {
    // @ts-ignore - navigator.deviceMemory is experimental
    return navigator.deviceMemory || 4; // Default to 4GB
  }

  static getConnectionSpeed(): 'slow' | 'medium' | 'fast' {
    // @ts-ignore - navigator.connection is experimental
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (!connection) return 'medium';

    const downlink = connection.downlink;
    if (downlink < 1) return 'slow';
    if (downlink < 5) return 'medium';
    return 'fast';
  }

  static getPerformanceProfile(): 'low' | 'medium' | 'high' {
    const hasWebGL2 = this.webGL2Supported();
    const deviceMemory = this.getDeviceMemory();
    const connectionSpeed = this.getConnectionSpeed();
    
    let score = 0;
    
    if (hasWebGL2) score += 3;
    else if (this.webGLSupported()) score += 1;
    
    if (deviceMemory >= 8) score += 3;
    else if (deviceMemory >= 4) score += 2;
    else score += 1;
    
    if (connectionSpeed === 'fast') score += 2;
    else if (connectionSpeed === 'medium') score += 1;
    
    if (score >= 7) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-start monitoring for key metrics
if (typeof window !== 'undefined') {
  performanceMonitor.startMonitoring('general');
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    ThreeDOptimizer.cleanup();
    performanceMonitor.stopMonitoring();
  });
} 