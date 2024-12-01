import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from '@mui/material';

const deliveryValidationSchema = Yup.object({
  deliveryType: Yup.string()
    .required('Veuillez choisir un mode de livraison')
    .oneOf(['standard', 'express'], 'Mode de livraison invalide'),
  
  deliveryAddress: Yup.object().shape({
    street: Yup.string()
      .required('L\'adresse est obligatoire')
      .min(5, 'L\'adresse est trop courte')
      .matches(/^[A-Za-zÀ-ÿ0-9\s,.-]+$/, 'Adresse invalide'),
    
    complement: Yup.string()
      .matches(/^[A-Za-zÀ-ÿ0-9\s,.-]*$/, 'Complément d\'adresse invalide'),
    
    postalCode: Yup.string()
      .required('Le code postal est obligatoire')
      .matches(/^[0-9]{5}$/, 'Code postal invalide (5 chiffres)'),
    
    city: Yup.string()
      .required('La ville est obligatoire')
      .min(2, 'Nom de ville trop court')
      .matches(/^[A-Za-zÀ-ÿ\s-]+$/, 'Nom de ville invalide'),
    
    instructions: Yup.string()
      .max(200, 'Instructions trop longues (max 200 caractères)')
      .matches(/^[A-Za-zÀ-ÿ0-9\s,.-]*$/, 'Instructions invalides')
  }),
  
  deliveryTime: Yup.object().shape({
    date: Yup.date()
      .required('Date de livraison obligatoire')
      .min(new Date(), 'La date doit être future'),
    
    timeSlot: Yup.string()
      .required('Créneau horaire obligatoire')
      .oneOf(['morning', 'afternoon', 'evening'], 'Créneau horaire invalide')
  })
});

const DeliveryForm = ({ onSubmit, initialValues }) => {
  const defaultValues = {
    deliveryType: 'standard',
    deliveryAddress: {
      street: '',
      complement: '',
      postalCode: '',
      city: '',
      instructions: ''
    },
    deliveryTime: {
      date: new Date(),
      timeSlot: 'morning'
    }
  };

  return (
    <Formik
      initialValues={initialValues || defaultValues}
      validationSchema={deliveryValidationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ errors, touched, values }) => (
        <Form>
          <Box sx={{ mt: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Informations de livraison
            </Typography>

            <Grid container spacing={3}>
              {/* Type de livraison */}
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Mode de livraison</FormLabel>
                  <Field name="deliveryType">
                    {({ field }) => (
                      <RadioGroup {...field} row>
                        <FormControlLabel
                          value="standard"
                          control={<Radio />}
                          label="Standard (2-3 jours)"
                        />
                        <FormControlLabel
                          value="express"
                          control={<Radio />}
                          label="Express (24h)"
                        />
                      </RadioGroup>
                    )}
                  </Field>
                </FormControl>
              </Grid>

              {/* Adresse */}
              <Grid item xs={12}>
                <Field
                  name="deliveryAddress.street"
                  as={TextField}
                  fullWidth
                  label="Adresse"
                  error={touched.deliveryAddress?.street && errors.deliveryAddress?.street}
                  helperText={touched.deliveryAddress?.street && errors.deliveryAddress?.street}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  name="deliveryAddress.complement"
                  as={TextField}
                  fullWidth
                  label="Complément d'adresse (optionnel)"
                  error={touched.deliveryAddress?.complement && errors.deliveryAddress?.complement}
                  helperText={touched.deliveryAddress?.complement && errors.deliveryAddress?.complement}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="deliveryAddress.postalCode"
                  as={TextField}
                  fullWidth
                  label="Code postal"
                  error={touched.deliveryAddress?.postalCode && errors.deliveryAddress?.postalCode}
                  helperText={touched.deliveryAddress?.postalCode && errors.deliveryAddress?.postalCode}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="deliveryAddress.city"
                  as={TextField}
                  fullWidth
                  label="Ville"
                  error={touched.deliveryAddress?.city && errors.deliveryAddress?.city}
                  helperText={touched.deliveryAddress?.city && errors.deliveryAddress?.city}
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  name="deliveryAddress.instructions"
                  as={TextField}
                  fullWidth
                  multiline
                  rows={3}
                  label="Instructions de livraison (optionnel)"
                  error={touched.deliveryAddress?.instructions && errors.deliveryAddress?.instructions}
                  helperText={touched.deliveryAddress?.instructions && errors.deliveryAddress?.instructions}
                />
              </Grid>

              {/* Date et créneau */}
              <Grid item xs={12} sm={6}>
                <Field
                  name="deliveryTime.date"
                  as={TextField}
                  fullWidth
                  type="date"
                  label="Date de livraison"
                  InputLabelProps={{ shrink: true }}
                  error={touched.deliveryTime?.date && errors.deliveryTime?.date}
                  helperText={touched.deliveryTime?.date && errors.deliveryTime?.date}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={touched.deliveryTime?.timeSlot && errors.deliveryTime?.timeSlot}>
                  <FormLabel>Créneau horaire</FormLabel>
                  <Field name="deliveryTime.timeSlot">
                    {({ field }) => (
                      <RadioGroup {...field} row>
                        <FormControlLabel
                          value="morning"
                          control={<Radio />}
                          label="Matin (8h-12h)"
                        />
                        <FormControlLabel
                          value="afternoon"
                          control={<Radio />}
                          label="Après-midi (14h-18h)"
                        />
                        <FormControlLabel
                          value="evening"
                          control={<Radio />}
                          label="Soir (18h-21h)"
                        />
                      </RadioGroup>
                    )}
                  </Field>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Valider la livraison
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default DeliveryForm;
