import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Alert,
  IconButton
} from '@mui/material';
import {
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { loginUser, signInWithGoogle, signInWithFacebook, signInAsGuest } from '../../firebase/authService';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    try {
      setError('');
      setLoading(true);
      const user = await loginUser(email, password);
      setUser(user);
      navigate('/');
    } catch (error) {
      setError(error.message);
      console.error('Erreur de connexion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      const user = await signInWithGoogle();
      setUser(user);
      navigate('/');
    } catch (error) {
      setError('Échec de la connexion avec Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setError('');
      setLoading(true);
      const user = await signInWithFacebook();
      setUser(user);
      navigate('/');
    } catch (error) {
      setError('Échec de la connexion avec Facebook.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setError('');
      setLoading(true);
      const user = await signInAsGuest();
      if (user) {
        setUser(user);
        navigate('/');
      } else {
        throw new Error('Échec de la connexion anonyme');
      }
    } catch (error) {
      console.error('Erreur de connexion anonyme:', error);
      setError('Échec de la connexion en tant qu\'invité. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            Connexion
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleEmailLogin} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              error={!!error}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              error={!!error}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              Se connecter
            </Button>
          </Box>

          <Divider sx={{ width: '100%', my: 2 }}>ou</Divider>

          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              disabled={loading}
              sx={{ borderColor: '#DB4437', color: '#DB4437', '&:hover': { borderColor: '#DB4437', bgcolor: 'rgba(219, 68, 55, 0.04)' } }}
            >
              Continuer avec Google
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<FacebookIcon />}
              onClick={handleFacebookLogin}
              disabled={loading}
              sx={{ borderColor: '#4267B2', color: '#4267B2', '&:hover': { borderColor: '#4267B2', bgcolor: 'rgba(66, 103, 178, 0.04)' } }}
            >
              Continuer avec Facebook
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<PersonIcon />}
              onClick={handleGuestLogin}
              disabled={loading}
              sx={{ borderColor: 'grey.500', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } }}
            >
              Continuer en tant qu'invité
            </Button>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Link to="/reset-password" style={{ textDecoration: 'none' }}>
              <Typography color="primary" variant="body2">
                Mot de passe oublié ?
              </Typography>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography color="primary" variant="body2">
                Pas encore de compte ? S'inscrire
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
