const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes')

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers.token;

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
            jwt.verify(bearerToken, process.env.JWT_SECRET, (err, authData) => {
                //if token is provided but invalid
                if (err) {
                    res.status(StatusCodes.FORBIDDEN).json({
                        message: 'Invalid token!'
                    })
                }
                req.authData = authData;
                next();
            });
    } else {
        //if no token is provided
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'You are unauthorized! You have no access to this resource!'
        });
    }
};

module.exports = verifyToken;