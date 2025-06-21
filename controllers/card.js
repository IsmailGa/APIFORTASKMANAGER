const { Card, Board, Column } = require('../models');

exports.create = async (req, res) => {
  try {
    const { title, caption, dueDate, status, priority, position, labels, assignees, attachments, boardId, columnId } = req.body;
    
    if (dueDate && isNaN(Date.parse(dueDate))) {
      return res.status(400).json({ message: 'Invalid dueDate format' });
    }

    // Verify board ownership
    if (boardId) {
      const board = await Board.findOne({ where: { id: boardId, userId: req.user.id } });
      if (!board) {
        return res.status(404).json({ message: 'Board not found' });
      }
    }

    const card = await Card.create({
      title,
      caption,
      dueDate,
      status: status || 'uncompleted',
      priority: priority || 'medium',
      position: position || 1,
      labels: labels || [],
      assignees: assignees || [],
      attachments: attachments || [],
      userId: req.user.id,
      boardId,
      columnId
    });
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { boardId, columnId } = req.query;
    const whereClause = { userId: req.user.id };
    
    if (boardId) whereClause.boardId = boardId;
    if (columnId) whereClause.columnId = columnId;
    
    const cards = await Card.findAll({ 
      where: whereClause,
      include: [
        {
          model: Board,
          attributes: ['id', 'title', 'color']
        },
        {
          model: Column,
          attributes: ['id', 'title', 'color']
        }
      ],
      order: [['position', 'ASC'], ['createdAt', 'DESC']]
    });
    
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const card = await Card.findOne({ 
      where: { id: req.params.id, userId: req.user.id },
      include: [
        {
          model: Board,
          attributes: ['id', 'title', 'color']
        },
        {
          model: Column,
          attributes: ['id', 'title', 'color']
        }
      ]
    });
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
    const allowedFields = ['title', 'caption', 'dueDate', 'status', 'priority', 'position', 'labels', 'assignees', 'attachments', 'boardId', 'columnId'];
    
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

exports.move = async (req, res) => {
  try {
    const { cardId, sourceColumnId, targetColumnId, newPosition } = req.body;
    
    const card = await Card.findOne({ where: { id: cardId, userId: req.user.id } });
    if (!card) return res.status(404).json({ message: 'Card not found' });
    
    // Update card position and column
    await card.update({
      columnId: targetColumnId,
      position: newPosition
    });
    
    // Reorder other cards in the source column
    if (sourceColumnId !== targetColumnId) {
      const sourceCards = await Card.findAll({
        where: { columnId: sourceColumnId, userId: req.user.id },
        order: [['position', 'ASC']]
      });
      
      for (let i = 0; i < sourceCards.length; i++) {
        await sourceCards[i].update({ position: i + 1 });
      }
    }
    
    // Reorder other cards in the target column
    const targetCards = await Card.findAll({
      where: { columnId: targetColumnId, userId: req.user.id },
      order: [['position', 'ASC']]
    });
    
    for (let i = 0; i < targetCards.length; i++) {
      if (targetCards[i].id !== cardId) {
        await targetCards[i].update({ position: i + 1 });
      }
    }
    
    res.json({ message: 'Card moved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.reorder = async (req, res) => {
  try {
    const { cards } = req.body;
    
    for (const cardData of cards) {
      await Card.update(
        { position: cardData.position },
        { 
          where: { 
            id: cardData.id,
            userId: req.user.id 
          }
        }
      );
    }
    
    res.json({ message: 'Cards reordered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 