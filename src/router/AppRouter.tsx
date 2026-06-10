import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ForbiddenPage } from '../features/auth/pages/ForbiddenPage';

import { ProductsPage } from '../features/products/pages/ProductsPage';
import { ProductDetailPage } from '../features/products/pages/ProductDetailPage';
import { CartPage } from '../features/cart/pages/CartPage';
import { OrdersPage } from '../features/orders/pages/OrdersPage';
import { ProfilePage } from '../features/profile/pages/ProfilePage';
import { PaymentResultPage } from '../features/payments/pages/PaymentResultPage';

import { Navbar } from '../shared/components/Navbar';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRouter = () => {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />

        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />


        <Route element={<ProtectedRoute allowedRoles={['CLIENT', 'ADMIN']} />}>
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:pedidoId/:estado" element={<PaymentResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

