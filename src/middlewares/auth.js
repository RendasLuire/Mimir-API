import jwt from 'jwt-simple'
import moment from 'moment'

import libjwt from '../services/jwt.js'

const secret = libjwt.secret

const auth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json(
            {
                message: 'No hay token.'
            }
        )
    }

    const token = req.headers.authorization.replace(/['"]+/g, '')

    try {
        const data = jwt.decode(token, secret)

        if (data.exp <= moment().unix()) {
            return res.status(402).json(
                {
                    message: 'Token expirado.'
                }
            )
        }

    } catch (error) {
        return res.status(500).json(
            {
                message: error.message
            }
        )
    }

    req.user = data

    next()
}

export default auth