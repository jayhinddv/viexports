import {tokenTypes} from '../config/tokens.js';

export default (sequelize, DataTypes) => {
  const token = sequelize.define('Token', {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      index: true,
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(tokenTypes.REFRESH),
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    blacklisted: {
      type: DataTypes.BOOLEAN,
    },
  });

  return token;
};
