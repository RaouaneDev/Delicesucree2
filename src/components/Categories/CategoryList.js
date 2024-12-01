import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  useTheme,
  CardActionArea,
  CircularProgress,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getAllCategories } from '../../firebase/categoryService';

const CategoryList = () => {
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getAllCategories();
        // Assurez-vous que les sous-catégories sont un tableau
        const formattedCategories = categoriesData.map(category => ({
          ...category,
          subcategories: Array.isArray(category.subcategories) 
            ? category.subcategories 
            : Object.values(category.subcategories || {})
        }));
        setCategories(formattedCategories);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        setError('Une erreur est survenue lors du chargement des catégories.');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <Container sx={{ 
        py: 8, 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        align="center" 
        color="primary"
        sx={{ 
          mb: 6,
          fontWeight: 'bold',
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 60,
            height: 3,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 1.5,
          }
        }}
      >
        Nos Catégories
      </Typography>
      
      <Grid container spacing={4}>
        {categories.map((category) => (
          <Grid item key={category.id} xs={12} sm={6} md={3}>
            <Card 
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: theme.shadows[2],
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardActionArea 
                component={Link} 
                to={`/category/${category.id}`}
                sx={{ flexGrow: 1 }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={category.image}
                  alt={category.name}
                  sx={{ 
                    objectFit: 'cover',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
                <CardContent>
                  <Typography 
                    gutterBottom 
                    variant="h5" 
                    component="h2" 
                    color="primary"
                    sx={{ 
                      fontWeight: 'bold',
                      mb: 2 
                    }}
                  >
                    {category.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    paragraph
                    sx={{ mb: 3 }}
                  >
                    {category.description}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1,
                    mt: 'auto' 
                  }}>
                    {category.subcategories && category.subcategories.map((sub) => (
                      <Chip
                        key={sub.id}
                        label={sub.name}
                        component={Link}
                        to={`/category/${category.id}/${sub.id}`}
                        clickable
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(233, 30, 99, 0.1)',
                          color: 'primary.main',
                          fontWeight: 500,
                          '&:hover': {
                            backgroundColor: 'rgba(233, 30, 99, 0.2)',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CategoryList;
