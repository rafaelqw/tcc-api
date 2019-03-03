const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).send({ msg: 'Token não enviado na requisição', erro: 1 });

    const parts = authHeader.split(' ');

    if(!parts.length === 2)
        return res.status(401).send({ msg: 'Token inválido'});

    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send({ msg: 'Token mal formatado' });
    }

    if(!req.headers.device){
        jwt.verify(token, config.jwtSecret, function(err, decoded) {
            if (err) return res.status(401).send({ msg: 'Falha na validação do Token', erro: err });
    
            req.id_usuario = decoded.id;
    
            return next();
        });
    } else {
        jwt.verify(token, config.jwtSecretDevice, function(err, decoded) {
            if (err) return res.status(401).send({ msg: 'Falha na validação do Token', erro: err });
    
            req.id_usuario = decoded.id;
    
            return next();
        });
    }
}