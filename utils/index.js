const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    encrypt: async (data) => {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(data, salt)
    },
    compare: async (data, encrypted) => {
        return await bcrypt.compare(data, encrypted)
    },
    //middleware
    tokenValidator: (req, res, next) => {
        const token = req.headers['auth']
        if(!token){
            res.status(401).json({
                message: 'No token provided'
            })
            return;
        }

        try{
            //const verified = jwt.verify(token, process.env.TOKENSECRET);
            const verified = jwt.verify(token, 'SECRET')
            
        } catch(error){
            res.status(401).json({
                message: 'Invalid token'
            })
            return;
        }

        next();
    }
}

