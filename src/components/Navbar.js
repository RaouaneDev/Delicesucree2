import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  useTheme,
  useMediaQuery,
  Collapse,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CakeIcon from '@mui/icons-material/Cake';
import { useCart } from '../context/CartContext';

const categories = [
  { name: 'Mariages', path: '/category/mariages' },
  { name: 'Anniversaires', path: '/category/anniversaires' },
  { name: 'Événements d\'entreprise', path: '/category/entreprise' },
  { name: 'Célébrations religieuses', path: '/category/religieux' },
  { name: 'Baby Showers', path: '/category/babyshower' },
  { name: 'Cocktails', path: '/category/cocktails' },
];

const Navbar = () => {
  const { getCartItemsCount } = useCart();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCategoriesClick = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem component={Link} to="/" onClick={handleDrawerToggle}>
          <ListItemText 
            primary="Délices Sucrés" 
            primaryTypographyProps={{
              variant: 'h6',
              sx: { color: theme.palette.primary.main }
            }}
          />
        </ListItem>

        <ListItemButton onClick={handleCategoriesClick}>
          <ListItemIcon>
            <CakeIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Nos Pâtisseries" />
          {categoriesOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={categoriesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {categories.map((category) => (
              <ListItemButton
                key={category.path}
                component={Link}
                to={category.path}
                onClick={handleDrawerToggle}
                selected={location.pathname === category.path}
                sx={{ pl: 4 }}
              >
                <ListItemText primary={category.name} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

        <ListItemButton
          component={Link}
          to="/cart"
          onClick={handleDrawerToggle}
          selected={location.pathname === '/cart'}
        >
          <ListItemIcon>
            <Badge badgeContent={getCartItemsCount()} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Panier" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1a1a1a' }}>
      <Toolbar>
        {/* Logo - toujours visible */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: '#ffd700',
            fontWeight: 700,
            display: { xs: 'none', sm: 'block' }
          }}
        >
          Délices Sucrés
        </Typography>

        {/* Menu hamburger pour mobile */}
        {isMobile && (
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: '#ffffff' }}
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
                '& .MuiPaper-root': {
                  backgroundColor: '#1a1a1a',
                },
              }}
            >
              <MenuItem onClick={() => {
                handleCloseNavMenu();
                navigate('/');
              }}>
                <Typography textAlign="center" sx={{ color: '#ffffff' }}>Accueil</Typography>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem 
                  key={category.path} 
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(category.path);
                  }}
                  sx={{ color: '#ffffff' }}
                >
                  <Typography textAlign="center">{category.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}

        {/* Navigation desktop */}
        <Box sx={{ 
          flexGrow: 1, 
          display: { xs: 'none', md: 'flex' }, 
          justifyContent: 'center',
          gap: 2
        }}>
          <Button
            component={Link}
            to="/"
            sx={{ 
              color: '#ffffff',
              '&:hover': { color: '#ffd700' }
            }}
          >
            Accueil
          </Button>
          {categories.map((category) => (
            <Button
              key={category.path}
              component={Link}
              to={category.path}
              sx={{ 
                color: '#ffffff',
                '&:hover': { color: '#ffd700' }
              }}
            >
              {category.name}
            </Button>
          ))}
        </Box>

        {/* Panier */}
        <IconButton
          component={Link}
          to="/cart"
          sx={{
            color: '#ffffff',
            '&:hover': { color: '#ffd700' },
          }}
        >
          <Badge badgeContent={getCartItemsCount()} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        {/* Drawer pour mobile */}
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 250,
              backgroundColor: '#1a1a1a',
              color: '#ffffff'
            },
          }}
        >
          {drawer}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
