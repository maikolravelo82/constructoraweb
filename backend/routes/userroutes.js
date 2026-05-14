const express = require('express');
const userController = require('../controllers/usercontroller');

const router = express.Router();


router.get('/', userController.getAllUsers);      // GET /api/users
router.get('/:id', userController.getUserById);  // GET /api/users/1
router.post('/', userController.createUser);     // POST /api/users
router.put('/:id', userController.updateUser);    // PUT /api/users/1
router.delete('/:id', userController.deleteUser); // DELETE /api/users/1

module.exports = router;