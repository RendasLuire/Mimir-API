import { Router } from "express";
import Storage from '../models/storage.model.js'

const router = Router()

const getStorage = async (req, res, next) => {
    let storage
    const { id } = req.params

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json(
            {
                message: 'El ID del almacen no es valido'
            }
        )
    }

    try {
        storage = await Storage.findById(id)
        if (!storage) {
            return res.status(404).json(
                {
                    message: 'El almacen no fue encontrado'
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
    res.storage = storage
    next()
}

router.get('/', async (req, res) => {
    try {
        const storages = await Storage.find()
        if (storages.length === 0) {
            return res.status(204).json([])
        }
        return res.json(storages)
    } catch (error) {
        return res.status(500).json(
            {
            message: error.message
            }
        )
    }
})

router.post('/', async (req, res) => {
    const { name, bussinessUnit, department } = req.body

    if (!name || !bussinessUnit || !department) {
        return res.status(400).json(
            {
                message: 'Los campos de nombre, unidad de negocio y departamento son obligatorios.'
            }
        )
    }

    const storage = new Storage(
        {
            name,
            bussinessUnit,
            department
        }
    )

    try {
        const newStorage = await storage.save()
        res.status(201).json(newStorage)
    } catch (error) {
        message: error.message
    }
})

router.get('/:id', getStorage, async (req, res) => {
    res.json(res.storage)
})

router.put('/:id', getStorage, async (req, res) => {
    try {
        const storage = res.storage

        storage.name = req.body.name || storage.name
        storage.bussinessUnit = req.body.bussinessUnit || storage.bussinessUnit
        storage.department = req.body.department || storage.department

        const updatedStorage = await Storage.save()
        res.json(updatedStorage)
    } catch (error) {
        res.status(400).json(
            {
                message: error.message
            }
        )
    }
})

router.patch('/:id', getStorage, async (req, res) => {
    if (!req.body.name && !req.body.bussinessUnit && !req.body.department) {
        res.status(400).json(
            {
                message: 'Al menos alguno de estos campos debe ser enviado'
            }
        )
    }

    try {
        const storage = res.storage

        storage.name = req.body.name || storage.name
        storage.bussinessUnit = req.body.bussinessUnit || storage.bussinessUnit
        storage.department = req.body.department || storage.department

        const updatedStorage = await storage.save()
        res.json(updatedStorage)
    } catch (error) {
        res.status(400).json(
            {
                message: error.message
            }
        )
    }
})

router.delete('/:id', getStorage, async (req, res) => {
    try {
        const storage = res.storage
        await storage.deleteOne(
            {
                _id: storage._id
            }
        )
        res.json(
            {
                message: `El almacen ${storage.name} fue eliminado correctamente.`
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                message: error.message
            }
        )
    }
})

export default router