// useEffect, useState works only on client-side
'use client'

import { useState, useEffect } from 'react';
import { Figtree } from 'next/font/google';

/* That's the proper way to use Bootstrap in a Next.js appß */
import 'bootstrap/dist/css/bootstrap.min.css';
import './global.css';
import './layout.css'
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import { callApi } from '../lib/client';
import { httpMethods } from '../lib/utils';
import { frontend } from '../lib/config';

/* That's the proper way to use Google fonts in a Next.js app */
const googleFont = Figtree({
  weight: '400',
  subsets: ['latin']
});

const RootLayout = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const setXcsrfToken = async () => {
      if(!localStorage.getItem('xcsrf')) {
        const response = await callApi(frontend.urls.api.getXcsrf, httpMethods.Get);
        if(response.payload == null) {
          // There's a problem with the backend
          if(window.location.pathname !== frontend.urls.pages.errorPage) {
            window.location.href = frontend.urls.pages.errorPage;
          }
        } else {
          localStorage.setItem('xcsrf', response.payload.xcsrf);
        }
      }
    };

    setXcsrfToken();

    if(window.location.pathname != `${frontend.urls.pages.loginPage}`) {
      localStorage.removeItem('loginRedirectUrl');
    }

    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <html lang="en" className={googleFont.className}>
      <head>
        <meta charSet="utf-8" />

        { /* Responsive viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>Web App Starter Pack</title>

        <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png" />

        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <div className="layout">
          <header className={`sticky ${scrolled ? 'scrolled' : ''}`}>
            <Header />
          </header>
          <main>
            {children}
          </main>
          <footer>
            <Footer />
          </footer>
        </div>
      </body>
    </html>
  )
};

export default RootLayout;