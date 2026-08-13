// Import React
import React from 'react';
import WebLayout from '../../../layouts/Web';
import SliderCarousel from '../../../components/web/slider/SliderCarousel';

// Components
import FeaturesSection from '../../../components/web/home/FeaturesSection';
import FeaturedProducts from '../../../components/web/home/FeaturedProducts';
import CategorySection from '../../../components/web/home/CategorySection';

// Import hooks
import { useProducts } from '../../../hooks/web/product/useProducts';
import { useCategories } from '../../../hooks/web/category/useCategories';

const HomePage: React.FC = () => {
    // Fetch data
    const { data: productsData, isLoading: isLoadingProducts } = useProducts(1, 8);
    const { data: categories, isLoading: isLoadingCategories } = useCategories();

    const products = productsData?.data || [];

    return (
        <WebLayout>
            <title>TokoKita - Belanja Murah & Cepat</title>

            {/* Slider Section */}
            <section className="py-4 md:py-6">
                <div className="max-w-5xl mx-auto px-4">
                    <SliderCarousel />
                </div>
            </section>

            {/* Features Section */}
            <FeaturesSection />

            {/* Categories */}
            <CategorySection
                categories={categories}
                isLoading={isLoadingCategories}
            />

            {/* Featured Products */}
            <FeaturedProducts
                products={products}
                isLoading={isLoadingProducts}
            />
        </WebLayout>
    );
};

export default HomePage;