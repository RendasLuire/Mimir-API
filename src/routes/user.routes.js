import express from 'express'
import router from 'express.Router'
import User from '../models/user.model'

const getUser = async(req, res, next) => {
    let user
    const { id } = req.params

    if (!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json(
            {
                message: 'El ID del usuario no es valido'
            }
        )
    }

    try {
        user = await User.findById(id)
        if (!user) {
            return res.status(404).json(
                {
                    message: 'El usuario no fue encontrado'
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

    res.user = user
    next()
}

router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        if (users.length === 0) {
            return res.status(204).json([])
        }
        return res(users)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
})

router.post('/', async (req, res) => {
    const { name, nickname, type, password, email } = req.body

    if(!name || !nickname || !type || !password || !email) {
        return res.status(400).json({
            message: 'Los campos de usuario, nick, tipo, contraseña y correo son obligatorios.'
        })
    }

    const user = new User(
        {
            name,
            nickname,
            type,
            password,
            email
        }
    )

    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (error) {
        message: error.message
    }
})