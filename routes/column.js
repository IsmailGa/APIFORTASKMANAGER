const express = require('express');
const router = express.Router();
const columnController = require('../controllers/column');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Column routes
router.post('/', columnController.create);
router.get('/', columnController.getAll);
router.get('/:id', columnController.getOne);
router.patch('/:id', columnController.update);
router.delete('/:id', columnController.remove);
router.post('/reorder', columnController.reorder);

module.exports = router; 