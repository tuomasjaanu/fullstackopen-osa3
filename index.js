const express = require('express')
const morgan = require('morgan')
const app = express()
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

let persons = [
    { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
    },
    { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
    },
    { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
    },
    { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (!person) {
        res.status(404)
        res.json({status: "error", reason: "not found"})
        return
    }
    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (!person) {
        res.status(404)
        res.json({status: "error", reason: "not found"})
        return
    }
    persons = persons.filter(person => person.id !== id)
    res.json({status: "ok"})
})

app.post('/api/persons', (req, res) => {
    const name = req.body.name
    if (!name) {
        res.status(400)
        res.json({status: "error", reason: "name missing"})
        return
    }
    const number = req.body.number
    if (!number) {
        res.status(400)
        res.json({status: "error", reason: "number missing"})
        return
    }

    if (persons.find(person => person.name === name)) {
        res.status(400)
        res.json({status: "error", reason: "already exists"})
        return
    }

    const MAX_ID = 2**32
    const newPerson = {
        name,
        number,
        id: Math.floor(Math.random() * MAX_ID)
    }
    persons = persons.concat(newPerson)
    res.json({status: "ok", id: newPerson.id})
})

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${persons.length} people`)
})
  

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})