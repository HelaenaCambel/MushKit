import * as Yup from 'yup';
import "./ValidationSchema.css";

const ValidationSchema = Yup.object().shape({
  //UserDetails
  owner: Yup.string()
  .required('Owner name is required.'),

  contact: Yup.string()
    .matches(/^09\d{9}$/, 'Invalid contact number.')
    .required('Contact number is required'),

  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters.')
    .required('Password is required'),

  pin: Yup.string()
    .matches(/^\d{4}$/, 'PIN must be exactly 4 digits.')
    .required('PIN is required'),

  //MushKitDetails
  kit_name: Yup.string()
    .required('MushKit name is required. Example: MushKit 1'),

  wifi_ssid: Yup.string()
    .required('SSID is required.'),

  wifi_pass: Yup.string()
    .required('Password is required'),
});

export default ValidationSchema;
