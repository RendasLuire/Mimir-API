import { Router } from "express";
import Movement from '../models/movement.model.js'

const router = Router()

const getMovement = async (req, res, next) => {
    let movement
    const { id } = req.params

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json(
            {
                message: 'El ID del movimiento no es valido.'
            }
        )
    }

    try {
        movement = await Movement.findById(id)
        if (!user) {
            return res.status(404).json(
                {
                    message: 'El movimiento no fue encontrado'
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

    res.movement = movement
    next()
}

router.get('/', async (req, res) => {
    try {
        const movements = await Movement.find()
        if ( movements.length === 0) {
            return res.status(204).json([])
        }
        return res.json(movements)
    } catch (error) {
        return res.status(500).json(
            {
                message: error.message
            }
        )
    }
})

router.post('/', async (req, res) => {
    const { user, computer, type, date, description } = req.body

    if (!user || !computer || !type || !date || !description) {
        return res.status(400).json({
            message: 'Los campos de usuario, equipo, tipo, fecha y descripcion'
        })
    }

    const movement = new Movement(
        {
            user,
            computer,
            type,
            date,
            description
        }
    )

    try {
        const newMovement = await movement.save()
        res.status(201).json(newMovement)
    } catch (error) {
        message: error.message
    }
})

router.get('/:id', getMovement, async (req, res) => {
    res.json(res.movement)
})

router.put('/:id', getMovement, async (req, res) => {
    try {
        const movement = res.movement

        movement.user = req.body.user || movement.user
        movement.computer = req.body.computer || movement.computer
        movement.type = req.body.type || movement.type
        movement.date = req.body.date || movement.date
        movement.description = req.body.description || movement.description

        const updatedMovement = await movement.save()
        res.json(updatedMovement)

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

router.patch('/:id', getMovement, async (req, res) => {

    if (!req.body.user && !req.body.computer && !req.body.type && !req.body.date && !req.body.description) {
        res.status(400).json({
            message: 'Al menos alguno de estos campos debe ser enviado.'
        })
    }

    try {
        const movement = res.movement

        movement.user = req.body.user || movement.user
        movement.computer = req.body.computer || movement.computer
        movement.type = req.body.type || movement.type
        movement.date = req.body.date || movement.date
        movement.description = req.body.description || movement.description

        const updatedMovement = await movement.save()
        res.json(updatedMovement)

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

router.delete('/:id', getMovement, async (req, res) => {
    try {
        const movement = res.movement
        await movement.deleteOne({
            _id: movement._id
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

export default router