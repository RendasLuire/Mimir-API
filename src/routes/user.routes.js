import { Router } from 'express'
import User from '../models/user.model.js'

const router = Router()

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
        return res.json(users)
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

router.get('/:id', getUser, async (req, res) => {
    res.json(res.user)
})

router.put('/:id', getUser, async (req, res) => {
    try {
        const user = res.user

        user.name = req.body.name || user.name
        user.nickname = req.body.nickname || user.nickname
        user.type = req.body.type || user.type
        user.password = req.body.password || user.password
        user.email = req.body.email || user.email

        const updatedUser = await user.save()
        res.json(updatedUser)

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

router.patch('/:id', getUser, async (req, res) => {

    if(!req.body.name && !req.body.nickname && !req.body.type && !req.body.password && !req.body.email){
        res.status(400).json({
            message: 'Al menos alguno de estos campos debe ser enviado'
        })
    }

    try {
        const user = res.user

        user.name = req.body.name || user.name
        user.nickname = req.body.nickname || user.nickname
        user.type = req.body.type || user.type
        user.password = req.body.password || user.password
        user.email = req.body.email || user.email

        const updatedUser = await user.save()
        res.json(updatedUser)

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

router.delete('/:id', getUser, async (req, res) => {
    try {
        const user = res.user
        await user.deleteOne({
            _id: user._id
        })
        res.json({
            message: `El usuario ${user.name} fue eliminado correctamente.`
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})



export default router
