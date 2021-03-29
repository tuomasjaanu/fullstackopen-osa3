const mongoose = require('mongoose')

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
    .catch(error => {
        console.error("Unable to connect to mongoose!")
    })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

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
    return Person.findById(id).then(result => {    
        let persons = []    
        result.forEach(person => {
            persons.push({
                name: person.name,
                number: person.number,
                id: person._id
            })          
        })        
        if (persons.length === 0) {
            return null;
        }
        return persons[0]
    })
}

const deletePerson = (id) => {
    return Person.findByIdAndRemove(id)
}

const updatePerson = (id, name, number) => {
    return Person.findByIdAndUpdate(id, { name, number }, { new: true })
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