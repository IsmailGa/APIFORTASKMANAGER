const { Card } = require('../models');

exports.create = async (req, res) => {
  try {
    const { title, caption, dueDate, status } = req.body;
    if (dueDate && isNaN(Date.parse(dueDate))) {
      return res.status(400).json({ message: 'Invalid dueDate format' });
    }
    const card = await Card.create({
      title,
      caption,
      dueDate,
      status,
      userId: req.user.id
    });
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const cards = await Card.findAll({ where: { userId: req.user.id } });
    
    if(cards.length === 0) {
      return res.status(404).json({ message: 'No cards found' });
    }
    
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const card = await Card.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!card) return res.status(404).json({ message: 'Card not found' });
    res.json(card);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const card = await Card.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!card) return res.status(404).json({ message: 'Card not found' });
    const updateFields = {};
    const allowedFields = ['title', 'caption', 'dueDate', 'status'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === 'dueDate' && req.body.dueDate && isNaN(Date.parse(req.body.dueDate))) {
          return res.status(400).json({ message: 'Invalid dueDate format' });
        }
        updateFields[field] = req.body[field];
      }
    }
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }
    await card.update(updateFields);
    res.json(card);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const card = await Card.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!card) return res.status(404).json({ message: 'Card not found' });
    await card.destroy();
    res.json({ message: 'Card deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 