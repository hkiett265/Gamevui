'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { PROMO_BANNERS } from '@/data/promos';

export const PromoBanners: React.FC = () => {
  const [banners, setBanners] = React.useState(PROMO_BANNERS);

  React.useEffect(() => {
    fetch('/api/promos')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.promos) && data.promos.length > 0) {
          setBanners(data.promos);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="promo-banners-grid">
      {banners.map((banner) => (
        <div key={banner.id} className="promo-banner-card">
          {/* Background Illustration */}
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            className="promo-banner-bg"
          />

          {/* Banner Content Layer */}
          <div className="promo-banner-content">
            <div>
              <h3 className="promo-banner-title">{banner.title}</h3>
              <p className="promo-banner-subtitle">{banner.subtitle}</p>
            </div>

            <button
              className="promo-banner-btn"
              style={{
                background: banner.buttonBg,
                color: banner.buttonColor
              }}
              onClick={() => alert(`Mở tính năng: ${banner.title}`)}
            >
              <span>{banner.buttonText}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
