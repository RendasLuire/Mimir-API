import jwt from 'jwt-simple'
import moment from 'moment'

import libjwt from '../services/jwt.js'

const secret = libjwt.secret

const auth = (req, res, next) => {

    let payload = []

    if (!req.headers.authorization) {
        return res.status(401).json(
            {
                message: 'No hay token.'
            }
        )
    }

    const token = req.headers.authorization.replace(/['"]+/g, '')

    try {
        payload = jwt.decode(token, secret)

        if (payload.exp <= moment().unix()) {
            return res.status(402).json(
                {
                    message: 'Token expirado.'
                }
            )
        }

    } catch (error) {
        payload = []
        return res.status(500).json(
            {
                message: error.message
            }
        )
    }

    req.user = payload

    next()
}

export default { auth }