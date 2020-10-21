

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("user", {
      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [8,16]
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8,16]
        }
      },
      email: {
          type: DataTypes.STRING,
          validate: {
              isEmail: true
          }
      }
    });
    User.associate = function(models) {
      User.hasMany(models.quizTaken, {
        foreignKey: {
          allowNull: false
        }
      })
      User.hasMany(models.quiz, {
        foreignKey: {
          allowNull: false
        }
    })
  }
    // User.beforeCreate(function(user){
    // user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10),null);
    // })

    return User;
  };