import React from "react";
import { Link } from "react-router";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useSliders } from "../../../hooks/web/slider/useSliders";
import { useSliderCarousel } from "../../../hooks/web/slider/useSliderCarousel";

const SliderCarousel: React.FC = () => {
  const { data: sliders, isLoading } = useSliders();
  const slidesLength = sliders?.length || 0;

  const {
    currentSlide,
    setIsHovered,
    nextSlide,
    prevSlide,
    goToSlide,
  } = useSliderCarousel(slidesLength);

  if (isLoading) {
    return (
      <div className="w-full h-75 md:h-100 bg-gray-100 animate-pulse rounded-2xl" />
    );
  }

  if (!sliders || sliders.length === 0) {
    return null;
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliders.map((slider) => (
          <div key={slider.id} className="w-full shrink-0">
            <Link to={slider.link || "#"}>
              <img
                src={slider.image}
                alt={`Slider ${slider.id}`}
                className="w-full h-75 md:h-100 object-cover"
              />
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {sliders.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
            aria-label="Previous slide"
          >
            <FiChevronLeft className="w-5 h-5 text-gray-800" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
            aria-label="Next slide"
          >
            <FiChevronRight className="w-5 h-5 text-gray-800" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {sliders.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {sliders.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SliderCarousel;