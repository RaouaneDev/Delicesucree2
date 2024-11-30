import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/fr';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CategoryProducts from './components/CategoryProducts';
import FloatingCart from './components/FloatingCart';
import OrderConfirmation from './components/OrderConfirmation';
import { CartProvider } from './context/CartContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF69B4',
    },
    secondary: {
      main: '#FF1493',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          minHeight: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
        },
        '#root': {
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
      },
    },
  },
});

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
      <CartProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/category/:category" element={<CategoryProducts />} />
              <Route path="/confirmation" element={<OrderConfirmation />} />
            </Routes>
            <FloatingCart />
          </Router>
        </ThemeProvider>
      </CartProvider>
    </LocalizationProvider>
  );
}

export default App;
