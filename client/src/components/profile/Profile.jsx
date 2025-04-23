import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import MainLayout from '../layout/MainLayout';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="profile-container">
        <div className="profile-header">
          <h2>My Profile</h2>
          <Link to="/profile/edit" className="btn btn-primary">
            Edit Profile
          </Link>
        </div>

        <div className="profile-details">
          <div className="profile-section">
            <h3>Personal Information</h3>
            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Name:</span>
                <span className="info-value">{user.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone:</span>
                <span className="info-value">{user.phone}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Role:</span>
                <span className="info-value">{user.role}</span>
              </div>
            </div>
          </div>

          {user.address && (
            <div className="profile-section">
              <h3>Address</h3>
              <div className="profile-info">
                <div className="info-item">
                  <span className="info-label">Street:</span>
                  <span className="info-value">{user.address.street}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">City:</span>
                  <span className="info-value">{user.address.city}</span>
                </div>               
                <div className="info-item">
                  <span className="info-label">Zip Code:</span>
                  <span className="info-value">{user.address.zipCode}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Country:</span>
                  <span className="info-value">{user.address.country}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
