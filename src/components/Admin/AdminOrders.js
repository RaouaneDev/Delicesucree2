import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  LocalShipping as ShippingIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { 
  getAllOrders, 
  updateOrderStatus, 
  getOrdersByStatus,
  addOrderNotes 
} from '../../firebase/orderService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ORDER_STATUSES = {
  pending: { label: 'En attente', color: 'warning' },
  confirmed: { label: 'Confirmée', color: 'info' },
  preparing: { label: 'En préparation', color: 'primary' },
  ready: { label: 'Prête', color: 'success' },
  completed: { label: 'Terminée', color: 'default' },
  cancelled: { label: 'Annulée', color: 'error' }
};

const AdminOrders = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [notes, setNotes] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadOrders();
  }, [isAdmin, navigate, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      let ordersData;
      if (statusFilter === 'all') {
        ordersData = await getAllOrders();
      } else {
        ordersData = await getOrdersByStatus(statusFilter);
      }
      setOrders(ordersData);
      setError(null);
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Erreur lors du chargement des commandes. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setNotes(order.notes || '');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
    setNotes('');
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus, notes);
      await loadOrders();
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Erreur lors de la mise à jour du statut. Veuillez réessayer.');
    }
  };

  const handleNotesChange = async (orderId, newNotes) => {
    try {
      await addOrderNotes(orderId, newNotes);
      await loadOrders();
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating notes:', error);
      setError('Erreur lors de la mise à jour des notes. Veuillez réessayer.');
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setStatusFilter(newValue);
  };

  const formatDate = (date) => {
    if (!date) return 'Date inconnue';
    return format(date, "d MMMM yyyy 'à' HH:mm", { locale: fr });
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" color="primary">
          Gestion des Commandes
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Toutes" value="all" />
          {Object.entries(ORDER_STATUSES).map(([status, { label }]) => (
            <Tab key={status} label={label} value={status} />
          ))}
        </Tabs>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>N° Commande</TableCell>
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
                <TableCell>{order.id.slice(-6).toUpperCase()}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <Typography variant="body2">{order.shippingDetails.firstName} {order.shippingDetails.lastName}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {order.shippingDetails.email}
                  </Typography>
                </TableCell>
                <TableCell>{calculateTotal(order.items)} €</TableCell>
                <TableCell>
                  <Chip
                    label={ORDER_STATUSES[order.status]?.label || order.status}
                    color={ORDER_STATUSES[order.status]?.color || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Voir les détails">
                    <IconButton onClick={() => handleOpenDialog(order)} color="primary" size="small">
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>
              Commande #{selectedOrder.id.slice(-6).toUpperCase()}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Informations Client
                      </Typography>
                      <Typography variant="body2">
                        {selectedOrder.shippingDetails.firstName} {selectedOrder.shippingDetails.lastName}
                      </Typography>
                      <Typography variant="body2">
                        {selectedOrder.shippingDetails.email}
                      </Typography>
                      <Typography variant="body2">
                        {selectedOrder.shippingDetails.phone}
                      </Typography>
                      <Typography variant="body2">
                        {selectedOrder.shippingDetails.address}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Détails de la Commande
                      </Typography>
                      <Typography variant="body2">
                        Date: {formatDate(selectedOrder.createdAt)}
                      </Typography>
                      <Typography variant="body2">
                        Total: {calculateTotal(selectedOrder.items)} €
                      </Typography>
                      <Typography variant="body2">
                        Statut: {ORDER_STATUSES[selectedOrder.status]?.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Articles
                      </Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Produit</TableCell>
                            <TableCell align="right">Quantité</TableCell>
                            <TableCell align="right">Prix unitaire</TableCell>
                            <TableCell align="right">Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedOrder.items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell align="right">{item.quantity}</TableCell>
                              <TableCell align="right">{item.price.toFixed(2)} €</TableCell>
                              <TableCell align="right">
                                {(item.price * item.quantity).toFixed(2)} €
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Changer le statut</InputLabel>
                    <Select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                      label="Changer le statut"
                    >
                      {Object.entries(ORDER_STATUSES).map(([status, { label }]) => (
                        <MenuItem key={status} value={status}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Notes"
                    multiline
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    fullWidth
                    sx={{ mt: 2 }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="inherit">
                Fermer
              </Button>
              <Button
                onClick={() => handleNotesChange(selectedOrder.id, notes)}
                variant="contained"
                color="primary"
              >
                Enregistrer les notes
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default AdminOrders;
