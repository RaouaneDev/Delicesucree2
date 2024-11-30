import React from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, CardActions } from '@mui/material';
import { useCart } from '../context/CartContext';
import { Snackbar } from '@mui/material';
import { useState } from 'react';

const products = [
  {
    id: 1,
    name: 'Éclair au Chocolat',
    price: '3.50€',
    description: 'Pâte à choux croustillante garnie d\'une onctueuse crème pâtissière au chocolat noir',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Mille-feuille Vanille',
    price: '4.50€',
    description: 'Trois couches de pâte feuilletée croustillante et deux couches de crème pâtissière à la vanille de Madagascar',
    image: 'https://images.unsplash.com/photo-1620980776848-84ac10194945?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Tarte aux Fraises',
    price: '4.00€',
    description: 'Pâte sablée, crème d\'amande, crème pâtissière et fraises fraîches de saison',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Macaron Assortiment',
    price: '12.00€',
    description: 'Coffret de 6 macarons : vanille, chocolat, framboise, pistache, caramel, citron',
    image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    name: 'Paris-Brest',
    price: '4.50€',
    description: 'Couronne de pâte à choux garnie d\'une crème pralinée aux noisettes',
    image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    name: 'Opéra',
    price: '5.00€',
    description: 'Biscuit joconde, crème au beurre café, ganache chocolat',
    image: 'https://images.unsplash.com/photo-1551404973-761c83cd8339?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 7,
    name: 'Croissant aux Amandes',
    price: '2.80€',
    description: 'Croissant feuilleté garni de crème d\'amandes et amandes effilées',
    image: 'https://images.unsplash.com/photo-1509983165097-0c31a863e3f3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 8,
    name: 'Tarte au Citron Meringuée',
    price: '4.00€',
    description: 'Pâte sablée, crème au citron et meringue italienne',
    image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 9,
    name: 'Forêt Noire',
    price: '4.50€',
    description: 'Génoise au chocolat, chantilly, cerises amarena et copeaux de chocolat',
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=80',
  }
];

const ProductList = () => {
  const { addToCart } = useCart();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleAddToCart = (product) => {
    addToCart(product);
    setSnackbarMessage(`${product.name} ajouté au panier`);
    setOpenSnackbar(true);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Nos Pâtisseries
      </Typography>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: '0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 3,
              }
            }}>
              <CardMedia
                component="img"
                height="260"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  {product.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="large" 
                  color="primary" 
                  variant="contained" 
                  fullWidth
                  sx={{ mx: 1, mb: 1 }}
                  onClick={() => handleAddToCart(product)}
                >
                  Ajouter au panier
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default ProductList;
