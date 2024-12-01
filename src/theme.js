import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffd700', // Or
      contrastText: '#1a1a1a',
    },
    secondary: {
      main: '#ff69b4', // Rose
    },
    background: {
      default: '#1a1a1a',
      paper: '#2d2d2d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: [
      'Playfair Display',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: 'Playfair Display, serif',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          minHeight: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#1a1a1a',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#ffd700',
            borderRadius: '4px',
          },
        },
        '#root': {
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
      },
    },
  },
});
