import { Router } from "express";
import Person from '../models/person.model.js'

const router = Router()

const getPerson = async (req, res, next) => {
    let person
    const  { id } = req.params

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json(
            {
                message: 'El ID de la persona no es valido'
            }
        )
    }

    try {
        person = await Person.findById(id)
        if (!person) {
            return res.status(404).json(
                {
                    message: 'La persona no fue encontrada.'
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
    res.person = person
    next()
}

router.get('/', async (req, res) => {
    try {
        const persons = await Person.find()
        if (persons.length === 0) {
            return res.status(204).json([])
        }
        return res.json(persons)
    } catch (error) {
        return res.status(500).json(
            {
                message: error.message
            }
        )
    }
})

router.post('/', async (req, res) => {
    const { name, department, position, manager, managerPosition } = req.body

    if (!name || !department || !position || !manager || !managerPosition) {
        return res.status(400).json(
            {
                message: 'Los campos de nombre, departamento, puesto, jefe y puesto de jefe son obligatorios.'
            }
        )
    }

    const person = new Person(
        {
            name,
            department,
            position,
            manager,
            managerPosition
        }
    )

    try {
        const newPerson = await person.save()
        res.status(201).json(newPerson)
    } catch (error) {
        message: error.message
    }
})

router.get('/:id', getPerson, async (req, res) => {
    res.json(res.user)
})

router.put('/:id', getPerson, async (req, res) => {
    try {
        const person = res.person

        person.name = req.body.name || person.name
        person.department = req.body.department || person.department
        person.position = req.body.position || person.position
        person.manager = req.body.manager || person.manager
        person.managerPosition = req.body.managerPosition || person.managerPosition

        const updatedPerson = await person.save()
        res.json(updatedPerson)
    } catch (error) {
        res.status(400).json(
            {
                message: error.message
            }
        )
    }
})

router.patch('/:id', getPerson, async (req, res) => {
    if (!req.body.name && !req.body.department && !req.body.position && !req.body.manager && !req.body.managerPosition) {
        res.status(400).json(
            {
                message: 'Al menos alguno de estos campos debe ser enviado'
            }
        )
    }

    try {
        const person = res.user

        person.name = req.body.name || person.name
        person.department = req.body.department || person.department
        person.position = req.body.position || person.position
        person.manager = req.body.manager || person.manager
        person.managerPosition = req.body.managerPosition || person.managerPosition

        const updatedPerson = await person.save()
        res.json(updatedPerson)
    } catch (error) {
        res.status(400).json(
            {
                message: error.message
            }
        )
    }
})

router.delete('/:id', getPerson, async (req, res) => {
    try {
        const person = res.person
        await person.deleteOne(
            {
                _id: person._id
            }
        )
        res.json(
            {
                message: `La persona ${person.name} fue eliminada correctamente`
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