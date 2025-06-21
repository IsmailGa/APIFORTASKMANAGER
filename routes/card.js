const express = require('express');
const router = express.Router();
const cardController = require('../controllers/card');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/', cardController.create);
router.get('/', cardController.getAll);
router.get('/:id', cardController.getOne);
router.patch('/:id', cardController.update);
router.delete('/:id', cardController.remove);
router.post('/move', cardController.move);
router.post('/reorder', cardController.reorder);

module.exports = router; 