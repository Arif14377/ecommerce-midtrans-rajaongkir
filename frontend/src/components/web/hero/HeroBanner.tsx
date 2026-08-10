import React from "react";
import { Link } from "react-router";
import { FiArrowRight } from "react-icons/fi";

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  buttonText?: string;
  buttonLink?: string;
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  description,
  backgroundImage,
  buttonText = "Belanja Sekarang",
  buttonLink = "/products",
}) => {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-cyan-500 to-blue-600 text-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="text-center md:text-left">
            {subtitle && (
              <span className="inline-block px-3 py-1 bg-white/20 text-sm font-medium rounded-full mb-4">
                {subtitle}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              {title}
            </h1>

            {description && (
              <p className="text-white/80 text-lg mb-6 max-w-md mx-auto md:mx-0">
                {description}
              </p>
            )}

            <Link
              to={buttonLink}
              className="inline-flex items-center gap-2 bg-white text-cyan-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              {buttonText}
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Image */}
          {backgroundImage && (
            <div className="hidden md:block">
              <img
                src={backgroundImage}
                alt="Hero"
                className="w-full max-w-md mx-auto"
              />
            </div>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
    </section>
  );
};

export default HeroBanner;