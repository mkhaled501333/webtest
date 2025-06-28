import { ArrowTrendingUpIcon, ShoppingBagIcon, StarIcon, UsersIcon } from '@heroicons/react/24/outline';
import { Card } from '../ui';

interface BrandStatsProps {
  totalProducts: number;
  averageRating: number;
  totalReviews: number;
}

const BrandStats = ({ totalProducts, averageRating, totalReviews }: BrandStatsProps) => {
  // Mock data for additional stats
  const stats = [
    {
      name: 'Total Products',
      value: totalProducts,
      icon: ShoppingBagIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%',
      changeType: 'increase'
    },
    {
      name: 'Average Rating',
      value: averageRating.toFixed(1),
      icon: StarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: '+0.2',
      changeType: 'increase'
    },
    {
      name: 'Total Reviews',
      value: totalReviews.toLocaleString(),
      icon: UsersIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+23%',
      changeType: 'increase'
    },
    {
      name: 'Monthly Sales',
      value: Math.floor(Math.random() * 1000 + 500).toLocaleString(),
      icon: ArrowTrendingUpIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+8%',
      changeType: 'increase'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <IconComponent className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default BrandStats; 