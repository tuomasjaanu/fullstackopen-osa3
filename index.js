const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

app.use(cors())
app.use(express.static('frontend/build'))
app.use(express.json())
app.use(morgan((tokens, req, res) => {
    let fields = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ]
    if (tokens.method(req, res) == 'POST') {
        fields = fields.concat(JSON.stringify(req.body))
    }
    return fields.join(' ')
  }

))
const errorHandler = (error, request, response, next) => {    
    console.error(error.name, error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ reason: 'malformatted id' })
    }

    next(error)
}
  

const db = require('./services/mongo')

app.get('/api/persons', (req, res, next) => {
    db.getAllPersons()
        .then((persons) => {
            res.json(persons).end()
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    db.getPersonById(req.params.id)
        .then((person) => {
            if(person)
                res
                    .json(person)
                    .end()
            else {
                res
                    .status(404)
                    .json({reason: 'not found'})
                    .end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    db.deletePerson(req.params.id)
        .then(() => {
            res
                .status(204)
                .end()
        })    
        .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
    db.getAllPersons()
    .then((persons) => {
        res
            .send(`Phonebook has info for ${persons.length} people`)
            .end()
    })    
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const name = req.body.name
    if (!name) {
        res
            .status(400)
            .json({reason: "name missing"})
            .end()
        return
    }
    const number = req.body.number
    if (!number) {
        res
            .status(400)
            .json({reason: "number missing"})
            .end()
        return
    }

    db.addNewPerson(name, number)
        .then(response => {
            res
                .json(response)
                .end()
        })    
        .catch(error => next(error))
})
 
app.put('/api/persons/:id', (req, res, next) => {
    const name = req.body.name
    if (!name) {
        res
            .status(400)
            .json({reason: "name missing"})
            .end()
        return
    }
    const number = req.body.number
    if (!number) {
        res
            .status(400)
            .json({reason: "number missing"})
            .end()
        return
    }

    db.updatePerson(req.params.id, name, number)
        .then(response => {
            res
                .json(response)
                .end()
        })    
        .catch(error => next(error))
})
 

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})