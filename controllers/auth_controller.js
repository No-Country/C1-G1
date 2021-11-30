'use strict';
const poolDB = require('../database/config/db');
const bcryptjs = require('bcryptjs');


const viewLogin = async (req,res) => {
    res.render('login');
}

const login = async (req, res) => {
    const legajo = req.body.legajo;
    const pass = req.body.password;
    //let passHaash = await bcryptjs.hash(pass, 4);

    if(legajo && pass){
        const sql = `SELECT * FROM usuarios WHERE legajo = ${legajo}`;
        poolDB.query(sql, async (err, rows) => {
            
            if(rows.length == 0){
                res.send('Usuario o contraseña incorrecta');
            }else{
                const p = rows[0].password;
                if(!await bcryptjs.compare(pass, p)){
                res.send('Usuario o contraseña incorrecta');
                }else{
                    req.session.userLogged = legajo;
                    res.cookie('legajo', legajo, {maxAge: 1000 * 3600})
               // res.send('Bienvenido!');
               res.render('./user/workspaces-list');

                }
            }
        })
    }else{
        res.send('Usuario o contraseña incorrecta');
    }
};

module.exports = {
    login,
    viewLogin
}