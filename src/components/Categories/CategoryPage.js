import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Breadcrumbs,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { getProductsByCategory } from '../../firebase/productService';
import ProductCard from '../Products/ProductCard';
import { getCategoryById } from '../../firebase/categoryService';

const CategoryPage = () => {
  const { categoryId, subcategoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategoryAndProducts = async () => {
      try {
        setLoading(true);
        // Charger la catégorie
        const categoryData = await getCategoryById(categoryId);
        if (!categoryData) {
          setError('Catégorie non trouvée');
          return;
        }
        setCategory(categoryData);

        // Charger les produits
        const productsData = await getProductsByCategory(categoryId, subcategoryId);
        setProducts(productsData);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError('Une erreur est survenue lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };

    loadCategoryAndProducts();
  }, [categoryId, subcategoryId]);

  if (loading) {
    return (
      <Container sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !category) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error || 'Catégorie non trouvée'}</Alert>
      </Container>
    );
  }

  const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);

  return (
    <Container sx={{ py: 8 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 4 }}
      >
        <Link to="/categories" style={{ 
          textDecoration: 'none', 
          color: 'inherit',
          '&:hover': { textDecoration: 'underline' }
        }}>
          Catégories
        </Link>
        <Typography color="text.primary">{category.name}</Typography>
        {subcategory && (
          <Typography color="text.primary">{subcategory.name}</Typography>
        )}
      </Breadcrumbs>

      {/* Category Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          color="primary"
          sx={{ 
            fontWeight: 'bold',
            mb: 2
          }}
        >
          {subcategory ? subcategory.name : category.name}
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          {subcategory ? subcategory.description : category.description}
        </Typography>

        {/* Subcategories chips */}
        {!subcategoryId && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
            {category.subcategories.map((sub) => (
              <Chip
                key={sub.id}
                label={sub.name}
                component={Link}
                to={`/category/${category.id}/${sub.id}`}
                clickable
                color="primary"
                variant={subcategoryId === sub.id ? "filled" : "outlined"}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(233, 30, 99, 0.1)',
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Products Grid */}
      {products.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          Aucun produit trouvé dans cette catégorie.
        </Alert>
      ) : (
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default CategoryPage;
