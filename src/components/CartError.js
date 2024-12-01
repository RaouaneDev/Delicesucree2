import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { cartErrors } from '../utils/errorMessages';

const CartError = ({ error, open, onClose }) => {
  const getMessage = (errorType) => {
    return cartErrors[errorType] || cartErrors.updateError;
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
        {getMessage(error)}
      </Alert>
    </Snackbar>
  );
};

export default CartError;
