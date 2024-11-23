export default (sequelize, DataTypes) => {
  const Tender = sequelize.define("Tender", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 100],
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterStart(value) {
          if (value <= this.start_time) {
            throw new Error(
              `End time (${value}) must be after start time (${this.start_time}).`
            );
          }
        },
      },
    },
    buffer_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM("open", "closed", "pending"),
      defaultValue: "pending",
    },
  });

  Tender.associate = (models) => {
    Tender.hasMany(models.Bid, { foreignKey: "tender_id" });
    Tender.belongsTo(models.User, { foreignKey: "created_by" }); // Updated naming
  };

  return Tender;
};
