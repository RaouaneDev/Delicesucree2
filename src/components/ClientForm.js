import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { formErrors } from '../utils/errorMessages';
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Grid,
} from '@mui/material';

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required(formErrors.required.firstName)
    .min(2, formErrors.length.tooShort.firstName)
    .max(50, formErrors.length.tooLong.firstName)
    .matches(/^[A-Za-zÀ-ÿ\s-]+$/, formErrors.invalid.firstName),
  lastName: Yup.string()
    .required(formErrors.required.lastName)
    .min(2, formErrors.length.tooShort.lastName)
    .max(50, formErrors.length.tooLong.lastName)
    .matches(/^[A-Za-zÀ-ÿ\s-]+$/, formErrors.invalid.lastName),
  email: Yup.string()
    .required(formErrors.required.email)
    .email(formErrors.invalid.email)
    .max(100, formErrors.length.tooLong.email),
  phone: Yup.string()
    .required(formErrors.required.phone)
    .matches(/^[0-9]+$/, formErrors.invalid.phone)
    .length(10, formErrors.invalid.phone)
    .matches(/^(0[1-9])[0-9]{8}$/, formErrors.invalid.phone),
  address: Yup.string()
    .required(formErrors.required.address)
    .min(5, formErrors.length.tooShort.address)
    .max(200, formErrors.length.tooLong.address)
    .matches(/^[A-Za-zÀ-ÿ0-9\s,.-]+$/, formErrors.invalid.address),
  postalCode: Yup.string()
    .required(formErrors.required.postalCode)
    .matches(/^[0-9]+$/, formErrors.invalid.postalCode)
    .length(5, formErrors.invalid.postalCode),
  city: Yup.string()
    .required(formErrors.required.city)
    .min(2, formErrors.length.tooShort.city)
    .max(50, formErrors.length.tooLong.city)
    .matches(/^[A-Za-zÀ-ÿ\s-]+$/, formErrors.invalid.city),
});

const ClientForm = ({ onSubmit }) => {
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Informations Client
        </Typography>
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            onSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field
                    name="firstName"
                    as={TextField}
                    fullWidth
                    label="Prénom"
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    name="lastName"
                    as={TextField}
                    fullWidth
                    label="Nom"
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="email"
                    as={TextField}
                    fullWidth
                    label="Email"
                    type="email"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="phone"
                    as={TextField}
                    fullWidth
                    label="Téléphone"
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="address"
                    as={TextField}
                    fullWidth
                    label="Adresse"
                    multiline
                    rows={2}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    name="postalCode"
                    as={TextField}
                    fullWidth
                    label="Code Postal"
                    error={touched.postalCode && Boolean(errors.postalCode)}
                    helperText={touched.postalCode && errors.postalCode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    name="city"
                    as={TextField}
                    fullWidth
                    label="Ville"
                    error={touched.city && Boolean(errors.city)}
                    helperText={touched.city && errors.city}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{ mt: 2 }}
                  >
                    Valider
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default ClientForm;
