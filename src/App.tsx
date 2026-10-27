import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { ListingPage } from './pages/ListingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SearchPage } from './pages/SearchPage';
import { CartPage } from './pages/cart/CartPage';
import { WishlistPage } from './pages/wishlist/WishlistPage';
import { CheckoutPage } from './pages/checkout/CheckoutPage';
import { OrderTrackingPage } from './pages/orders/OrderTrackingPage';
import { AccountPage } from './pages/account/AccountPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
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
        {/* Browsing */}
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ListingPage />} />
        <Route path="product/:slug" element={<ProductDetailPage />} />
        <Route path="search" element={<SearchPage />} />

        {/* E-commerce */}
        <Route path="cart" element={<CartPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders/track" element={<OrderTrackingPage />} />

        {/* Auth & Account */}
        <Route path="account" element={<AccountPage />} />
        <Route path="account/login" element={<LoginPage />} />
        <Route path="account/register" element={<RegisterPage />} />

        {/* Static Pages */}
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
