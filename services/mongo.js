const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const password = process.env.MONGO_PASSWORD
const url =
  `mongodb+srv://tuomasjaanu:${password}@cluster0.dbkdb.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(
    url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .catch( error => {
        console.error(`Unable to connect to mongoose: ${error}`)
    })

const length_validator = (minimum_length) => {
    return (field) => field.length >= minimum_length
}

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        validate: [length_validator(3), 'too short']
    },
    number: {
        type: String,
        required: true,
        validate: [length_validator(8), 'too short']
    }
})

personSchema.plugin(uniqueValidator)

const Person = mongoose.model('Person', personSchema)

const getAllPersons = () => {
    return Person.find({}).then(result => {
        let persons = []
        result.forEach(person => {
            persons.push({
                name: person.name,
                number: person.number,
                id: person._id
            })
        })
        return persons
    })
}

const getPersonById = (id) => {
    return Person.findById(id)
}

const deletePerson = (id) => {
    return Person.findByIdAndRemove(id)
}

const updatePerson = (id, name, number) => {
    return Person.findByIdAndUpdate(
        id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
}

const addNewPerson = (name, number) => {
    const person = new Person({
        name,
        number
    })

    return person.save().then(person => {
        return {
            name: person.name,
            number: person.number,
            id: person._id
        }
    })
}

module.exports = {
    getAllPersons,
    addNewPerson,
    getPersonById,
    deletePerson,
    updatePerson
}