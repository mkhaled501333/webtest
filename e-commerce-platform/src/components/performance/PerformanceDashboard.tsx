import React, { useState, useEffect } from 'react';
import { performanceMonitor, DeviceCapabilities, type PerformanceReport } from '../../utils/performance';

interface PerformanceDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  isOpen,
  onClose
}) => {
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Get initial device capabilities
      const capabilities = {
        webGL: DeviceCapabilities.webGLSupported(),
        webGL2: DeviceCapabilities.webGL2Supported(),
        camera: DeviceCapabilities.cameraSupported(),
        gpu: DeviceCapabilities.getGPUInfo(),
        memory: DeviceCapabilities.getDeviceMemory(),
        connection: DeviceCapabilities.getConnectionSpeed(),
        profile: DeviceCapabilities.getPerformanceProfile()
      };
      setDeviceInfo(capabilities);

      // Start monitoring and refresh every 2 seconds
      const updateReport = () => {
        const newReport = performanceMonitor.getReport();
        setReport(newReport);
      };

      updateReport();
      const interval = setInterval(updateReport, 2000);
      setRefreshInterval(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [isOpen]);

  const formatMetric = (value: number, unit: string = 'ms') => {
    return `${value.toFixed(2)}${unit}`;
  };

  const getMetricColor = (value: number, threshold: number, inverted: boolean = false) => {
    const isGood = inverted ? value < threshold : value > threshold;
    return isGood ? 'text-green-600' : 'text-red-600';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Performance Dashboard</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close Dashboard"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Device Capabilities */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Device Capabilities</h3>
            {deviceInfo && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">WebGL:</span>
                  <span className={deviceInfo.webGL ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                    {deviceInfo.webGL ? '✓ Supported' : '✗ Not Supported'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">WebGL2:</span>
                  <span className={deviceInfo.webGL2 ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                    {deviceInfo.webGL2 ? '✓ Supported' : '✗ Not Supported'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Camera:</span>
                  <span className={deviceInfo.camera ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                    {deviceInfo.camera ? '✓ Available' : '✗ Not Available'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Memory:</span>
                  <span className="ml-2">{deviceInfo.memory}GB</span>
                </div>
                <div>
                  <span className="font-medium">Connection:</span>
                  <span className="ml-2 capitalize">{deviceInfo.connection}</span>
                </div>
                <div>
                  <span className="font-medium">Profile:</span>
                  <span className={`ml-2 capitalize ${
                    deviceInfo.profile === 'high' ? 'text-green-600' :
                    deviceInfo.profile === 'medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {deviceInfo.profile}
                  </span>
                </div>
                {deviceInfo.gpu && (
                  <>
                    <div className="col-span-2">
                      <span className="font-medium">GPU:</span>
                      <span className="ml-2">{deviceInfo.gpu.renderer}</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Performance Metrics */}
          {report && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
              {Object.keys(report.metrics).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(report.metrics).map(([name, data]) => (
                    <div key={name} className="bg-white rounded p-3 border">
                      <div className="font-medium text-sm mb-2 capitalize">
                        {name.replace(/[-_]/g, ' ')}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Average:</span>
                          <span className={getMetricColor(data.average, 16.67, true)}>
                            {formatMetric(data.average)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Min:</span>
                          <span>{formatMetric(data.min)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max:</span>
                          <span>{formatMetric(data.max)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Samples:</span>
                          <span>{data.count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No performance metrics collected yet. Interact with 3D/AR features to see data.</p>
              )}
            </div>
          )}

          {/* Recommendations */}
          {report && report.recommendations.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-yellow-800">Recommendations</h3>
              <ul className="space-y-2">
                {report.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start space-x-2 text-yellow-700">
                    <span className="text-yellow-600 mt-1">⚠</span>
                    <span className="text-sm">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Real-time FPS Monitor */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Real-time Monitoring</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded p-3 border text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {report?.metrics['frame-rate']?.average ? 
                    Math.round(1000 / report.metrics['frame-rate'].average) : '--'}
                </div>
                <div className="text-sm text-gray-600">FPS</div>
              </div>
              <div className="bg-white rounded p-3 border text-center">
                <div className="text-2xl font-bold text-green-600">
                  {report?.metrics['3d-render']?.average ? 
                    formatMetric(report.metrics['3d-render'].average) : '--'}
                </div>
                <div className="text-sm text-gray-600">3D Render</div>
              </div>
              <div className="bg-white rounded p-3 border text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {report?.metrics['ar-processing']?.average ? 
                    formatMetric(report.metrics['ar-processing'].average) : '--'}
                </div>
                <div className="text-sm text-gray-600">AR Process</div>
              </div>
              <div className="bg-white rounded p-3 border text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {report?.metrics['memory-usage']?.average ? 
                    formatMetric(report.metrics['memory-usage'].average, 'MB') : '--'}
                </div>
                <div className="text-sm text-gray-600">Memory</div>
              </div>
            </div>
          </div>

          {/* Performance Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-blue-800">Performance Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-700 mb-2">3D Optimization</h4>
                <ul className="space-y-1 text-blue-600">
                  <li>• Use LOD (Level of Detail) models</li>
                  <li>• Reduce texture sizes on mobile</li>
                  <li>• Enable frustum culling</li>
                  <li>• Batch similar objects</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-700 mb-2">AR Optimization</h4>
                <ul className="space-y-1 text-blue-600">
                  <li>• Lower camera resolution on weak devices</li>
                  <li>• Skip frames during heavy processing</li>
                  <li>• Use background processing for ML</li>
                  <li>• Cache face detection results</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <button
              onClick={() => {
                const newReport = performanceMonitor.getReport();
                setReport(newReport);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Refresh Metrics
            </button>
            <button
              onClick={() => {
                // Download performance report as JSON
                const dataStr = JSON.stringify(report, null, 2);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `performance-report-${Date.now()}.json`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Export Report
            </button>
            <button
              onClick={() => {
                if (window.confirm('Clear all performance metrics?')) {
                  // This would require adding a clear method to the performance monitor
                  window.location.reload();
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Clear Metrics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 