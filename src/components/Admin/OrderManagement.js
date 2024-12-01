import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { db } from '../../firebase/config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

// Material-UI Components
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Chip,
  Alert,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CircularProgress
} from '@mui/material';

const ORDER_STATUSES = {
  pending: { label: 'En attente', color: 'warning' },
  processing: { label: 'En cours', color: 'info' },
  shipped: { label: 'Expédié', color: 'primary' },
  delivered: { label: 'Livré', color: 'success' },
  cancelled: { label: 'Annulé', color: 'error' }
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const ordersRef = collection(db, 'orders');
      const querySnapshot = await getDocs(ordersRef);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    } catch (error) {
      setError('Erreur lors du chargement des commandes: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [currentUser, navigate, loadOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date()
      });
      await loadOrders();
    } catch (error) {
      setError('Erreur lors de la mise à jour du statut: ' + error.message);
    }
  };

  const getStatusChipColor = (status) => {
    return ORDER_STATUSES[status]?.color || 'default';
  };

  const formatDate = (date) => {
    if (!date) return '';
    return format(date.toDate(), 'PPP', { locale: fr });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Typography variant="h4" component="h1" gutterBottom>
        Gestion des Commandes
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Commande</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.total.toFixed(2)} €</TableCell>
                <TableCell>
                  <Chip
                    label={ORDER_STATUSES[order.status]?.label || order.status}
                    color={getStatusChipColor(order.status)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedOrder(order)}
                  >
                    Détails
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="md" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>
              Détails de la commande #{selectedOrder.id}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardHeader title="Informations client" />
                    <CardContent>
                      <Typography>Nom: {selectedOrder.customerName}</Typography>
                      <Typography>Email: {selectedOrder.customerEmail}</Typography>
                      <Typography>Téléphone: {selectedOrder.customerPhone}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardHeader title="Adresse de livraison" />
                    <CardContent>
                      <Typography>{selectedOrder.shippingAddress?.street}</Typography>
                      <Typography>
                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedOrder(null)}>Fermer</Button>
              {Object.entries(ORDER_STATUSES).map(([status, { label }]) => (
                <Button
                  key={status}
                  variant={selectedOrder.status === status ? 'contained' : 'outlined'}
                  onClick={() => handleStatusChange(selectedOrder.id, status)}
                  disabled={selectedOrder.status === status}
                >
                  {label}
                </Button>
              ))}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default OrderManagement;