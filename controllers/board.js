const { Board, Column, Card } = require('../models');

exports.create = async (req, res) => {
  try {
    const { title, description, color, isPublic, settings } = req.body;
    const board = await Board.create({
      title,
      description,
      color,
      isPublic: isPublic || false,
      settings: settings || {},
      userId: req.user.id
    });

    // Create default columns for the board
    const defaultColumns = [
      { title: 'To Do', position: 1, color: '#e2e8f0' },
      { title: 'In Progress', position: 2, color: '#fef3c7' },
      { title: 'Done', position: 3, color: '#d1fae5' }
    ];

    for (const columnData of defaultColumns) {
      await Column.create({
        ...columnData,
        boardId: board.id
      });
    }

    // Fetch the board with columns
    const boardWithColumns = await Board.findByPk(board.id, {
      include: [
        {
          model: Column,
          as: 'columns',
          include: [
            {
              model: Card,
              as: 'cards',
              order: [['position', 'ASC']]
            }
          ],
          order: [['position', 'ASC']]
        }
      ]
    });

    res.status(201).json(boardWithColumns);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const boards = await Board.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Column,
          as: 'columns',
          include: [
            {
              model: Card,
              as: 'cards',
              order: [['position', 'ASC']]
            }
          ],
          order: [['position', 'ASC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const board = await Board.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        {
          model: Column,
          as: 'columns',
          include: [
            {
              model: Card,
              as: 'cards',
              order: [['position', 'ASC']]
            }
          ],
          order: [['position', 'ASC']]
        }
      ]
    });
    
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const board = await Board.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!board) return res.status(404).json({ message: 'Board not found' });
    
    const updateFields = {};
    const allowedFields = ['title', 'description', 'color', 'isPublic', 'settings'];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    }
    
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }
    
    await board.update(updateFields);
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const board = await Board.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!board) return res.status(404).json({ message: 'Board not found' });
    
    await board.destroy();
    res.json({ message: 'Board deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 