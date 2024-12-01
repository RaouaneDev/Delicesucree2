import React, { useRef, useState, useEffect } from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, CardActions, CircularProgress } from '@mui/material';
import { useCart } from '../context/CartContext';
import { Snackbar } from '@mui/material';
import AddToCartAnimation from './AddToCartAnimation';
import useAddToCartAnimation from '../hooks/useAddToCartAnimation';
import { getAllProducts, getProductsByCategory } from '../firebase/productService';

const ProductList = ({ category }) => {
  const { addItem } = useCart();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { isAnimating, startAnimation, animationConfig } = useAddToCartAnimation();
  const productRefs = useRef({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = category 
          ? await getProductsByCategory(category)
          : await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error('Erreur lors du chargement des produits:', err);
        setError('Une erreur est survenue lors du chargement des produits.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category]);

  const handleAddToCart = (product, event) => {
    const productElement = productRefs.current[product.id];
    const cartElement = document.querySelector('.MuiIconButton-root .MuiBadge-root');
    
    if (productElement && cartElement) {
      startAnimation(productElement, cartElement);
    }
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
    
    setOpenSnackbar(true);
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography color="error" align="center">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <AddToCartAnimation
        isVisible={isAnimating}
        startPosition={animationConfig.startPosition}
        endPosition={animationConfig.endPosition}
      />
      
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card
              ref={el => productRefs.current[product.id] = el}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.image || '/placeholder.jpg'}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography>
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  {product.price} €
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="large" 
                  fullWidth 
                  variant="contained" 
                  color="primary"
                  onClick={(e) => handleAddToCart(product, e)}
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
        message="Produit ajouté au panier"
      />
    </Container>
  );
};

export default ProductList;
