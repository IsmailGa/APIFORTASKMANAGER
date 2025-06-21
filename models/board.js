'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Board extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Board.belongsTo(models.User, { foreignKey: 'userId' });
      Board.hasMany(models.Column, { foreignKey: 'boardId', as: 'columns' });
      Board.hasMany(models.Card, { foreignKey: 'boardId', as: 'cards' });
    }
  }
  Board.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    color: DataTypes.STRING,
    isPublic: DataTypes.BOOLEAN,
    settings: DataTypes.JSON,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Board',
  });
  return Board;
}; 