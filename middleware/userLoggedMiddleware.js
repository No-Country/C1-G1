//MIDDLEWARE APLICACION PARA NO MOSTRAR LAS OPCIONES SI YA INICIASTE SESION 

const poolDB = require('../database/config/db');

 async function userLoggedMiddleware(req, res, next) { 
	let sessionUserId = await req.session.userLogged
	let sessionUser = null
	res.locals.isLogged = false;

	let legajoInCookie = req.cookies.user; 
	let legajoUser = null;

	if(sessionUserId){
		//si hay un usuario en session (solo tengo el id) traigo de la db todos los otros datos y los almaceno en sessionUser
		sessionUser = await poolDB.query(`SELECT * FROM usuarios WHERE legajo = ${sessionUserId}`        ) 
	} else if (legajoInCookie){
		//si hay un usuario en session (solo tengo el id) traigo de la db todos los otros datos y los almaceno en cookieUser
		legajoUser = await poolDB.query(`SELECT * FROM usuarios WHERE legajo = ${sessionUserId}`        ) 
	} 

	if(sessionUser){
		// si encontro el usuario, hago que las variables de locals contengan todos los datos del usuario para poder renderizarlos en el header
		res.locals.isLogged = sessionUser.dataValues;
		res.locals.userLogged = sessionUser.dataValues;  
	} else if(legajoUser){
		// si encontro el usuario, hago que las variables de locals contengan todos los datos del usuario para poder renderizarlos en el header
		res.locals.isLogged = legajoUser.dataValues;
		res.locals.userLogged = legajoUser.dataValues;  
	}

	next();
}

module.exports = userLoggedMiddleware;