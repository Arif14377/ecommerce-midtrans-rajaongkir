import { useState, useEffect } from 'react';

export const useSliderCarousel = (
    slidesLength: number,
    autoPlayInterval: number = 5000
) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!slidesLength) return;

        const interval = setInterval(() => {
            if (!isHovered) {
                setCurrentSlide((prev) => (prev + 1) % slidesLength);
            }
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [slidesLength, autoPlayInterval, isHovered]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slidesLength);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slidesLength) % slidesLength);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return { currentSlide, isHovered, setIsHovered, nextSlide, prevSlide, goToSlide };
};