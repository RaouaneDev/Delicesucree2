import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Badge,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  AdminPanelSettings as AdminIcon,
  Assignment as OrdersIcon,
  Inventory as ProductsIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { logoutUser } from '../firebase/authService';

const pages = [
  { title: 'Accueil', path: '/' },
  { title: 'Nos Produits', path: '/categories' },
  { title: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { user, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
      handleCloseUserMenu();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1a1a1a' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo - Desktop */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Délices Sucrés
          </Typography>

          {/* Menu Mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                
                <MenuItem
                  key={page.title}
                  onClick={handleCloseNavMenu}
                  component={Link}
                  to={page.path}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
              {isAdmin && (
                <>
                  <Divider />
                  <MenuItem
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to="/admin/products"
                  >
                    <ProductsIcon sx={{ mr: 1 }} />
                    <Typography textAlign="center">Gestion Produits</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to="/admin/orders"
                  >
                    <OrdersIcon sx={{ mr: 1 }} />
                    <Typography textAlign="center">Gestion Commandes</Typography>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>

          {/* Logo - Mobile */}
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Délices Sucrés
          </Typography>

          {/* Menu Desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                component={Link}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.title}
              </Button>
            ))}
            {isAdmin && (
              <>
                <Button
                  component={Link}
                  to="/admin/products"
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center' }}
                  startIcon={<ProductsIcon />}
                >
                  Gestion Produits
                </Button>
                <Button
                  component={Link}
                  to="/admin/orders"
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center' }}
                  startIcon={<OrdersIcon />}
                >
                  Gestion Commandes
                </Button>
              </>
            )}
          </Box>

          {/* Right Section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Cart Icon */}
            <IconButton
              component={Link}
              to="/cart"
              size="large"
              aria-label="show cart items"
              color="inherit"
              sx={{ mr: 2 }}
            >
              <Badge badgeContent={getCartItemCount()} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* User Menu */}
            {user ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Paramètres">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar 
                      alt={user.email} 
                      src={user.photoURL || "/static/images/avatar/2.jpg"}
                      sx={{ bgcolor: isAdmin ? 'primary.main' : 'secondary.main' }}
                    >
                      {isAdmin ? <AdminIcon /> : user.email?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleCloseUserMenu}
                  >
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/orders"
                    onClick={handleCloseUserMenu}
                  >
                    <Typography textAlign="center">Mes Commandes</Typography>
                  </MenuItem>
                  {isAdmin && (
                    <>
                      <Divider />
                      <MenuItem
                        component={Link}
                        to="/admin/products"
                        onClick={handleCloseUserMenu}
                      >
                        <ProductsIcon sx={{ mr: 1 }} />
                        <Typography textAlign="center">Gestion Produits</Typography>
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/admin/orders"
                        onClick={handleCloseUserMenu}
                      >
                        <OrdersIcon sx={{ mr: 1 }} />
                        <Typography textAlign="center">Gestion Commandes</Typography>
                      </MenuItem>
                    </>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Déconnexion</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Connexion
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;