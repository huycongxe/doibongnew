import React from 'react';
export const Banner20DataSource = {
  wrapper: { className: 'banner2' },
  BannerAnim: {
    children: [
      {
        name: 'elem0',
        BannerElement: { className: 'banner-user-elem' },
        page: { className: 'home-page banner2-page' },
        textWrapper: { className: 'banner2-text-wrapper' },
        bg: { className: 'bg bg0' },
        title: {
          className: 'banner2-title',
          children: (
            <span>
              <p>BÁO CÁO</p>
            </span>
          ),
        },
        
        button: { className: 'banner2-button', children: 'Xem' },
      },
    ],
  },
};
