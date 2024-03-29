"use strict";
const poolDB = require("../database/config/db");

const viewReserva = async (req, res, next) => {
  const legajo = req.cookies.legajo;
  const tipo = req.params.tipo;
  const sql = `SELECT * from usuarios WHERE legajo = ${legajo}`;
  poolDB.query(sql, (err, rows, fields) => {
    if (!err) {
      res.render("./user/seleccionar-turno", { tipo, rows });
    } else {
      console.error(err);
    }
  });
};

//OBTENER TODOS
const getAllReservas = async (req, res, next) => {
  const f = new Date();
  const nFecha = f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate();
  const sql = `SELECT * from turnos WHERE fecha BETWEEN '${nFecha}' and '4016-06-30' ORDER BY fecha ASC`;
  const sqlUsers = "SELECT * from usuarios";
  poolDB.query(sql, (err, rows, fields) => {
    if (!err) {
      poolDB.query(sqlUsers, (err, rowsU, fields) => {
        if (!err) {
          res.render("./admin/reservations-list", { rows, rowsU });
        } else {
          console.error(err);
        }
      });
    } else {
      console.error(err);
    }
  });
};

//OBTENER POR FECHA
const getReservasFecha = async (req, res, next) => {
  const date = req.body.date;
  const sql = `SELECT * from turnos WHERE fecha = "${date}"`;
  poolDB.query(sql, (err, rows, fields) => {
    if (!err) {
      res.send(rows);
    } else {
      console.error(err);
    }
  });
};

//OBTENER UNO
const getReserva = async (req, res, next) => {
  const f = new Date();
  const nFecha = f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate();
  //console.log(nFecha)
  const id = req.params.id;
  const sql = `SELECT * from turnos WHERE usuario_id = ${id} AND fecha BETWEEN '${nFecha}' and '4016-06-30' ORDER BY fecha ASC`;
  poolDB.query(sql, (err, rows, fields) => {
    if (!err) {
      res.render("./user/mis-turnos", { rows, idUsuario: id });
    } else {
      console.error(err);
    }
  });
};

//ACTUALIZAR
const updateReserva = async (req, res, next) => {
  const id = req.params.id;
  const fecha = req.body.fecha;
  const sql = `UPDATE turnos SET fecha= '${fecha}' WHERE id_turno = ${id}`;
  await poolDB.query(sql, (err, rows, fields) => {
    if (!err) {
      res.send("¡La reserva se actualizo correctamente!");
    } else {
      console.error(err);
    }
  });
};

//ELIMINAR
const deleteReserva = async (req, res, next) => {
  const idUsuario = req.params.id;
  const idReserva = req.params.rId;
  const sql = `DELETE FROM turnos WHERE id_turno = ${idReserva}`;
  poolDB.query(sql, (err, rows, fields) => {
    if (!err) {
      console.log("¡La reserva se eliminó correctamente!");
      res.status(200).json({ message: "La reserva se eliminó correctamente." });
    } else {
      console.error(err);
      res.status(500).json({ message: "Error al eliminar la reserva." });
    }
  });
};

//AGREGAR
const addReserva = async (req, res, next) => {
  const tipo = req.body.tipo;
  const fecha = req.body.fecha;
  const user = req.body.usuario_id;
  var puestos = 0;
  const nuFecha = fecha.split("-").reverse().join("-");
  const sqlValidaUser = `SELECT * FROM turnos WHERE fecha = "${fecha}" AND usuario_id = ${user}`;
  const sqlFecha = `SELECT * FROM turnos WHERE fecha = "${fecha}" AND tipo = ${tipo}`;
  const sqlTurno = "INSERT INTO turnos SET ?";
  switch (tipo) {
    case "1":
      puestos = 40;
      break;
    case "2":
      puestos = 30;
      break;
    case "3":
      puestos = 10;
      break;
  }
  //Valida User
  poolDB.query(sqlValidaUser, (err, rows, fields) => {
    var p;
    if (rows.length == 0) {
      //Valida fecha
      poolDB.query(sqlFecha, (err, rows, fields) => {
        const escritorio = rows.length + 1;
        if (rows.length < puestos) {
          switch (tipo) {
            case "1":
              if (escritorio <= 20) {
                p = 1;
              } else {
                p = 2;
              }
              break;
            case "2":
              if (escritorio <= 15) {
                p = 3;
              } else {
                p = 4;
              }
              break;
            case "3":
              p = 5;
              break;
          }
          const data = {
            usuario_id: user,
            escritorio_id: escritorio,
            fecha: fecha,
            tipo: tipo,
            piso: p,
          };
          //Reserva con 1er puesto vacio
          poolDB.query(sqlTurno, data, (err, rows, fields) => {
            if (!err) {
              res.render("./user/res-turno", {
                alert: "alert-success",
                message: "¡El turno fue reservado con éxito!",
                type: "success",
                error: "",
                date: `Fecha: ${nuFecha}`,
                escritorio: `Puesto: ${data.escritorio_id}`,
                id: user,
              });
            } else {
              res.render("./user/res-turno", {
                alert: "alert-danger",
                message: "Hubo un error al reservar el turno.",
                type: "error",
                error: err,
                date: "",
                escritorio: "",
                id: user,
              });
            }
          });
        } else {
          res.render("./user/res-turno", {
            alert: "alert-danger",
            message: `Puesto no disponible para la fecha ${nuFecha}.`,
            type: "error",
            error: err,
            date: "",
            escritorio: "",
            id: user,
          });
        }
      });
    } else {
      res.render("./user/res-turno", {
        alert: "alert-danger",
        message: `Ya tenes reservado un puesto para la fecha ${nuFecha}.`,
        type: "error",
        error: err,
        date: "",
        escritorio: "",
        id: user,
      });
    }
  });
};

module.exports = {
  viewReserva,
  getAllReservas,
  getReserva,
  addReserva,
  updateReserva,
  deleteReserva,
  getReservasFecha,
};