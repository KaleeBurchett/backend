const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://sdev255:Password246@songdb.j3zcys7.mongodb.net/?retryWrites=true&w=majority&appName=SongDB", {useNewUrlParser: true})

module.exports = mongoose