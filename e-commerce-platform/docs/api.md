# API Documentation

## Overview

This document outlines the API structure for the StyleHub e-commerce platform. The current implementation uses mock data and Zustand stores for state management, but this documentation serves as a blueprint for future backend integration.

## Base URL

```
Production: https://api.stylehub.com/v1
Development: http://localhost:3000/api/v1
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Authentication Endpoints

#### POST `/auth/login`
User login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "rememberMe": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://example.com/avatar.jpg",
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "lastLoginAt": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresIn": 3600
  }
}
```

#### POST `/auth/register`
User registration with email verification.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "securepassword",
  "confirmPassword": "securepassword",
  "acceptTerms": true,
  "subscribeNewsletter": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "isVerified": false
    },
    "message": "Registration successful. Please check your email for verification."
  }
}
```

#### POST `/auth/refresh`
Refresh JWT token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

#### POST `/auth/logout`
Logout user and invalidate tokens.

**Headers:** `Authorization: Bearer <token>`

## Products

### GET `/products`
Retrieve paginated list of products with filtering and sorting.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `category` (string): Filter by category
- `brand` (string): Filter by brand ID
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `color` (string): Filter by color
- `size` (string): Filter by size
- `rating` (number): Minimum rating filter
- `search` (string): Search term
- `sort` (string): Sort by (featured, price-asc, price-desc, rating, newest)
- `isNew` (boolean): Filter new arrivals
- `onSale` (boolean): Filter sale items

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_123",
        "name": "Sustainable Cotton T-Shirt",
        "slug": "sustainable-cotton-t-shirt",
        "brand": {
          "id": "brand_456",
          "name": "EcoWear",
          "slug": "ecowear"
        },
        "price": 29.99,
        "originalPrice": 39.99,
        "currency": "USD",
        "images": [
          {
            "url": "https://example.com/image1.jpg",
            "alt": "Product image 1",
            "width": 800,
            "height": 800
          }
        ],
        "colors": ["White", "Black", "Navy"],
        "sizes": ["XS", "S", "M", "L", "XL"],
        "category": "Clothing",
        "subcategory": "Tops",
        "description": "Made from 100% organic cotton",
        "features": ["Organic", "Sustainable", "Comfortable"],
        "rating": 4.5,
        "reviewCount": 128,
        "isNew": false,
        "isFeatured": true,
        "isOnSale": true,
        "inventory": {
          "inStock": true,
          "quantity": 50,
          "lowStock": false
        },
        "seo": {
          "title": "Sustainable Cotton T-Shirt | EcoWear",
          "description": "Comfortable organic cotton t-shirt...",
          "keywords": ["organic", "cotton", "sustainable"]
        },
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1000,
      "pages": 50,
      "hasNext": true,
      "hasPrev": false
    },
    "filters": {
      "categories": ["Clothing", "Shoes", "Accessories"],
      "brands": ["EcoWear", "StyleCo", "TechFashion"],
      "priceRange": { "min": 10, "max": 500 },
      "colors": ["White", "Black", "Navy", "Red"],
      "sizes": ["XS", "S", "M", "L", "XL"]
    }
  }
}
```

### GET `/products/{id}`
Retrieve detailed product information.

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "prod_123",
      "name": "Sustainable Cotton T-Shirt",
      "description": "Detailed product description...",
      "longDescription": "Extended description with care instructions...",
      "specifications": {
        "material": "100% Organic Cotton",
        "weight": "180gsm",
        "origin": "Made in Portugal",
        "care": ["Machine wash cold", "Tumble dry low"]
      },
      "sizing": {
        "guide": "https://example.com/size-guide.pdf",
        "chart": {
          "S": { "chest": "88-93", "length": "70" },
          "M": { "chest": "94-99", "length": "72" }
        }
      },
      "availability": {
        "White": {
          "S": { "quantity": 10, "available": true },
          "M": { "quantity": 0, "available": false }
        }
      },
      "relatedProducts": ["prod_124", "prod_125"],
      "crossSells": ["prod_126", "prod_127"],
      "bundleOffers": [
        {
          "id": "bundle_1",
          "name": "Complete Look",
          "products": ["prod_123", "prod_124"],
          "discount": 15,
          "price": 54.99
        }
      ]
    }
  }
}
```

### GET `/products/{id}/reviews`
Retrieve product reviews with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `rating` (number): Filter by rating
- `verified` (boolean): Filter verified purchases
- `withPhotos` (boolean): Filter reviews with photos
- `sort` (string): Sort by (newest, oldest, highest-rated, most-helpful)

## Brands

### GET `/brands`
Retrieve list of brands with filtering and search.

**Query Parameters:**
- `search` (string): Search brand names
- `verified` (boolean): Filter verified brands
- `location` (string): Filter by location
- `sort` (string): Sort by (name, products, rating)

**Response:**
```json
{
  "success": true,
  "data": {
    "brands": [
      {
        "id": "brand_456",
        "name": "EcoWear",
        "slug": "ecowear",
        "logo": "https://example.com/logo.jpg",
        "coverImage": "https://example.com/cover.jpg",
        "description": "Sustainable fashion brand...",
        "website": "https://ecowear.com",
        "verified": true,
        "established": "2015",
        "location": "San Francisco, CA",
        "stats": {
          "products": 150,
          "rating": 4.6,
          "reviews": 2340
        }
      }
    ]
  }
}
```

### GET `/brands/{id}`
Retrieve detailed brand information.

## User Management

### GET `/users/profile`
Get current user profile information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1-555-123-4567",
      "dateOfBirth": "1990-05-15",
      "gender": "male",
      "avatar": "https://example.com/avatar.jpg",
      "preferences": {
        "notifications": {
          "email": true,
          "push": true,
          "sms": false
        },
        "privacy": {
          "showProfile": false,
          "shareReviews": true
        },
        "shopping": {
          "preferredCurrency": "USD",
          "preferredLanguage": "en"
        }
      },
      "addresses": [
        {
          "id": "addr_789",
          "type": "home",
          "isDefault": true,
          "firstName": "John",
          "lastName": "Doe",
          "street1": "123 Main St",
          "city": "San Francisco",
          "state": "CA",
          "zipCode": "94105",
          "country": "US"
        }
      ],
      "sizingProfile": {
        "measurements": {
          "height": 180,
          "weight": 75,
          "chest": 98
        },
        "bodyType": "athletic",
        "fitPreference": "fitted"
      }
    }
  }
}
```

### PUT `/users/profile`
Update user profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-123-4567",
  "dateOfBirth": "1990-05-15",
  "gender": "male"
}
```

## Addresses

### GET `/users/addresses`
Get user addresses.

### POST `/users/addresses`
Add new address.

**Request Body:**
```json
{
  "type": "home",
  "isDefault": false,
  "firstName": "John",
  "lastName": "Doe",
  "street1": "123 Main St",
  "street2": "Apt 4B",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94105",
  "country": "US",
  "phone": "+1-555-123-4567"
}
```

### PUT `/users/addresses/{id}`
Update existing address.

### DELETE `/users/addresses/{id}`
Delete address.

## Cart Management

### GET `/cart`
Get current user's cart.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "id": "cart_abc",
      "userId": "user_123",
      "items": [
        {
          "id": "item_1",
          "product": {
            "id": "prod_123",
            "name": "Sustainable Cotton T-Shirt",
            "price": 29.99,
            "image": "https://example.com/image.jpg"
          },
          "quantity": 2,
          "selectedColor": "White",
          "selectedSize": "M",
          "price": 29.99,
          "total": 59.98
        }
      ],
      "summary": {
        "subtotal": 59.98,
        "shipping": 5.99,
        "tax": 5.40,
        "total": 71.37,
        "savings": 0,
        "itemCount": 2
      },
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### POST `/cart/items`
Add item to cart.

**Request Body:**
```json
{
  "productId": "prod_123",
  "quantity": 1,
  "selectedColor": "White",
  "selectedSize": "M"
}
```

### PUT `/cart/items/{id}`
Update cart item quantity.

### DELETE `/cart/items/{id}`
Remove item from cart.

### DELETE `/cart`
Clear entire cart.

## Wishlist Management

### GET `/wishlists`
Get user's wishlists.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "wishlists": [
      {
        "id": "wishlist_456",
        "name": "My Favorites",
        "description": "Items I love",
        "isPublic": false,
        "itemCount": 5,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### POST `/wishlists`
Create new wishlist.

### GET `/wishlists/{id}/items`
Get wishlist items.

### POST `/wishlists/{id}/items`
Add item to wishlist.

### DELETE `/wishlists/{id}/items/{itemId}`
Remove item from wishlist.

## Orders

### GET `/orders`
Get user's order history.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by order status
- `dateFrom` (string): Start date filter
- `dateTo` (string): End date filter

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "order_789",
        "orderNumber": "ORD-2024-001234",
        "status": "delivered",
        "items": [
          {
            "product": {
              "id": "prod_123",
              "name": "Sustainable Cotton T-Shirt",
              "image": "https://example.com/image.jpg"
            },
            "quantity": 1,
            "price": 29.99,
            "selectedColor": "White",
            "selectedSize": "M"
          }
        ],
        "summary": {
          "subtotal": 29.99,
          "shipping": 5.99,
          "tax": 3.24,
          "total": 39.22
        },
        "shippingAddress": {
          "firstName": "John",
          "lastName": "Doe",
          "street1": "123 Main St",
          "city": "San Francisco",
          "state": "CA",
          "zipCode": "94105"
        },
        "tracking": {
          "number": "1Z999AA1234567890",
          "carrier": "UPS",
          "url": "https://ups.com/track/1Z999AA1234567890"
        },
        "timeline": [
          {
            "status": "placed",
            "date": "2024-01-10T09:00:00Z",
            "description": "Order placed"
          },
          {
            "status": "confirmed",
            "date": "2024-01-10T10:30:00Z",
            "description": "Order confirmed"
          }
        ],
        "createdAt": "2024-01-10T09:00:00Z",
        "estimatedDelivery": "2024-01-15T00:00:00Z",
        "actualDelivery": "2024-01-14T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### GET `/orders/{id}`
Get detailed order information.

### POST `/orders`
Create new order (checkout).

**Request Body:**
```json
{
  "items": [
    {
      "productId": "prod_123",
      "quantity": 1,
      "selectedColor": "White",
      "selectedSize": "M"
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "street1": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94105",
    "country": "US"
  },
  "billingAddress": {
    "sameAsShipping": true
  },
  "paymentMethod": {
    "type": "card",
    "token": "payment_token_from_stripe"
  },
  "shipping": {
    "method": "standard",
    "cost": 5.99
  }
}
```

## Reviews

### GET `/reviews`
Get reviews with filtering.

### POST `/reviews`
Create product review.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": "prod_123",
  "orderId": "order_789",
  "rating": 5,
  "title": "Excellent quality!",
  "content": "Love this shirt, very comfortable...",
  "pros": ["Comfortable", "Great fit", "Sustainable"],
  "cons": ["Slightly expensive"],
  "recommendedSize": "M",
  "fitFeedback": "true-to-size",
  "images": ["https://example.com/review-image.jpg"]
}
```

## Search & Recommendations

### GET `/search`
Search products, brands, and categories.

**Query Parameters:**
- `q` (string): Search query
- `type` (string): Search type (products, brands, all)
- `filters` (object): Additional filters

### GET `/recommendations`
Get personalized product recommendations.

**Headers:** `Authorization: Bearer <token>`

### GET `/products/{id}/recommendations`
Get related product recommendations.

## Analytics & Tracking

### POST `/events`
Track user events for analytics.

**Request Body:**
```json
{
  "event": "product_view",
  "properties": {
    "productId": "prod_123",
    "category": "Clothing",
    "price": 29.99
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Error Handling

All API responses follow a consistent error format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": ["Email is required"],
      "password": ["Password must be at least 8 characters"]
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

### Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate limited:

- **Authentication**: 5 requests per minute per IP
- **Search**: 100 requests per minute per user
- **General**: 1000 requests per hour per user

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642176000
```

## Webhooks

Webhook endpoints for real-time updates:

### Order Events
- `order.created`
- `order.confirmed`
- `order.shipped`
- `order.delivered`
- `order.cancelled`

### Payment Events
- `payment.succeeded`
- `payment.failed`
- `payment.refunded`

### Inventory Events
- `inventory.low_stock`
- `inventory.out_of_stock`
- `inventory.restocked`

## SDK and Integration

### JavaScript SDK

```javascript
import { StyleHubAPI } from '@stylehub/api-client';

const api = new StyleHubAPI({
  apiKey: 'your-api-key',
  environment: 'production' // or 'development'
});

// Get products
const products = await api.products.list({
  category: 'clothing',
  limit: 20
});

// Add to cart
await api.cart.addItem({
  productId: 'prod_123',
  quantity: 1,
  selectedSize: 'M'
});
```

### React Hooks

```javascript
import { useProducts, useCart } from '@stylehub/react';

function ProductList() {
  const { products, loading, error } = useProducts({
    category: 'clothing'
  });
  
  const { addToCart } = useCart();
  
  // Component implementation
}
```

This API documentation provides a comprehensive foundation for backend integration and serves as a contract between frontend and backend development teams. 