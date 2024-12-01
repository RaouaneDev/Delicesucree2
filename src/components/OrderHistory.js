import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Collapse,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ORDER_STATUS_COLORS = {
  'pending': 'warning',
  'processing': 'info',
  'completed': 'success',
  'cancelled': 'error',
  'en_preparation': 'warning',
  'en_livraison': 'info',
  'livre': 'success',
  'annule': 'error'
};

const ORDER_STATUS_LABELS = {
  'pending': 'En attente',
  'processing': 'En préparation',
  'completed': 'Livré',
  'cancelled': 'Annulé',
  'en_preparation': 'En préparation',
  'en_livraison': 'En livraison',
  'livre': 'Livré',
  'annule': 'Annulé'
};

const formatDate = (date) => {
  if (!date) return 'Date inconnue';
  try {
    const timestamp = date.seconds ? new Date(date.seconds * 1000) : new Date(date);
    return format(timestamp, "d MMMM yyyy 'à' HH:mm", { locale: fr });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date invalide';
  }
};

const OrderRow = ({ order }) => {
  const [open, setOpen] = useState(false);

  const calculateTotal = (items) => {
    return items?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{order.id.slice(-6).toUpperCase()}</TableCell>
        <TableCell>{formatDate(order.createdAt)}</TableCell>
        <TableCell>{calculateTotal(order.items).toFixed(2)}€</TableCell>
        <TableCell>
          <Chip
            label={ORDER_STATUS_LABELS[order.status] || order.status}
            color={ORDER_STATUS_COLORS[order.status] || 'default'}
            size="small"
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Informations de livraison
                      </Typography>
                      <Typography variant="body2">
                        {order.shippingDetails?.firstName || 'N/A'} {order.shippingDetails?.lastName || ''}
                      </Typography>
                      <Typography variant="body2">
                        {order.shippingDetails?.email || 'Pas d\'email'}
                      </Typography>
                      <Typography variant="body2">
                        {order.shippingDetails?.phone || 'Pas de téléphone'}
                      </Typography>
                      <Typography variant="body2">
                        {order.shippingDetails?.address || 'Pas d\'adresse'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Détails de la commande
                      </Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Produit</TableCell>
                            <TableCell align="right">Qté</TableCell>
                            <TableCell align="right">Prix</TableCell>
                            <TableCell align="right">Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {order.items?.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell align="right">{item.quantity}</TableCell>
                              <TableCell align="right">{item.price}€</TableCell>
                              <TableCell align="right">
                                {(item.price * item.quantity).toFixed(2)}€
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={3} align="right">
                              <strong>Total</strong>
                            </TableCell>
                            <TableCell align="right">
                              <strong>{calculateTotal(order.items).toFixed(2)}€</strong>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setOrders(ordersData);
        setError(null);
      } catch (err) {
        console.error('Error loading orders:', err);
        setError('Une erreur est survenue lors du chargement de vos commandes.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info">
          Veuillez vous connecter pour voir votre historique de commandes.
        </Alert>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info">
          Vous n'avez pas encore passé de commande.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Historique des commandes
      </Typography>
      
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>N° Commande</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default OrderHistory;
