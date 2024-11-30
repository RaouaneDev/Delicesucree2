import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Button, 
  CardActions,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box
} from '@mui/material';
import { useCart } from '../context/CartContext';

// Produits par catégorie
const categoryProducts = {
  mariages: [
    {
      id: 101,
      name: 'Pièce montée Traditionnelle',
      price: '149.00€',
      description: 'Pièce montée en choux garnis de crème pâtissière vanille, décorée de caramel et fleurs en sucre',
      image: 'https://images.unsplash.com/photo-1546198632-9ef6368bef12?auto=format&fit=crop&w=800&q=80',
      category: 'mariages'
    },
    {
      id: 102,
      name: 'Wedding Cake Élégance',
      price: '299.00€',
      description: 'Gâteau à trois étages recouvert de pâte à sucre, décoré de dentelle et de fleurs fraîches',
      image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80',
      category: 'mariages'
    }
  ],
  anniversaires: [
    {
      id: 201,
      name: 'Gâteau Personnalisé',
      price: '45.00€',
      description: 'Gâteau sur mesure avec décoration personnalisée selon vos souhaits',
      image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=800&q=80',
      category: 'anniversaires'
    },
    {
      id: 202,
      name: 'Number Cake',
      price: '39.00€',
      description: 'Gâteau en forme de chiffre garni de crème et de fruits frais',
      image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=800&q=80',
      category: 'anniversaires'
    }
  ],
  entreprise: [
    {
      id: 301,
      name: 'Plateau Mignardises',
      price: '89.00€',
      description: 'Assortiment de 50 pièces de mignardises variées pour vos événements professionnels',
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
      category: 'entreprise'
    },
    {
      id: 302,
      name: 'Petits Fours Salés-Sucrés',
      price: '75.00€',
      description: 'Plateau de 40 pièces mêlant petits fours sucrés et salés',
      image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=80',
      category: 'entreprise'
    }
  ],
  religieux: [
    {
      id: 401,
      name: 'Gâteau de Communion',
      price: '59.00€',
      description: 'Gâteau décoré pour communion avec symboles religieux en sucre',
      image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80',
      category: 'religieux'
    }
  ],
  babyshower: [
    {
      id: 501,
      name: 'Gender Reveal Cake',
      price: '49.00€',
      description: 'Gâteau surprise avec intérieur coloré rose ou bleu',
      image: 'https://images.unsplash.com/photo-1517805686688-47dd930554b2?auto=format&fit=crop&w=800&q=80',
      category: 'babyshower'
    }
  ],
  cocktails: [
    {
      id: 601,
      name: 'Plateau Cocktail Prestige',
      price: '120.00€',
      description: 'Assortiment de 60 pièces cocktail haut de gamme',
      image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=80',
      category: 'cocktails'
    }
  ]
};

const categoryTitles = {
  mariages: 'Gâteaux de Mariage',
  anniversaires: 'Gâteaux d\'Anniversaire',
  entreprise: 'Événements d\'Entreprise',
  religieux: 'Célébrations Religieuses',
  babyshower: 'Baby Shower',
  cocktails: 'Cocktails & Réceptions'
};

// Suggestions de messages par catégorie
const messageSuggestions = {
  mariages: [
    "Félicitations aux mariés !",
    "Pour votre plus beau jour",
    "[Prénoms des mariés] - [Date du mariage]",
    "Unis pour la vie"
  ],
  anniversaires: [
    "Joyeux Anniversaire [Prénom] !",
    "Bon Anniversaire !",
    "[Age] ans, ça se fête !",
    "Meilleurs vœux pour tes [Age] ans"
  ],
  entreprise: [
    "Félicitations à toute l'équipe",
    "Merci pour votre excellent travail",
    "Joyeuse fête d'entreprise",
    "Bon succès !"
  ],
  religieux: [
    "Félicitations pour ta communion",
    "En ce jour béni",
    "Meilleurs vœux pour ta confirmation",
    "Joyeuse célébration"
  ],
  babyshower: [
    "Bienvenue bébé !",
    "Pour le plus beau des bébés",
    "Félicitations aux futurs parents",
    "Une nouvelle étoile est née"
  ],
  cocktails: [
    "Cocktail [Nom de l'événement]",
    "Joyeuse réception",
    "Belle soirée à tous",
    "Célébrons ensemble"
  ]
};

const CategoryProducts = () => {
  const { category } = useParams();
  const { addItem } = useCart();
  const products = categoryProducts[category] || [];
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customMessage, setCustomMessage] = useState('');
  const suggestions = messageSuggestions[category] || [];

  const handleOpenDialog = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
    setCustomMessage('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    setCustomMessage('');
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      const personalizedProduct = {
        ...selectedProduct,
        customMessage: customMessage.trim() || null,
        quantity: 1
      };
      addItem(personalizedProduct);
      handleCloseDialog();
    }
  };

  const handleDirectAddToCart = (product) => {
    addItem({
      ...product,
      customMessage: null,
      quantity: 1
    });
  };

  const handleSuggestionClick = (suggestion) => {
    setCustomMessage(suggestion);
  };

  if (products.length === 0) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Catégorie non trouvée
        </Typography>
        <Button variant="contained" color="primary" href="/">
          Retour à l'accueil
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 6 }}>
        {categoryTitles[category]}
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
              <CardActions sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
                <Button 
                  size="large" 
                  color="primary" 
                  variant="contained" 
                  fullWidth
                  onClick={() => handleDirectAddToCart(product)}
                >
                  Ajouter au panier
                </Button>
                <Button 
                  size="large" 
                  color="secondary" 
                  variant="outlined" 
                  fullWidth
                  onClick={() => handleOpenDialog(product)}
                >
                  Personnaliser
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Personnalisez votre {selectedProduct?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Votre message personnalisé"
              multiline
              rows={3}
              fullWidth
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Exemple: Joyeux Anniversaire Marie!"
              helperText="Ajoutez votre message personnalisé qui sera inscrit sur le gâteau"
            />
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Suggestions de messages :
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1,
              mt: 1 
            }}>
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  size="small"
                  onClick={() => handleSuggestionClick(suggestion)}
                  sx={{ 
                    borderRadius: '20px',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 64, 129, 0.08)'
                    }
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </Box>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Prix: {selectedProduct?.price}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Annuler
          </Button>
          <Button 
            onClick={handleAddToCart} 
            color="primary" 
            variant="contained"
          >
            Ajouter au panier
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CategoryProducts;
