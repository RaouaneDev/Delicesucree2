import React from 'react';
import { Container, Typography, Paper, Box, Divider } from '@mui/material';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          Commande non trouvée
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          Merci pour votre commande !
        </Typography>
        
        <Typography variant="h6" gutterBottom align="center">
          Numéro de commande : {order.id}
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Détails de livraison
          </Typography>
          <Typography>
            {order.customerInfo.firstName} {order.customerInfo.lastName}
          </Typography>
          <Typography>
            {order.customerInfo.address}
          </Typography>
          <Typography>
            {order.customerInfo.postalCode} {order.customerInfo.city}
          </Typography>
          <Typography>
            Email : {order.customerInfo.email}
          </Typography>
          <Typography>
            Téléphone : {order.customerInfo.phone}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Date de livraison prévue : {dayjs(order.deliveryDateTime).format('DD/MM/YYYY HH:mm')}
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Récapitulatif de la commande
          </Typography>
          {order.items.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>
                {item.quantity}x {item.name}
              </Typography>
              <Typography>
                {(item.price * item.quantity).toFixed(2)} €
              </Typography>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <Typography variant="h6">
              Total
            </Typography>
            <Typography variant="h6">
              {order.totalAmount} €
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderConfirmation;
