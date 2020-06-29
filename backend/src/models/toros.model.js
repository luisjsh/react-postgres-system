const Sequelize = require("sequelize");
const sequelize = require("../database");

const torosImagenes = require("./torosimagenes.model");
const logrosModel = require('./usefull-model/logros.model');
const pelajeModel = require('./usefull-model/pelaje.model')

const toros = sequelize.define(
  "toros",
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: Sequelize.TEXT },
    hierro: { type: Sequelize.TEXT },
    hierrocodigo: { type: Sequelize.TEXT },
    pelaje: { type: Sequelize.INTEGER },
    sexo: { type: Sequelize.TEXT },
    logros: { type: Sequelize.INTEGER },
    notas: { type: Sequelize.TEXT },
    madreid: { type: Sequelize.INTEGER },
    padreid: { type: Sequelize.INTEGER },
    fechanac: { type: Sequelize.DATE },
  },
  {
    timestamps: false,
  }
);

toros.belongsTo(pelajeModel, {foreignKey: 'pelaje' , as:'pelajeId' , sourceKey:'id'})
toros.belongsTo(logrosModel, { foreignKey: 'logros', sourceKey: 'id'})
toros.hasMany(torosImagenes, { foreignKey: "torosid", sourceKey: "id" });
torosImagenes.belongsTo(toros, { foreignKey: "torosid", sourceKey: "id" });

module.exports = toros;
