import React from 'react';
import ClientForm from './ClientForm';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Stepper, Step, StepLabel, Typography } from '@mui/material';

const Checkout = () => {
  const navigate = useNavigate();

  const handleClientSubmit = (values) => {
    // Ici, vous pouvez :
    // 1. Sauvegarder les informations client
    console.log('Informations client:', values);
    // 2. Passer à l'étape suivante (paiement par exemple)
    // 3. Ou rediriger vers une autre page
    // navigate('/payment');
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mt: 4, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Finaliser votre commande
        </Typography>
        <Stepper activeStep={0} sx={{ pt: 3, pb: 5 }}>
          <Step>
            <StepLabel>Informations client</StepLabel>
          </Step>
          <Step>
            <StepLabel>Paiement</StepLabel>
          </Step>
          <Step>
            <StepLabel>Confirmation</StepLabel>
          </Step>
        </Stepper>
        
        <ClientForm onSubmit={handleClientSubmit} />
      </Paper>
    </Container>
  );
};

export default Checkout;
