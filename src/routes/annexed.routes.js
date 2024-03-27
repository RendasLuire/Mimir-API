import { Router } from "express";
import Annexed from '../models/annexed.model.js'

const router = Router()

// Middleware
const getAnnexed = async (req, res, next) => {
    let annexed
    const { id } = req.params

    if (!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json(
            {
                message: 'El ID del anexo no es valido'
            }
        )
    }

    try {
        annexed = await Annexed.findById(id)
        if (!annexed) {
            return res.status(404).json(
                {
                    message: 'El anexo no fue encontrado'
                }
            )
        }
    } catch (error) {
        return res.status(500).json(
            {
                message: error.menssage
            }
        )
    }

    res.annexed = annexed
    next()
}

router.get('/', async (req, res) => {
    try {
        const annexed = await Annexed.find()
    } catch (error) {
        return res.status(500).json(
            {
                message: error.message
            }
        )
    }
})

router.post('/', async (req, res) => {
    const { annexedNumber, startDate, endDate, bill } = req.body

    if(!annexedNumber || !startDate || !endDate || !bill) {
        return res.status(400).json({
            message: 'Los campos de numero de anexo, fecha de inicio, fecha final y factura son obligatorios'
        })
    }

    const annexed = new Annexed(
        {
            annexedNumber,
            startDate,
            endDate,
            bill
        }
    )

    try {
        const newAnnexed = await Annexed.save()
        res.status(201).json(newAnnexed)
    } catch (error) {
        message: error.message
    }
})

router.get('/:id', getAnnexed, async (req, res) => {
    res.json(res.annexed)
})

router.put('/:id', getAnnexed, async (req, res) => {
    try {
        const annexed = res.annexed

        annexed.annexedNumber = req.body.annexedNumber || annexed.annexedNumber
        annexed.startDate = req.body.startDate || annexed.startDate
        annexed.endDate = req.body.endDate || annexed.endDate
        annexed.bill = req.body.bill || annexed.bill

        const updatedAnnexed = await annexed.save()
        res.json(updatedAnnexed)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

router.patch('/:id', getAnnexed, async (req, res) => {
    if (!req.body.annexedNumber && !req.body.startDate && !req.body.endDate && !req.body.bill) {
        res.status(400).json({
            message: 'Al menos alguno de estos campos debe ser enviado'
        })
    }

    try {
        const annexed = res.annexed

        annexed.annexedNumber = req.body.annexedNumber || annexed.annexedNumber
        annexed.startDate = req.body.startDate || annexed.startDate
        annexed.endDate = req.body.endDate || annexed.endDate
        annexed.bill = req.body.bill || annexed.bill

        const updatedAnnexed = await annexed.save()
        res.json(updatedAnnexed)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

router.delete('/:id', getAnnexed, async (req, res) => {
    try {
        const annexed = res.annexed
        await annexed.deleteOne({
            _id: annexed._id
        })
        res.json({
            message: `El Anexo ${annexed.annexedNumber} fue eliminado correctamente.`
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

export default router