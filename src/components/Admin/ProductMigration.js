import React, { useState } from 'react';
import { Button, Container, Typography, Alert } from '@mui/material';
import { migrateProductsToFirestore } from '../../firebase/migrateProducts';

const ProductMigration = () => {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const handleMigration = async () => {
    try {
      setStatus('loading');
      await migrateProductsToFirestore();
      setStatus('success');
    } catch (err) {
      console.error('Erreur de migration:', err);
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Migration des Produits
      </Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleMigration}
        disabled={status === 'loading'}
        sx={{ mt: 2 }}
      >
        {status === 'loading' ? 'Migration en cours...' : 'Démarrer la Migration'}
      </Button>

      {status === 'success' && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Migration réussie ! Les produits ont été ajoutés à Firestore.
        </Alert>
      )}

      {status === 'error' && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Erreur lors de la migration : {error}
        </Alert>
      )}
    </Container>
  );
};

export default ProductMigration;
