'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Card.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Card.init({
    title: DataTypes.STRING,
    caption: DataTypes.STRING,
    dueDate: DataTypes.DATE,
    status: DataTypes.ENUM('completed', 'uncompleted', 'skipped', 'archived', "in_progress"),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Card',
  });
  return Card;
};