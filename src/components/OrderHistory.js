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
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useNavigate } from 'react-router-dom';
import PasswordProtection from './PasswordProtection';
import { scrollToTop } from '../utils/scrollToTop';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const Row = ({ order }) => {
  const [open, setOpen] = useState(false);

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
        <TableCell component="th" scope="row">
          {order.orderNumber}
        </TableCell>
        <TableCell>{order.customerInfo.firstName} {order.customerInfo.lastName}</TableCell>
        <TableCell>{formatDate(order.deliveryDateTime)}</TableCell>
        <TableCell>
          {order.items.reduce((total, item) => 
            total + (parseFloat(item.price) * item.quantity), 0
          ).toFixed(2)}€
        </TableCell>
        <TableCell>
          <Chip 
            label={order.status || 'En attente'} 
            color={
              order.status === 'Livré' ? 'success' :
              order.status === 'En préparation' ? 'warning' :
              'default'
            }
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Détails de la commande
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Produit</TableCell>
                    <TableCell>Quantité</TableCell>
                    <TableCell>Prix unitaire</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {item.name}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.price}€</TableCell>
                      <TableCell>
                        {(item.quantity * parseFloat(item.price)).toFixed(2)}€
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Informations de livraison :
                </Typography>
                <Typography variant="body2">
                  Adresse : {order.customerInfo.address}
                </Typography>
                <Typography variant="body2">
                  Téléphone : {order.customerInfo.phone}
                </Typography>
                <Typography variant="body2">
                  Email : {order.customerInfo.email}
                </Typography>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    scrollToTop();
    const savedOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    setOrders(savedOrders);
  }, []);

  const handlePasswordSuccess = () => {
    setIsAuthenticated(true);
    setShowPasswordDialog(false);
  };

  const handleClose = () => {
    if (!isAuthenticated) {
      navigate('/');
    }
    setShowPasswordDialog(false);
  };

  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${order.customerInfo.firstName} ${order.customerInfo.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <PasswordProtection
        open={showPasswordDialog}
        onClose={handleClose}
        onSuccess={handlePasswordSuccess}
      />
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1" align="center">
        Historique des Commandes
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Rechercher une commande"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher par numéro de commande ou nom du client"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>N° Commande</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Date de livraison</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <Row key={index} order={order} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="subtitle1" sx={{ py: 2 }}>
                    {searchTerm ? "Aucune commande trouvée" : "Aucune commande enregistrée"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default OrderHistory;
