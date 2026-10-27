import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { ListingPage } from './pages/ListingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SearchPage } from './pages/SearchPage';
import { AboutPage } from './pages/static/AboutPage';
import { DeliveryPage } from './pages/static/DeliveryPage';
import { SizeGuidePage } from './pages/static/SizeGuidePage';
import { ContactPage } from './pages/static/ContactPage';
import { TermsPage } from './pages/static/TermsPage';
import { PrivacyPage } from './pages/static/PrivacyPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ListingPage />} />
        <Route path="product/:slug" element={<ProductDetailPage />} />
        <Route path="search" element={<SearchPage />} />

        {/* Static Information Pages */}
        <Route path="about" element={<AboutPage />} />
        <Route path="delivery" element={<DeliveryPage />} />
        <Route path="size-guide" element={<SizeGuidePage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
      </Route>
    </Routes>
  );
}
