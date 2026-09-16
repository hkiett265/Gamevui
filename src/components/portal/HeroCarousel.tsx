'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Flame, Gamepad2 } from 'lucide-react';
import { HERO_SLIDES } from '@/data/games';

export const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState(HERO_SLIDES);

  useEffect(() => {
    fetch('/api/hero-slides')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.slides) && data.slides.length > 0) {
          setSlides(data.slides);
        }
      })
      .catch(() => {});
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto advance every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="hero-carousel-wrapper">
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`hero-slide ${isActive ? 'active' : ''}`}
          >
            {/* Background Image */}
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="hero-bg-img"
              priority={index === 0}
            />

            {/* Gradient Overlays */}
            <div className="hero-gradient-overlay" />

            {/* Content Layer */}
            <div className="hero-content-layer">
              {/* Top Badge */}
              <div className="hero-badge-pill">
                <Flame size={14} fill="#ffffff" />
                <span>{slide.badge}</span>
              </div>

              {/* Title & CTAs */}
              <div>
                <div className="hero-title-group">
                  <h1 className="hero-main-title">{slide.title}</h1>
                  <h2 className="hero-sub-title">{slide.subtitle}</h2>
                  <p className="hero-tagline">{slide.tagline}</p>
                </div>

                <div className="hero-cta-row">
                  <Link
                    href={`/play/${slide.gameSlug}`}
                    className="hero-btn-play"
                  >
                    <Gamepad2 size={20} />
                    <span>{slide.ctaText}</span>
                  </Link>

                  <Link
                    href={`/game/${slide.gameSlug}`}
                    className="hero-btn-details"
                  >
                    <span>{slide.secondaryCtaText}</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Wooden Farm Sign (Right Side) */}
            {slide.woodenSignLines && slide.woodenSignLines.length > 0 && (
              <div className="hero-wooden-sign">
                {slide.woodenSignLines.map((line, idx) => (
                  <div key={idx} className="wooden-line">
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        className="hero-nav-arrow hero-nav-prev"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        className="hero-nav-arrow hero-nav-next"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* Pagination Dots */}
      <div className="hero-pagination-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`hero-dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
