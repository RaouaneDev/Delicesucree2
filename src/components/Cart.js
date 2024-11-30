import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Alert,
  ButtonGroup,
  Button,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '../context/CartContext';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { scrollToTop } from '../utils/scrollToTop';

const Cart = () => {
  const { items, removeFromCart, getTotalPrice, updateDeliveryDateTime, deliveryDateTime, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [dateTimeError, setDateTimeError] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
  });

  useEffect(() => {
    // Scroll to top when component mounts
    scrollToTop();
  }, []);

  const handleDateTimeChange = (newValue) => {
    const now = dayjs();
    const minDateTime = now.add(24, 'hour');
    const maxDateTime = now.add(14, 'day');

    if (newValue.isBefore(minDateTime)) {
      setDateTimeError('La livraison doit être prévue au moins 24h à l\'avance');
      return;
    }

    if (newValue.isAfter(maxDateTime)) {
      setDateTimeError('La livraison doit être prévue dans les 14 jours');
      return;
    }

    setDateTimeError('');
    updateDeliveryDateTime(newValue);
  };

  const handleQuantityChange = (index, delta) => {
    const currentQuantity = items[index].quantity;
    const newQuantity = currentQuantity + delta;
    if (newQuantity >= 1) {
      updateQuantity(index, newQuantity);
    }
  };

  const updateCustomerInfo = (newInfo) => {
    setCustomerInfo((prevInfo) => ({ ...prevInfo, ...newInfo }));
  };

  const isCustomerInfoComplete = () => {
    return (
      customerInfo.firstName &&
      customerInfo.lastName &&
      customerInfo.email &&
      customerInfo.phone &&
      customerInfo.address &&
      customerInfo.postalCode &&
      customerInfo.city
    );
  };

  const handleOrder = () => {
    const orderDetails = {
      items: items.map(item => ({
        ...item,
        price: parseFloat(item.price)
      })),
      customerInfo,
      deliveryDateTime,
      totalPrice: getTotalPrice()
    };
    clearCart();
    navigate('/confirmation', { state: { orderDetails } });
  };

  if (!items || items.length === 0) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          Votre panier est vide
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        Votre Panier
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white' }}>Produit</TableCell>
              <TableCell align="right" sx={{ color: 'white' }}>Prix unitaire</TableCell>
              <TableCell align="center" sx={{ color: 'white' }}>Quantité</TableCell>
              <TableCell align="right" sx={{ color: 'white' }}>Total</TableCell>
              <TableCell align="right" sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => {
              const price = parseFloat(item.price.replace('€', '').replace(',', '.'));
              const total = price * item.quantity;
              
              return (
                <TableRow key={index} sx={{ '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: 'cover',
                          marginRight: '16px',
                          borderRadius: '8px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                        {item.customMessage && (
                          <Typography 
                            variant="body2" 
                            color="primary"
                            sx={{ 
                              mt: 1, 
                              p: 1.5,
                              bgcolor: 'rgba(255, 64, 129, 0.08)',
                              borderRadius: 2,
                              fontStyle: 'italic',
                              maxWidth: '300px',
                              wordBreak: 'break-word'
                            }}
                          >
                            Message : "{item.customMessage}"
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{item.price}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ButtonGroup 
                        variant="outlined" 
                        size="small"
                        sx={{ 
                          '& .MuiButtonGroup-grouped:not(:last-of-type)': {
                            borderColor: 'primary.main',
                          },
                        }}
                      >
                        <IconButton
                          onClick={() => handleQuantityChange(index, -1)}
                          disabled={item.quantity <= 1}
                          sx={{ 
                            borderRadius: '8px 0 0 8px',
                            color: 'primary.main',
                            '&:hover': {
                              bgcolor: 'primary.light',
                              color: 'white',
                            },
                          }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Box
                          sx={{
                            minWidth: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 1,
                            borderColor: 'primary.main',
                            borderLeft: 0,
                            borderRight: 0,
                            bgcolor: 'background.paper',
                            px: 1,
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.quantity}
                          </Typography>
                        </Box>
                        <IconButton
                          onClick={() => handleQuantityChange(index, 1)}
                          sx={{ 
                            borderRadius: '0 8px 8px 0',
                            color: 'primary.main',
                            '&:hover': {
                              bgcolor: 'primary.light',
                              color: 'white',
                            },
                          }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </ButtonGroup>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{total.toFixed(2)}€</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="error"
                      onClick={() => removeFromCart(index)}
                      sx={{ 
                        '&:hover': {
                          bgcolor: 'error.light',
                          color: 'white',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Barre de total fixe pour mobile */}
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'background.paper',
          boxShadow: 3,
          zIndex: 1000,
          p: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6" color="primary.main">{getTotalPrice()}€</Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={!isCustomerInfoComplete() || !deliveryDateTime}
          onClick={handleOrder}
        >
          Commander
        </Button>
      </Box>

      {/* Marge en bas pour mobile pour éviter que le contenu soit caché par la barre fixe */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, height: '120px' }} />

      <Box sx={{ 
        maxWidth: 800, 
        mx: 'auto', 
        mt: 6,
        mb: { xs: 8, md: 4 }, 
        display: 'grid',
        gap: 4,
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }
      }}>
        {/* Informations client */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Informations client
          </Typography>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
              <TextField
                label="Prénom"
                value={customerInfo.firstName}
                onChange={(e) => updateCustomerInfo({ firstName: e.target.value })}
                fullWidth
                required
                variant="outlined"
                size="small"
              />
              <TextField
                label="Nom"
                value={customerInfo.lastName}
                onChange={(e) => updateCustomerInfo({ lastName: e.target.value })}
                fullWidth
                required
                variant="outlined"
                size="small"
              />
            </Box>
            <TextField
              label="Email"
              type="email"
              value={customerInfo.email}
              onChange={(e) => updateCustomerInfo({ email: e.target.value })}
              fullWidth
              required
              variant="outlined"
              size="small"
            />
            <TextField
              label="Téléphone"
              value={customerInfo.phone}
              onChange={(e) => updateCustomerInfo({ phone: e.target.value })}
              fullWidth
              required
              variant="outlined"
              size="small"
            />
            <TextField
              label="Adresse de livraison"
              value={customerInfo.address}
              onChange={(e) => updateCustomerInfo({ address: e.target.value })}
              fullWidth
              required
              variant="outlined"
              size="small"
              multiline
              rows={2}
            />
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
              <TextField
                label="Code postal"
                value={customerInfo.postalCode}
                onChange={(e) => updateCustomerInfo({ postalCode: e.target.value })}
                fullWidth
                required
                variant="outlined"
                size="small"
              />
              <TextField
                label="Ville"
                value={customerInfo.city}
                onChange={(e) => updateCustomerInfo({ city: e.target.value })}
                fullWidth
                required
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
        </Box>

        {/* Date et heure de livraison */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Date et heure de livraison
          </Typography>
          <Box sx={{ 
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: 2,
            boxShadow: 1,
            '& .MuiFormControl-root': { mb: 2 }
          }}>
            <DateTimePicker
              label="Date et heure de livraison"
              value={deliveryDateTime}
              onChange={handleDateTimeChange}
              minDateTime={dayjs().add(24, 'hour')}
              maxDateTime={dayjs().add(14, 'day')}
              ampm={false}
              sx={{ width: '100%' }}
            />
            {dateTimeError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {dateTimeError}
              </Alert>
            )}
          </Box>

          {/* Bouton Commander pour desktop */}
          <Box sx={{ 
            display: { xs: 'none', md: 'block' },
            mt: 4,
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 2,
              p: 2,
              bgcolor: 'rgba(0, 0, 0, 0.02)',
              borderRadius: 1
            }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary.main">{getTotalPrice()}€</Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={!isCustomerInfoComplete() || !deliveryDateTime}
              onClick={handleOrder}
            >
              Commander
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Marge supplémentaire en bas sur mobile */}
      <Box sx={{ height: { xs: '140px', md: '60px' } }} />
    </Container>
  );
};

export default Cart;
