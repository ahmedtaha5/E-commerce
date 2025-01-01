const express = require('express');

const router = express.Router();

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserDataValidator
} = require('../utils/validators/userValidator');

const { protect, allowedTo } = require('../Controllers/authControllers');

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUser,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData
} = require('../Controllers/userControllers');

router.use(protect);

router.get('/getMe', getLoggedUser, getUser);
router.put('/changeMyPassword', updateLoggedUserPassword);
router.put('/updateMe', updateLoggedUserDataValidator, updateLoggedUserData);
router.delete('/deleteMe', deleteLoggedUserData);

router.patch(
  '/changePassword/:id',
  changeUserPasswordValidator,
  changeUserPassword
);

router.use(protect, allowedTo('admin'));

router
  .route('/')
  .get(getAllUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);

router
  .route('/:id')
  .get(getUserValidator, getUser)
  .patch(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
