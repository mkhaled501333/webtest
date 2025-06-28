import { useState } from 'react';
import { XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/20/solid';
import type { ProductFilters, Brand } from '../../types';
import { Button, Badge } from '../ui';
import { commonSizes, commonColors } from '../../data/mockData';

interface FilterSidebarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  brands: Brand[];
  categories: string[];
  isOpen: boolean;
  onToggle: () => void;
  onClearAll: () => void;
  resultCount: number;
}

const FilterSidebar = ({
  filters,
  onFiltersChange,
  brands,
  categories,
  isOpen,
  onToggle,
  onClearAll,
  resultCount
}: FilterSidebarProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>(filters.priceRange);

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleArrayFilterToggle = (key: keyof ProductFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleFilterChange(key, newArray);
  };

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...priceRange];
    newRange[index] = value;
    setPriceRange(newRange);
    handleFilterChange('priceRange', newRange);
  };

  const getActiveFiltersCount = () => {
    return filters.brands.length + 
           filters.categories.length + 
           filters.sizes.length + 
           filters.colors.length + 
           (filters.inStockOnly ? 1 : 0) + 
           (filters.rating > 0 ? 1 : 0) +
           (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0);
  };

  const sidebarContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="primary" size="sm">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{resultCount} items</span>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Clear All Filters */}
      {getActiveFiltersCount() > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          className="w-full"
        >
          Clear All Filters
        </Button>
      )}

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => handleArrayFilterToggle('categories', category)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Brands</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <label key={brand.id} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand.id)}
                onChange={() => handleArrayFilterToggle('brands', brand.id)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                {brand.name}
                {brand.verified && (
                                     <Badge variant="secondary" size="sm">Verified</Badge>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Price Range</h4>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(0, Number(e.target.value))}
              placeholder="Min"
              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(1, Number(e.target.value))}
              placeholder="Max"
              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
          <div className="text-xs text-gray-600">
            ${priceRange[0]} - ${priceRange[1]}
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Sizes</h4>
        <div className="flex flex-wrap gap-2">
          {commonSizes.map((size) => (
            <button
              key={size.id}
              onClick={() => handleArrayFilterToggle('sizes', size.id)}
              className={`px-3 py-1 text-sm border rounded ${
                filters.sizes.includes(size.id)
                  ? 'border-primary-600 bg-primary-50 text-primary-600'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {size.name}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Colors</h4>
        <div className="flex flex-wrap gap-2">
          {commonColors.map((color) => (
            <button
              key={color.id}
              onClick={() => handleArrayFilterToggle('colors', color.id)}
              className={`w-8 h-8 rounded-full border-2 relative ${
                filters.colors.includes(color.id)
                  ? 'border-primary-600'
                  : 'border-gray-300'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {filters.colors.includes(color.id) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full border border-gray-400" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === rating}
                onChange={() => handleFilterChange('rating', rating)}
                className="border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div className="ml-2 flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm text-gray-600">& up</span>
              </div>
            </label>
          ))}
          <label className="flex items-center">
            <input
              type="radio"
              name="rating"
              checked={filters.rating === 0}
              onChange={() => handleFilterChange('rating', 0)}
              className="border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">All ratings</span>
          </label>
        </div>
      </div>

      {/* In Stock Only */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Availability</h4>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => handleFilterChange('inStockOnly', e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700">In stock only</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 left-0 w-80 bg-white p-6 overflow-y-auto">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {sidebarContent}
      </div>
    </>
  );
};

export default FilterSidebar; 