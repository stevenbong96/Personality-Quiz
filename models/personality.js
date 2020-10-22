module.exports = function(sequelize, DataTypes) {
    var personality = sequelize.define("personality", {
      personality_type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      personality_description: {
        type: DataTypes.TEXT,
        allowNull: flase
      }
    });

    personality.associate = function(models) {
      personality.hasMany(models.answer, {
        foreignKey: {
          allowNull: false
        }
      } )
      personality.belongsTo(models.archetype, {
        foreignKey: {
          allowNull: false
        }
      })
    }
    return personality;
  };
  