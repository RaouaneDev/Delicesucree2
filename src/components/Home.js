import React from 'react';
import { Container, Typography, Grid, Paper, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const HeroBanner = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '70vh',
  color: '#fff',
  marginBottom: theme.spacing(4),
  backgroundImage: 'url(https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1920&q=80)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  textAlign: 'center',
  transition: '0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  }
}));

const CategoryCard = styled(Paper)(({ theme }) => ({
  position: 'relative',
  height: '300px',
  overflow: 'hidden',
  borderRadius: '16px',
  transition: 'transform 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  '&:hover .overlay': {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  }
}));

const categories = [
  {
    id: 1,
    name: 'Mariages',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80',
    description: 'Pièces montées et gâteaux de mariage sur mesure',
    path: 'mariages'
  },
  {
    id: 2,
    name: 'Anniversaires',
    image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=800&q=80',
    description: 'Gâteaux personnalisés pour tous les âges',
    path: 'anniversaires'
  },
  {
    id: 3,
    name: 'Événements d\'entreprise',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
    description: 'Buffets sucrés pour séminaires et réceptions',
    path: 'entreprise'
  },
  {
    id: 4,
    name: 'Fêtes religieuses',
    image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80',
    description: 'Pâtisseries traditionnelles pour vos célébrations',
    path: 'religieux'
  },
  {
    id: 5,
    name: 'Baby Shower',
    image: 'https://images.unsplash.com/photo-1517805686688-47dd930554b2?auto=format&fit=crop&w=800&q=80',
    description: 'Douceurs colorées pour accueillir bébé',
    path: 'babyshower'
  },
  {
    id: 6,
    name: 'Cocktails & Réceptions',
    image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=80',
    description: 'Mignardises et petits fours pour vos réceptions',
    path: 'cocktails'
  }
];

const Home = () => {
  return (
    <div>
      <HeroBanner>
        <Container sx={{ position: 'relative', textAlign: 'center' }}>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            Délices Sucrés
          </Typography>
          <Typography 
            variant="h5" 
            paragraph
            sx={{ 
              mb: 4,
              maxWidth: '800px',
              mx: 'auto',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            Découvrez nos pâtisseries artisanales confectionnées avec passion et des ingrédients soigneusement sélectionnés
          </Typography>
          <Button 
            component={Link}
            to="/products"
            variant="contained" 
            color="primary" 
            size="large"
            sx={{ 
              fontSize: '1.2rem',
              py: 1.5,
              px: 4,
              borderRadius: '30px'
            }}
          >
            Découvrir nos Pâtisseries
          </Button>
        </Container>
      </HeroBanner>

      <Container sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          Nos Spécialités
        </Typography>
        <Grid container spacing={4}>
          {categories.map((category) => (
            <Grid item key={category.id} xs={12} sm={6} md={4}>
              <CategoryCard>
                <Box
                  sx={{
                    position: 'relative',
                    height: '100%',
                    backgroundImage: `url(${category.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <Box
                    className="overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      transition: 'background-color 0.3s',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: 3,
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        mb: 1
                      }}
                    >
                      {category.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'white',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                        mb: 2
                      }}
                    >
                      {category.description}
                    </Typography>
                    <Button
                      component={Link}
                      to={`/category/${category.path}`}
                      variant="contained"
                      color="primary"
                      sx={{
                        mt: 'auto',
                        borderRadius: '20px',
                        textTransform: 'none',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        }
                      }}
                    >
                      Voir les produits
                    </Button>
                  </Box>
                </Box>
              </CategoryCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          Pourquoi Nous Choisir
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FeatureCard elevation={2}>
              <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Fait Maison
              </Typography>
              <Typography>
                Chaque jour, nos pâtissiers passionnés créent des merveilles sucrées avec des ingrédients frais et de qualité supérieure
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard elevation={2}>
              <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Livraison Soignée
              </Typography>
              <Typography>
                Nous livrons vos commandes dans un packaging spécialement conçu pour préserver la fraîcheur et la qualité de nos pâtisseries
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard elevation={2}>
              <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Sur Mesure
              </Typography>
              <Typography>
                Pour vos événements spéciaux, nous créons des pâtisseries personnalisées selon vos envies et vos goûts
              </Typography>
            </FeatureCard>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Home;
