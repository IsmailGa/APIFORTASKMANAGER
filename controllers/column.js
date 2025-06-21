const { Column, Card, Board } = require('../models');

exports.create = async (req, res) => {
  try {
    const { title, description, color, position, maxCards, settings, boardId } = req.body;
    
    // Verify board ownership
    const board = await Board.findOne({ where: { id: boardId, userId: req.user.id } });
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const column = await Column.create({
      title,
      description,
      color,
      position: position || 1,
      maxCards: maxCards || null,
      settings: settings || {},
      boardId
    });

    res.status(201).json(column);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { boardId } = req.query;
    
    if (!boardId) {
      return res.status(400).json({ message: 'Board ID is required' });
    }

    // Verify board ownership
    const board = await Board.findOne({ where: { id: boardId, userId: req.user.id } });
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const columns = await Column.findAll({
      where: { boardId },
      include: [
        {
          model: Card,
          as: 'cards',ч
          order: [['position', 'ASC']]
        }
      ],
      order: [['position', 'ASC']]
    });
    
    res.json(columns);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const column = await Column.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Board,
          where: { userId: req.user.id }
        },
        {
          model: Card,
          as: 'cards',
          order: [['position', 'ASC']]
        }
      ]
    });
    
    if (!column) return res.status(404).json({ message: 'Column not found' });
    res.json(column);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const column = await Column.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Board,
          where: { userId: req.user.id }
        }
      ]
    });
    
    if (!column) return res.status(404).json({ message: 'Column not found' });
    
    const updateFields = {};
    const allowedFields = ['title', 'description', 'color', 'position', 'maxCards', 'settings'];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    }
    
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }
    
    await column.update(updateFields);
    res.json(column);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const column = await Column.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Board,
          where: { userId: req.user.id }
        }
      ]
    });
    
    if (!column) return res.status(404).json({ message: 'Column not found' });
    
    await column.destroy();
    res.json({ message: 'Column deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.reorder = async (req, res) => {
  try {
    const { columns } = req.body;
    
    for (const columnData of columns) {
      await Column.update(
        { position: columnData.position },
        { 
          where: { 
            id: columnData.id,
            boardId: columnData.boardId 
          }
        }
      );
    }
    
    res.json({ message: 'Columns reordered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 