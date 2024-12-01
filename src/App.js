import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/fr';
import { theme } from './theme';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';


// Components
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import OrderConfirmation from './components/OrderConfirmation';
import ProductMigration from './components/Admin/ProductMigration';
import AdminProducts from './components/Admin/AdminProducts';
import OrderManagement from './components/Admin/OrderManagement';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ResetPassword from './components/Auth/ResetPassword';
import CategoryList from './components/Categories/CategoryList';
import CategoryPage from './components/Categories/CategoryPage';
import Contact from './components/Contact';
import OrderHistory from './components/OrderHistory';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return null; // ou un composant de chargement
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
        <AuthProvider>
          <CartProvider>
            <Router>
              <Navbar />
              <Routes>
                {/* Redirection de la racine vers /categories */}
                <Route path="/" element={<Navigate to="/categories" replace />} />
                
                {/* Routes principales */}
                <Route path="/categories" element={<CategoryList />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
                <Route path="/category/:categoryId/:subcategoryId" element={<CategoryPage />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Protected Routes */}
                <Route
                  path="/confirmation"
                  element={
                    <ProtectedRoute>
                      <OrderConfirmation />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/migrate"
                  element={
                    <ProtectedRoute requireAdmin>
                      <ProductMigration />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute requireAdmin>
                      <OrderManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
  path="/mes-commandes"
  element={
    <ProtectedRoute>
      <OrderHistory />
    </ProtectedRoute>
  }
/>
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Router>
          </CartProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
