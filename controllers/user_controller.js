'use strict';
const dbModel = require('../models/users_model');
const poolDB = require('../config/db');


//OBTENER TODOS
const getAllUsers = async (req, res, next) => {
    const sql = 'SELECT * from usuarios';
    poolDB.query(sql, (err, rows, fields) =>{
        if(!err){
            res.send(rows)
        }
        else{
            console.error(err)
        }
    })
}

//OBTENER UNO
const getUser = async (req, res, next) => {
    const id = req.params.id;
    const sql = `SELECT * from usuarios WHERE id_usuario = ${id}`;
    poolDB.query(sql, (err, rows, fields) =>{
        if(!err){
            res.send(rows)
        }
        else{
            console.error(err)
        }
    })
}

//AGREGAR
const addUser = async (req, res, next) => {
    const sql = 'INSERT INTO usuarios SET ?';
    const data = {
        nombre: req.body.nombre,
        mail: req.body.mail,
        password: req.body.password,
        legajo: req.body.legajo,
        empresa_id: 1,
        escritorio_id: 1,
        edificio_id: 1,
        es_admin: 0
    };
    poolDB.query(sql, data, (err, rows, fields) =>{
        if(!err){
            res.send(rows)
        }
        else{
            console.error(err)
        }
    })

}

//ACTUALIZAR
const updateUser = async (req, res, next) => {
    const id = req.params.id;
    const {nombre, mail, password} = req.params;
    const sql = `UPDATE usuarios SET nombre= '${nombre}', mail='${mail}', password= '${password}' WHERE id_usuario = ${id}`;
    poolDB.query(sql, (err, rows, fields) =>{
        if(!err){
            res.send("El usuario se actualizo correctamente!");
        }
        else{
            console.error(err)
        }
    })
}

//ELIMINAR
const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    poolDB.query('DELETE FROM `usuarios` WHERE id_usuario = '+ id, (err, rows, fields) =>{
        if(!err){
            res.send(rows)
        }
        else{
            console.error(err)
        }
    })
}

module.exports = {
    addUser, 
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
}