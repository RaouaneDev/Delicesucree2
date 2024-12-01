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
import { createOrder } from '../firebase/orderService';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getTotalPrice 
  } = useCart();
  const navigate = useNavigate();
  const [deliveryDateTime, setDeliveryDateTime] = useState(dayjs().add(1, 'day'));
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
    setDeliveryDateTime(newValue);
  };

  const handleQuantityChange = (productId, delta) => {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity >= 1) {
        updateQuantity(productId, newQuantity);
      }
    }
  };

  const updateCustomerInfo = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isCustomerInfoComplete = () => {
    return Object.values(customerInfo).every(value => value.trim() !== '');
  };

  const formatPrice = (price) => {
    if (typeof price === 'string') {
      return parseFloat(price.replace('€', '').replace(',', '.')).toFixed(2);
    }
    return parseFloat(price).toFixed(2);
  };

  const handleOrder = async () => {
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: formatPrice(item.price),
          quantity: item.quantity
        })),
        totalAmount: getTotalPrice(),
        customerInfo,
        deliveryDateTime: deliveryDateTime.format(),
        status: 'pending',
        createdAt: dayjs().format()
      };

      const order = await createOrder(orderData);
      clearCart();
      navigate('/confirmation', { 
        state: { 
          order: {
            ...orderData,
            id: order.id
          }
        } 
      });
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
    }
  };

  if (!cartItems || cartItems.length === 0) {
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
            {cartItems.map((item) => (
              <TableRow key={item.id} sx={{ '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } }}>
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
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {formatPrice(item.price)} €
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <ButtonGroup size="small" sx={{ mx: 1 }}>
                    <IconButton 
                      onClick={() => handleQuantityChange(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ mx: 2, lineHeight: '32px' }}>
                      {item.quantity}
                    </Typography>
                    <IconButton 
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <AddIcon />
                    </IconButton>
                  </ButtonGroup>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {(formatPrice(item.price) * item.quantity).toFixed(2)} €
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={() => removeFromCart(item.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="right" sx={{ fontWeight: 700 }}>
                Total
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                {getTotalPrice()} €
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box component={Paper} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Informations de livraison
        </Typography>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <TextField
            label="Prénom"
            value={customerInfo.firstName}
            onChange={(e) => updateCustomerInfo('firstName', e.target.value)}
            required
          />
          <TextField
            label="Nom"
            value={customerInfo.lastName}
            onChange={(e) => updateCustomerInfo('lastName', e.target.value)}
            required
          />
          <TextField
            label="Email"
            type="email"
            value={customerInfo.email}
            onChange={(e) => updateCustomerInfo('email', e.target.value)}
            required
          />
          <TextField
            label="Téléphone"
            value={customerInfo.phone}
            onChange={(e) => updateCustomerInfo('phone', e.target.value)}
            required
          />
          <TextField
            label="Adresse"
            value={customerInfo.address}
            onChange={(e) => updateCustomerInfo('address', e.target.value)}
            required
            fullWidth
            sx={{ gridColumn: { md: '1 / -1' } }}
          />
          <TextField
            label="Code postal"
            value={customerInfo.postalCode}
            onChange={(e) => updateCustomerInfo('postalCode', e.target.value)}
            required
          />
          <TextField
            label="Ville"
            value={customerInfo.city}
            onChange={(e) => updateCustomerInfo('city', e.target.value)}
            required
          />
        </Box>
      </Box>

      <Box component={Paper} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Date et heure de livraison
        </Typography>
        <DateTimePicker
          value={deliveryDateTime}
          onChange={handleDateTimeChange}
          minDateTime={dayjs().add(24, 'hour')}
          maxDateTime={dayjs().add(14, 'day')}
          sx={{ width: '100%' }}
        />
        {dateTimeError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {dateTimeError}
          </Alert>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleOrder}
          disabled={!isCustomerInfoComplete() || !!dateTimeError}
        >
          Commander
        </Button>
      </Box>
    </Container>
  );
};

export default Cart;
