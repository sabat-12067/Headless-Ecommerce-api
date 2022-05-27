const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes')

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers.token;

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
            jwt.verify(bearerToken, process.env.JWT_SECRET, (err, authData) => {
                if (err) {
                    res.status(403).json({
                        message: 'Bearer token not provided or Invalid!'
                    })
                }
                console.log('Bearer Token validated successfully!');
                req.authData = authData;
                next();
            });
    } else {
        res.sendStatus(401).json({
            message: 'You are not authenticated!'
        });
    }
};

module.exports = verifyToken;