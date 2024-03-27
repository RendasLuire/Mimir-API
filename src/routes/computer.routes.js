import { Router } from "express";
import Computer from '../models/computer.model.js'

const router = Router()

const getComputer = async (req, res, next) => {
    let computer
    const { id } = req.params

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json(
            {
                message: 'El ID del equipo no es valido.'
            }
        )
    }

    try {
        computer = await Computer.findById(id)
        if (!computer) {
            return res.status(404).json(
                {
                    message: 'El equipo no fue encontrado'
                }
            )
        }
    } catch (error) {
        return res.status(500).json(
            {
                messaje: error.message
            }
        )
    }

    res.computer = computer
    next()
}

router.get('/', async (req, res) => {
    try {
        const computers = await Computer.find()
        if (computers.length === 0) {
            return res.status(204).json([])
        }
    } catch (error) {
        return res.status(500).json(
            {
                message: error.message
            }
        )
    }
})

router.post('/', async (req, res) => {
    const { brand, model, serialNumber, annexed, ubication, status, type } = req.body

    if (!brand || !model || !serialNumber || !annexed || !ubication || !status || !type) {
        return res.status(400).json({
            message: 'Los campos Marca, Modelo, Numero de Serie, Anexo, Ubicacion, Status  y tipo son obligatorios.'
        })
    }

    const computer = new Computer(
        {
            brand,
            model,
            serialNumber,
            annexed,
            ubication,
            status,
            type
        }
    )

    try {
        const newComputer = await computer.save()
        res.status(201).json(newComputer)
    } catch (error) {
        message: error.message
    }
})

router.get('/:id', getComputer, async (req, res) => {
    res.json(res.computer)
})

router.put('/:id', getComputer, async (req, res) => {
    try {
        const computer = res.computer

        computer.brand = req.body.brand || computer.brand
        computer.model = req.body.model || computer.model
        computer.serialNumber = req.body.serialNumber || computer.serialNumber
        computer.annexed = req.body.annexed || computer.annexed
        computer.ubication = req.body.ubication || computer.ubication
        computer.status = req.body.status || computer.status
        computer.type = req.body.type || computer.type

        const updatedComputer = await computer.save()
        res.json(updatedComputer)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

router.patch('/:id', getComputer, async (req, res) => {
    if (!req.body.brand && !req.body.model && !req.body.serialNumber && !req.body.annexed && !req.body.ubication && !req.body.status && !req.body.type) {
        res.status(400).json({
            message: 'Al menos alguno de estos campos debe ser enviado.'
        })
    }

    try {
        const computer = res.computer

        computer.brand = req.body.brand || computer.brand
        computer.model = req.body.model || computer.model
        computer.serialNumber = req.body.serialNumber || computer.serialNumber
        computer.annexed = req.body.annexed || computer.annexed
        computer.ubication = req.body.ubication || computer.ubication
        computer.status = req.body.status || computer.status
        computer.type = req.body.type || computer.type

        const updatedComputer = await computer.save()
        res.json(updatedComputer)

    } catch (error) {
        req.status(400).json({
            message: error.message
        })
    }
})

router.delete('/:id', getComputer, async (req, res) => {
    try {
        const computer = res.compose
        await computer.deleteOne({
            _id: computer._id
        })
        res.json({
            message: `El equipo ${computer.serialNumber} fue eliminado correctamente.`
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

export default router