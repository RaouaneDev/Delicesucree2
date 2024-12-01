import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Rating,
  Chip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
  };

  return (
    <Card
      component={Link}
      to={`/product/${product.id}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Typography gutterBottom variant="h6" component="h2" color="primary">
          {product.name}
        </Typography>
        
        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating value={product.rating || 0} readOnly size="small" />
          <Typography variant="body2" color="text.secondary">
            ({product.reviews?.length || 0})
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {product.description}
        </Typography>

        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="p" color="primary.main">
            {typeof product.price === 'string' 
              ? product.price 
              : `${product.price.toFixed(2)} €`}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleAddToCart}
            sx={{ minWidth: 'auto' }}
          >
            Ajouter
          </Button>
        </Box>

        {product.isNew && (
          <Chip
            label="Nouveau"
            color="secondary"
            size="small"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
