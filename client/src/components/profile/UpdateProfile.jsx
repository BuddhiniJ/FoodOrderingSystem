import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { updateProfile } from '../../services/authService';
import { profileSchema } from '../../utils/validationSchemas';
import { AuthContext } from '../../context/AuthContext';
import MainLayout from '../layout/MainLayout';

const UpdateProfile = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser } = useContext(AuthContext);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError('');
      const response = await updateProfile(values);
      updateUser(response.data);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // Prepare initial values
  const initialValues = {
    name: user.name || '',
    phone: user.phone || '',
    address: {
      street: user.address?.street || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      zipCode: user.address?.zipCode || '',
      country: user.address?.country || ''
    }
  };

  return (
    <MainLayout>
      <div className="update-profile-container">
        <h2>Update Profile</h2>
        {error && <div className="error-message">{error}</div>}
        <Formik
          initialValues={initialValues}
          validationSchema={profileSchema}
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
                <label htmlFor="phone">Phone Number</label>
                <Field type="text" name="phone" id="phone" className="form-control" />
                <ErrorMessage name="phone" component="div" className="error-text" />
              </div>

              <div className="address-section">
                <h3>Address</h3>
                <div className="form-group">
                  <label htmlFor="address.street">Street</label>
                  <Field type="text" name="address.street" id="address.street" className="form-control" />
                  <ErrorMessage name="address.street" component="div" className="error-text" />
                </div>

                <div className="form-group">
                  <label htmlFor="address.city">City</label>
                  <Field type="text" name="address.city" id="address.city" className="form-control" />
                  <ErrorMessage name="address.city" component="div" className="error-text" />
                </div>               

                <div className="form-group">
                  <label htmlFor="address.zipCode">Zip Code</label>
                  <Field type="text" name="address.zipCode" id="address.zipCode" className="form-control" />
                  <ErrorMessage name="address.zipCode" component="div" className="error-text" />
                </div>

                <div className="form-group">
                  <label htmlFor="address.country">Country</label>
                  <Field type="text" name="address.country" id="address.country" className="form-control" />
                  <ErrorMessage name="address.country" component="div" className="error-text" />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={isSubmitting || loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/profile')}
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </MainLayout>
  );
};

export default UpdateProfile;
