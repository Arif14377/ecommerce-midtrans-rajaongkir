import React from 'react';
import { Link } from 'react-router';
import Loading from '../../general/Loading';
import type { PublicCategory } from '../../../types/category';

interface CategorySectionProps {
  categories: PublicCategory[] | undefined;
  isLoading: boolean;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  isLoading,
}) => {
  return (
    <section className="py-4 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loading />
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                className="shrink-0 px-5 py-2.5 bg-gray-50 hover:bg-cyan-50 text-gray-600 hover:text-cyan-600 rounded-full font-bold text-sm transition-colors border border-gray-100 hover:border-cyan-100 whitespace-nowrap"
              >
                {category.name}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 text-sm">
            Belum ada kategori
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;