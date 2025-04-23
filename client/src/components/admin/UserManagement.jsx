import { useState, useEffect } from 'react';
import api from '../../services/api';
import MainLayout from '../layout/MainLayout';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users');
        setUsers(response.data.data);
      } catch (err) {
        setError('Failed to fetch users. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        setError('Failed to delete user. Please try again.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="admin-container">
          <h2>User Management</h2>
          <p>Loading users...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="admin-container">
        <h2>User Management</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="user-list">
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>                
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.role}</td>                  
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserManagement;
