const express = require('express');
const { 
  getUsers, 
  getUser, 
  createUser, 
  updateUser, 
  deleteUser,
  updateProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

// Route for all authenticated users
router.put('/profile', protect, updateProfile);

// Routes for admin only - apply middleware to these routes only
router.use(protect);
router.use(authorize('restaurant-admin', 'delivery-personnel'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
