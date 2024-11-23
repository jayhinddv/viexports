import bcrypt from 'bcryptjs';
export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Please provide a valid email address.",
          },
        },
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          is: {
            args: /^[6-9]\d{9}$/,
            msg: "Please provide a valid Indian mobile number.",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "user"),
        defaultValue: "user",
      },
    },
    {
      timestamps: true, // Enable createdAt and updatedAt
      paranoid: true, // Enable soft deletion
    }
  );

  // Define associations
  User.associate = (models) => {
    User.hasMany(models.Tender, {
      foreignKey: "created_by",
      as: "createdTenders",
    });

    User.hasMany(models.Bid, {
      foreignKey: "user_id",
      as: "bids",
    });
  };

  // Hash password before saving
  User.beforeCreate(async (user) => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  User.beforeUpdate(async (user) => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  return User;
};
