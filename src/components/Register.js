import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, FieldArray, Form } from 'formik';
import { doc, setDoc, getDocs, collection, getDoc } from 'firebase/firestore';
import { auth, db } from '../database/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import ValidationSchema from '../schema/ValidationSchema';
import "../component styles/Register.css";
import "../component styles/RegisterMedia.css";
import UserDetails from './Register Details/UserDetails';
import MushKitDetails from './Register Details/MushKitDetails';
import Buttons from './Register Details/Buttons';
import MessageBox from '../static/MessageBox';
import usePreventBackNavigation from '../hooks/usePreventBackNavigation';

const Register = () => {
  usePreventBackNavigation(); 
  
  const navigate = useNavigate();  
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const togglePassword = () => setShowPassword(prev => !prev);

  const handleSubmit = async (values, actions) => {
    setIsSubmitting(true);
  
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const existingKitIds = [];
  
      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.mushkits && Array.isArray(userData.mushkits)) {
          userData.mushkits.forEach(kit => {
            if (kit.kit_id) {
              existingKitIds.push(kit.kit_id);
            }
          });
        }
      });
  
      let hasKitError = false;
  
      for (let index = 0; index < values.mushkits.length; index++) {
        const id = values.mushkits[index].kit_id.trim();
  
        if (existingKitIds.includes(id)) {
          actions.setFieldError(`mushkits[${index}].kit_id`, "MushKit ID# is already used.");
          hasKitError = true;
          continue;
        }
  
        const sensorDocRef = doc(db, "sensorData", id);
        const sensorDocSnap = await getDoc(sensorDocRef);
  
        if (!sensorDocSnap.exists()) {
          actions.setFieldError(`mushkits[${index}].kit_id`, "MushKit ID# is not yet available.");
          hasKitError = true;
        }
      }
  
      if (hasKitError) {
        setIsSubmitting(false);
        return;
      }
  
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
  
      const uid = userCredential.user.uid;
  
      await setDoc(doc(db, "users", uid), {
        owner: values.owner,
        contact: values.contact,
        affiliation: values.affiliation,
        email: values.email,
        password: values.password,
        pin: values.pin,
        mushkits: values.mushkits,
      });
  
      actions.resetForm();
      setShowSuccessMessage(true);
  
    } catch (error) {
      console.error("Registration error:", error);
  
      if (error.code === 'auth/email-already-in-use') {
        actions.setFieldError("email", "Email already in use. Please login or use a different email.");
      } else {
        alert("Registration failed: " + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
              humid_threshold: '',
            }
          ]
        }}
        validationSchema={ValidationSchema}
        onSubmit={handleSubmit}
      >
        {formik => {
          const lastIndex = formik.values.mushkits.length - 1;
          const lastKit = formik.values.mushkits[lastIndex];
          
          const isLastMushKitComplete =
            lastKit.kit_name.trim() !== '' &&
            lastKit.wifi_ssid.trim() !== '' &&
            lastKit.wifi_pass.trim() !== '' &&
            lastKit.humid_threshold.trim() !== '' &&
            !formik.errors.mushkits?.[lastIndex]?.kit_name &&
            !formik.errors.mushkits?.[lastIndex]?.wifi_ssid &&
            !formik.errors.mushkits?.[lastIndex]?.wifi_pass &&
            !formik.errors.mushkits?.[lastIndex]?.humid_threshold;
          
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
                          remove={remove}
                          mushkitCount={formik.values.mushkits.length}
                        />
                      ))}
                    </div>

                    <Buttons
                      onAddMushKit={() => {
                        if (isLastMushKitComplete) {
                          push({ kit_name: '', temp_threshold: '', humid_threshold: '' });
                        }
                      }}
                      canAdd={isLastMushKitComplete}
                      canSubmit={formik.isValid && formik.dirty}
                      isSubmitting={isSubmitting}
                    />
                  </>
                )}
              </FieldArray>
            </Form>
          );
        }}
      </Formik>

      {showSuccessMessage && (
        <MessageBox
          message="Registration successful!"
          onClose={() => {
            setShowSuccessMessage(false);
            navigate('/');
          }}
        />
      )}
    </div>
  );
};

export default Register;