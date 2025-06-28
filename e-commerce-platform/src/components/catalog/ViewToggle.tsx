import { Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';

interface ViewToggleProps {
  currentView: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

const ViewToggle = ({ currentView, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex border border-gray-300 rounded-md overflow-hidden">
      <button
        onClick={() => onViewChange('grid')}
        className={`p-2 text-sm font-medium transition-colors ${
          currentView === 'grid'
            ? 'bg-primary-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        title="Grid view"
      >
        <Squares2X2Icon className="w-5 h-5" />
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`p-2 text-sm font-medium transition-colors border-l border-gray-300 ${
          currentView === 'list'
            ? 'bg-primary-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        title="List view"
      >
        <ListBulletIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ViewToggle; 