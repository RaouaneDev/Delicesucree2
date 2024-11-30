import React, { useState } from 'react';
import { 
  Fab, 
  Badge, 
  Drawer, 
  Box, 
  Typography, 
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const FloatingCart = () => {
  const [open, setOpen] = useState(false);
  const { items, removeFromCart, getTotalPrice, getCartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleViewCart = () => {
    navigate('/cart');
    setOpen(false);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="panier"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
        onClick={handleDrawerOpen}
      >
        <Badge badgeContent={getCartItemsCount()} color="error">
          <ShoppingCartIcon />
        </Badge>
      </Fab>

      <Drawer
        anchor="right"
        open={open}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 } }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Panier ({getCartItemsCount()})
            </Typography>
            <IconButton onClick={handleDrawerClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <img 
                      src={item.image} 
                      alt={item.name}
                      style={{ 
                        width: 60, 
                        height: 60, 
                        objectFit: 'cover', 
                        borderRadius: '4px',
                        marginRight: '16px'
                      }}
                    />
                    <ListItemText
                      primary={item.name}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            Prix: {item.price}
                          </Typography>
                          {item.quantity > 1 && (
                            <Typography variant="body2" color="text.secondary">
                              Quantité: {item.quantity}
                            </Typography>
                          )}
                          {item.customMessage && (
                            <Typography 
                              variant="body2" 
                              color="primary"
                              sx={{ 
                                mt: 0.5,
                                fontSize: '0.75rem',
                                fontStyle: 'italic'
                              }}
                            >
                              Message: "{item.customMessage}"
                            </Typography>
                          )}
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => removeFromCart(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </Box>
                </ListItem>
                {index < items.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>

          {items.length > 0 ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" align="right" gutterBottom>
                Total: {getTotalPrice()}€
              </Typography>
              <Box 
                sx={{ 
                  cursor: 'pointer',
                  bgcolor: 'primary.main',
                  color: 'white',
                  py: 2,
                  textAlign: 'center',
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
                onClick={handleViewCart}
              >
                Voir le panier complet
              </Box>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
              Votre panier est vide
            </Typography>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default FloatingCart;
