const authMiddleware = async(req, res, next) =>{
	if(!req.session.userLogged) {
        res.render('login');
        }
}
//MIDDLEWARE PARA QUE SI NO TENES SESSION TE MANDE A INICIARLA
/*
function authMiddleware(req, res, next) {
	if(!req.session.userLogged) {
        return res.render('login');
    }
    next();
}
*/
module.exports = authMiddleware;