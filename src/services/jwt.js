import jwt from 'jwt-simple'
import moment from 'moment'

const secret = ""

const createToken = (user) => {
    const data = {
        id: user._id,
        name: user.name,
        nickname: user.nickname,
        type: user.type,
        iat: moment().unix(),
        exp: moment().add(7, "days").unix
    }

    return jwt.encode(data, secret)
}

export default {createToken, secret}