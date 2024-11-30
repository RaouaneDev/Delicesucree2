import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

const PasswordProtection = ({ onSuccess, open, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  
  // Mot de passe codé en dur (dans un vrai projet, cela devrait être géré côté serveur)
  const ADMIN_PASSWORD = 'admin123';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setError(false);
      onSuccess();
      setPassword('');
    } else {
      setError(true);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LockIcon /> Accès Protégé
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Mot de passe incorrect
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Mot de passe"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained" color="primary">
            Accéder
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PasswordProtection;
