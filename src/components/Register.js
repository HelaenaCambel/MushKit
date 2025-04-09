import React, { useState } from 'react';
import { Formik, FieldArray, Form } from 'formik';
import ValidationSchema from '../schema/ValidationSchema';
import "../component styles/Register.css";
import UserDetails from './Register Details/UserDetails';
import MushKitDetails from './Register Details/MushKitDetails';
import Buttons from './Register Details/Buttons';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showWifiPassword, setShowWifiPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleWifiPassword = () => setShowWifiPassword((prev) => !prev);

  return (
    <div>
      <div className="register-header">
        <h1>MushKit Register</h1>
        <div className="login-text">
          <p>
            Already have an account?{" "}
            <a href="/">
              <button className="login-button">Login here</button>
            </a>
          </p>
        </div>
      </div>

      <Formik
        initialValues={{
          owner: '',
          contact: '',
          affiliation: '',
          email: '',
          password: '',
          pin: '',
          mushkits: [
            {
              kit_name: '',
              wifi_ssid: '',
              wifi_pass: '',
            }
          ]
        }}
        validationSchema={ValidationSchema}
        onSubmit={(values) => {
          console.log('Submitted values:', values);
        }}
      >
        {formik => {
          const firstKit = formik.values.mushkits[0];
          const isFirstMushKitComplete =
            firstKit.kit_name.trim() !== '' &&
            firstKit.wifi_ssid.trim() !== '' &&
            firstKit.wifi_pass.trim() !== '' &&
            !formik.errors.mushkits?.[0]?.kit_name &&
            !formik.errors.mushkits?.[0]?.wifi_ssid &&
            !formik.errors.mushkits?.[0]?.wifi_pass;

          return (
            <Form className='register-form'>
              <div className="details-section-user">
                <div className="section-title">User Details</div>
                <UserDetails
                  formik={formik}
                  showPassword={showPassword}
                  togglePassword={togglePassword}
                />
              </div>

              <FieldArray name="mushkits">
                {({ push, remove }) => (
                  <>
                    <div className="details-section-mushkit">
                      <div className="section-title">MushKit Details</div>
                      {formik.values.mushkits.map((_, index) => (
                        <MushKitDetails
                          key={index}
                          index={index}
                          formik={formik}
                          showWifiPassword={showWifiPassword}
                          toggleWifiPassword={toggleWifiPassword}
                        />
                      ))}
                    </div>

                    <Buttons
                      onAddMushKit={() => {
                        if (isFirstMushKitComplete) {
                          push({ kit_name: '', wifi_ssid: '', wifi_pass: '' });
                        }
                      }}
                      onRemoveMushKit={() => {
                        if (formik.values.mushkits.length > 1) {
                          remove(formik.values.mushkits.length - 1);
                        }
                      }}
                      canRemove={formik.values.mushkits.length > 1}
                      canAdd={isFirstMushKitComplete}
                      canSubmit={formik.isValid && formik.dirty}
                      onSubmit={formik.handleSubmit}
                    />
                  </>
                )}
              </FieldArray>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Register;
