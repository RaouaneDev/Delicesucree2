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
  MenuItem,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Grid,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { getAllProducts, updateProduct, deleteProduct, addProduct } from '../../firebase/productService';
import { getAllCategories } from '../../firebase/categoryService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminProducts = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  const defaultProduct = {
    name: '',
    price: '',
    description: '',
    image: '',
    ingredients: '',
    allergens: '',
    available: true,
    preparationTime: '24h',
    size: '',
    categoryId: '',
    categoryName: '',
    subcategoryId: '',
    subcategoryName: ''
  };

  const [formData, setFormData] = useState(defaultProduct);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadData();
  }, [isAdmin, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        getAllProducts(),
        getAllCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setError(null);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Erreur lors du chargement des données. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (product = null) => {
    if (product) {
      setEditProduct(product);
      setFormData({
        ...product,
        ingredients: Array.isArray(product.ingredients) ? product.ingredients.join(', ') : '',
        allergens: Array.isArray(product.allergens) ? product.allergens.join(', ') : '',
        price: typeof product.price === 'number' ? product.price.toString() : product.price
      });
      setSelectedCategory(categories.find(cat => cat.id === product.categoryId));
    } else {
      setEditProduct(null);
      setFormData(defaultProduct);
      setSelectedCategory('');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditProduct(null);
    setFormData(defaultProduct);
    setSelectedCategory('');
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'categoryId') {
      const category = categories.find(cat => cat.id === value);
      setSelectedCategory(category);
      setFormData(prev => ({
        ...prev,
        categoryId: category.id,
        categoryName: category.name,
        subcategoryId: '',
        subcategoryName: ''
      }));
    } else if (name === 'subcategoryId') {
      const subcategory = selectedCategory.subcategories.find(sub => sub.id === value);
      setFormData(prev => ({
        ...prev,
        subcategoryId: subcategory.id,
        subcategoryName: subcategory.name
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'price' ? value.replace(/[^0-9.]/g, '') : value
      }));
    }
  };

  const validateForm = () => {
    const requiredFields = [
      'name', 'price', 'description', 'image', 
      'categoryId', 'subcategoryId', 'size'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Le champ ${field} est requis`);
        return false;
      }
    }

    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      setError('Le prix doit être un nombre positif');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        ingredients: formData.ingredients ? formData.ingredients.split(',').map(i => i.trim()) : [],
        allergens: formData.allergens ? formData.allergens.split(',').map(a => a.trim()) : [],
      };

      if (editProduct) {
        await updateProduct(editProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      await loadData();
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError('Erreur lors de la sauvegarde. Veuillez réessayer.');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(productId);
        await loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError('Erreur lors de la suppression. Veuillez réessayer.');
      }
    }
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
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
          Gestion des Produits
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Ajouter un Produit
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Prix (€)</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Sous-catégorie</TableCell>
              <TableCell>Disponible</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{formatPrice(product.price)} €</TableCell>
                <TableCell>{product.categoryName}</TableCell>
                <TableCell>{product.subcategoryName}</TableCell>
                <TableCell>
                  <Chip 
                    label={product.available ? "Disponible" : "Indisponible"}
                    color={product.available ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(product)} color="primary" size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product.id)} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editProduct ? 'Modifier le Produit' : 'Ajouter un Produit'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Nom du produit"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Prix (€)"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                required
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="image"
                label="URL de l'image"
                value={formData.image}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  label="Catégorie"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required disabled={!selectedCategory}>
                <InputLabel>Sous-catégorie</InputLabel>
                <Select
                  name="subcategoryId"
                  value={formData.subcategoryId}
                  onChange={handleChange}
                  label="Sous-catégorie"
                >
                  {selectedCategory?.subcategories.map((subcategory) => (
                    <MenuItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="ingredients"
                label="Ingrédients (séparés par des virgules)"
                value={formData.ingredients}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="allergens"
                label="Allergènes (séparés par des virgules)"
                value={formData.allergens}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="size"
                label="Taille/Portion"
                value={formData.size}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="preparationTime"
                label="Temps de préparation"
                value={formData.preparationTime}
                onChange={handleChange}
                fullWidth
                select
              >
                <MenuItem value="24h">24 heures</MenuItem>
                <MenuItem value="48h">48 heures</MenuItem>
                <MenuItem value="72h">72 heures</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.available}
                    onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                    color="primary"
                  />
                }
                label="Produit disponible"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Annuler
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editProduct ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminProducts;
