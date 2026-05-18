import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { LoginPage } from "../features/auth/pages/LoginPage";
import { ForbiddenPage } from "../features/auth/pages/ForbiddenPage";

import { ProductsPage } from "../features/products/pages/ProductsPage";
import { ProductDetailPage } from "../features/products/pages/ProductDetailPage";
import { CartPage } from "../features/cart/pages/CartPage";
import { OrdersPage } from "../features/orders/pages/OrdersPage";
import { ProfilePage } from "../features/profile/pages/ProfilePage";

import { Navbar } from "../shared/components/Navbar";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />

          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};
