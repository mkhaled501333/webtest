import { ChevronDownIcon } from '@heroicons/react/24/outline';
import type { SortOption } from '../../types';

interface SortOptionsProps {
  options: SortOption[];
  currentSort: string;
  onSortChange: (value: string) => void;
}

const SortOptions = ({ currentSort, onSortChange, options }: SortOptionsProps) => {
  return (
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 mr-3">Sort by:</label>
      <div className="relative inline-block">
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default SortOptions; 