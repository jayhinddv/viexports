export default (sequelize, DataTypes) => {
    const Bid = sequelize.define("Bid", {
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: true,
          min: 0, // Bid must be non-negative
        },
      },
      description: {
        type: DataTypes.TEXT,
      },
      is_last_minute_bid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    });
  
    Bid.associate = (models) => {
      Bid.belongsTo(models.Tender, { foreignKey: "tender_id" });
      Bid.belongsTo(models.User, { foreignKey: "user_id" });
    };
  
    return Bid;
  };
  