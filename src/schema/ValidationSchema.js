import * as Yup from 'yup';

const ValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),

contact: Yup.string()
    .matches(/^09\d{9}$/, 'Invalid contact number.')
    .required('Contact number is required'),

  pin: Yup.string()
    .matches(/^\d{4}$/, 'PIN must be exactly 4 digits.')
    .required('PIN is required'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters.')
    .required('Password is required'),
});

export default ValidationSchema;
