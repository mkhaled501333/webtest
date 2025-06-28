import { useState } from 'react';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Button } from '../ui';
import type { Product } from '../../types';

interface ProductReviewsProps {
  product: Product;
}

interface Review {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  notHelpful: number;
  size: string;
  fit: 'Too Small' | 'Just Right' | 'Too Large';
  images?: string[];
}

const ProductReviews = ({ product }: ProductReviewsProps) => {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  // Mock reviews data
  const reviews: Review[] = [
    {
      id: '1',
      user: {
        name: 'Sarah M.',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b278?w=150',
        verified: true
      },
      rating: 5,
      title: 'Love this shirt!',
      content: 'Perfect fit and amazing quality. The fabric feels premium and the color is exactly as shown. Would definitely buy again!',
      date: '2024-01-15',
      helpful: 12,
      notHelpful: 1,
      size: 'M',
      fit: 'Just Right'
    },
    {
      id: '2',
      user: {
        name: 'Mike D.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        verified: true
      },
      rating: 4,
      title: 'Good quality, runs a bit small',
      content: 'Great shirt overall, but I wish I had ordered a size up. The material is excellent and the design is exactly what I was looking for.',
      date: '2024-01-10',
      helpful: 8,
      notHelpful: 0,
      size: 'L',
      fit: 'Too Small'
    },
    {
      id: '3',
      user: {
        name: 'Emma L.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        verified: false
      },
      rating: 5,
      title: 'Exceeded expectations!',
      content: 'This has become my favorite piece in my wardrobe. The quality is outstanding and it looks even better in person than in the photos.',
      date: '2024-01-08',
      helpful: 15,
      notHelpful: 2,
      size: 'S',
      fit: 'Just Right'
    }
  ];

  // Calculate rating breakdown
  const ratingBreakdown = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => review.rating === rating).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'md') => {
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <StarIconSolid
            key={i}
            className={`${starSize} ${
              i < rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const filteredAndSortedReviews = reviews
    .filter(review => filterRating === null || review.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-8">
      {/* Reviews Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Overall Rating */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">{product.rating.toFixed(1)}</div>
              <div className="flex items-center justify-center mt-1 mb-2">
                {renderStars(Math.floor(product.rating))}
              </div>
              <div className="text-sm text-gray-600">{product.reviewCount} reviews</div>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-3">
            {ratingBreakdown.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <button
                  onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                  className={`flex items-center gap-1 text-sm hover:text-primary-600 ${
                    filterRating === rating ? 'text-primary-600 font-medium' : 'text-gray-600'
                  }`}
                >
                  <span>{rating}</span>
                  <StarIconSolid className="w-4 h-4 text-yellow-400" />
                </button>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fit Information */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">How does it fit?</h4>
          <div className="space-y-3">
            {['Too Small', 'Just Right', 'Too Large'].map((fitType) => {
              const count = reviews.filter(review => review.fit === fitType).length;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              
              return (
                <div key={fitType} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-20">{fitType}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        fitType === 'Too Small' ? 'bg-red-400' :
                        fitType === 'Just Right' ? 'bg-green-400' : 'bg-blue-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">{percentage.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-t border-gray-200 pt-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        {filterRating && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterRating(null)}
          >
            Clear Filter ({filterRating} stars)
          </Button>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredAndSortedReviews.map((review) => (
          <div key={review.id} className="border border-gray-200 rounded-lg p-6">
            {/* Review Header */}
            <div className="flex items-start gap-4 mb-4">
              <img
                src={review.user.avatar}
                alt={review.user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{review.user.name}</span>
                  {review.user.verified && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mb-2">
                  {renderStars(review.rating, 'sm')}
                  <span className="text-sm text-gray-600">{formatDate(review.date)}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Size: {review.size}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    review.fit === 'Too Small' ? 'bg-red-100 text-red-800' :
                    review.fit === 'Just Right' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    Fit: {review.fit}
                  </span>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
              <p className="text-gray-600 leading-relaxed">{review.content}</p>
            </div>

            {/* Review Actions */}
            <div className="flex items-center gap-4 text-sm">
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                <HandThumbUpIcon className="w-4 h-4" />
                <span>Helpful ({review.helpful})</span>
              </button>
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                <HandThumbDownIcon className="w-4 h-4" />
                <span>Not helpful ({review.notHelpful})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review CTA */}
      <div className="border-t border-gray-200 pt-8 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Share your experience</h3>
        <p className="text-gray-600 mb-4">
          Help other customers by writing a review about this product
        </p>
        <Button variant="primary">
          Write a Review
        </Button>
      </div>
    </div>
  );
};

export default ProductReviews; 