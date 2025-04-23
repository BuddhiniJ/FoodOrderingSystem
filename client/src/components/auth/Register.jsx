import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { register } from '../../services/authService';
import { registerSchema } from '../../utils/validationSchemas';
import MainLayout from '../layout/MainLayout';

const Register = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = values;
      await register(userData);
      
      setSuccess('Registration successful!');
      resetForm();
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="auth-container">
        <div className="auth-form">
          <h2>Register</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <Formik
            initialValues={{
              name: '',
              email: '',
              phone: '',
              password: '',
              confirmPassword: '',
              role: 'customer'
            }}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <Field type="text" name="name" id="name" className="form-control" />
                  <ErrorMessage name="name" component="div" className="error-text" />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field type="email" name="email" id="email" className="form-control" />
                  <ErrorMessage name="email" component="div" className="error-text" />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <Field type="text" name="phone" id="phone" className="form-control" />
                  <ErrorMessage name="phone" component="div" className="error-text" />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Field type="password" name="password" id="password" className="form-control" />
                  <ErrorMessage name="password" component="div" className="error-text" />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className="form-control"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="error-text" />
                </div>

                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <Field as="select" name="role" id="role" className="form-control">
                    <option value="customer">Customer</option>
                    <option value="restaurant-admin">Restaurant Admin</option>
                    <option value="delivery-personnel">Delivery Personnel</option>
                  </Field>
                  <ErrorMessage name="role" component="div" className="error-text" />
                </div>

                <button type="submit" className="btn btn-primary" disabled={isSubmitting || loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </Form>
            )}
          </Formik>
          <div className="auth-links">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
