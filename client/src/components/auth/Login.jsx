import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { login } from '../../services/authService';
import { loginSchema } from '../../utils/validationSchemas';
import { AuthContext } from '../../context/AuthContext';
import MainLayout from '../layout/MainLayout';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  // filepath: e:\MyProjects\FoodOrderingSystem\client\src\components\auth\Login.jsx
const handleSubmit = async (values) => {
  try {
    setLoading(true);
    setError("");
    const response = await login(values);
    setUser(response.user);

    // Redirect based on user role
    if (response.user.role === "delivery-personnel") {
      navigate("/delivery");
    } else {
      navigate("/");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Login failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <MainLayout>
      <div className="auth-container">
        <div className="auth-form">
          <h2>Login</h2>
          {error && <div className="error-message">{error}</div>}
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field type="email" name="email" id="email" className="form-control" />
                  <ErrorMessage name="email" component="div" className="error-text" />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Field type="password" name="password" id="password" className="form-control" />
                  <ErrorMessage name="password" component="div" className="error-text" />
                </div>

                <button type="submit" className="btn btn-primary" disabled={isSubmitting || loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </Form>
            )}
          </Formik>
          <div className="auth-links">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
