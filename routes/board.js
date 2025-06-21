const express = require('express');
const router = express.Router();
const boardController = require('../controllers/board');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Board routes
router.post('/', boardController.create);
router.get('/', boardController.getAll);
router.get('/:id', boardController.getOne);
router.patch('/:id', boardController.update);
router.delete('/:id', boardController.remove);

module.exports = router; 