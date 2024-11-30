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
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CakeIcon from '@mui/icons-material/Cake';
import { useCart } from '../context/CartContext';

const categories = [
  { name: 'Mariages', path: '/category/mariages' },
  { name: 'Anniversaires', path: '/category/anniversaires' },
  { name: 'Événements d\'entreprise', path: '/category/corporate' },
  { name: 'Célébrations religieuses', path: '/category/religious' },
  { name: 'Baby Showers', path: '/category/babyshower' },
  { name: 'Cocktails', path: '/category/cocktail' },
];

const Navbar = () => {
  const { getCartItemsCount } = useCart();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCategoriesClick = () => {
    setCategoriesOpen(!categoriesOpen);
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
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo - toujours visible */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 700,
            display: { xs: 'none', sm: 'block' }
          }}
        >
          Délices Sucrés
        </Typography>

        {/* Menu hamburger pour mobile */}
        {isMobile && (
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Navigation desktop */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              color="inherit"
              component={Link}
              to="/"
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(255, 64, 129, 0.08)',
                },
              }}
            >
              Accueil
            </Button>
            <Box
              sx={{
                position: 'relative',
                '&:hover > .MuiBox-root': { display: 'block' },
              }}
            >
              <Button
                color="inherit"
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(255, 64, 129, 0.08)',
                  },
                }}
              >
                Nos Pâtisseries
              </Button>
              <Box
                sx={{
                  display: 'none',
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  bgcolor: 'background.paper',
                  boxShadow: 3,
                  borderRadius: 1,
                  width: 220,
                  zIndex: 1,
                }}
              >
                {categories.map((category) => (
                  <Button
                    key={category.path}
                    component={Link}
                    to={category.path}
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      px: 2,
                      py: 1,
                      textAlign: 'left',
                      color: 'text.primary',
                      '&:hover': {
                        bgcolor: 'rgba(255, 64, 129, 0.08)',
                      },
                    }}
                  >
                    {category.name}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {/* Panier - toujours visible */}
        <IconButton
          color="primary"
          component={Link}
          to="/cart"
          sx={{
            '&:hover': {
              bgcolor: 'rgba(255, 64, 129, 0.08)',
            },
          }}
        >
          <Badge badgeContent={getCartItemsCount()} color="primary">
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
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
          }}
        >
          {drawer}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
