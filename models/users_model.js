//const poolDB = require('../config/db');

const users = function(user) {
    this.id_usuario = user.id_usuario,
    this.nombre = user.nombre.STRING,
    this.mail = user.mail.STRING,
    this.legajo = user.legajo.INT,
    this.password = user.password.STRING,
    this.es_admin = user.es_admin.INT,
    this.empresa_id = user.empresa_id.INT,
    this.escritorio_id = user.escritorio_id.INT,
    this.edificio_id = user.edificio_id.INT
}

module.exports = users;