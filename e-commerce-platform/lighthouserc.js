module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:5173',
        'http://localhost:5173/catalog',
        'http://localhost:5173/product/1',
        'http://localhost:5173/brands',
        'http://localhost:5173/checkout'
      ],
      startServerCommand: 'npm run dev',
      startServerReadyPattern: 'ready',
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-gpu',
        preset: 'desktop',
        onlyCategories: ['performance', 'accessibility', 'best-practices'],
        skipAudits: [
          'canonical', // Not applicable for SPA
          'robots-txt', // Not applicable for development
          'structured-data' // Not implemented yet
        ]
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.7 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.8 }],
        
        // Performance metrics
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],
        'interactive': ['warn', { maxNumericValue: 4000 }],
        
        // Accessibility
        'color-contrast': 'error',
        'heading-order': 'error',
        'label': 'error',
        'link-name': 'error',
        
        // Best practices
        'uses-https': 'off', // Development server uses HTTP
        'is-on-https': 'off', // Development server uses HTTP
        'external-anchors-use-rel-noopener': 'error',
        'no-vulnerable-libraries': 'warn',
        
        // Custom thresholds for 3D/AR features
        'unused-css-rules': ['warn', { maxLength: 10 }],
        'unused-javascript': ['warn', { maxLength: 20 }],
        'modern-image-formats': 'warn',
        'uses-optimized-images': 'warn',
        'uses-webp-images': 'warn',
        'efficient-animated-content': 'warn',
        'uses-text-compression': 'error',
        'render-blocking-resources': 'warn',
        'unminified-css': 'error',
        'unminified-javascript': 'error'
      }
    },
    upload: {
      target: 'temporary-public-storage',
      outputDir: './lighthouse-results',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%'
    },
    server: {
      port: 9009,
      storage: './lighthouse-server-storage'
    }
  }
}; 