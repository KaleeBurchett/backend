const express = require("express")
const Song = require("./models/songs")
var cors = require('cors')

const app = express();
app.use(cors())


app.use(express.json());

const router = express.Router();

//grab all the songs in a database
router.get("/songs", async(req, res) => {
    try{
        const songs = await Song.find({})
        res.send(songs)
        console.log(songs)
    }
    catch (err){
        console.log(err)
    }
})


//Grab a single sond in the database
router.get("/songs/:id", async (req, res) => {
    try {
        const song = await Song.findById(req.params.id)
        res.json(song)
    }
    catch (err) {
        res.status(400).send(err)
    }
})

router.post("/songs", async(req, res) =>{
    try{
        const song = await new Song(req.body)
        await song.save()
        res.status(201).jason(song)
        console.log(song)
    }
    catch(err){ 
        res.status(400).send(err)
    }
})


//update is to existing recor/resource/database entry.. it uses a put request
router.put("/songs/:id", async(req,res) =>{
    //first we need to find and update the song the frontend wants us to update.
    //to do this we need to update the id of the song from the request
    //and find it in the database and update it
    try {
        const song = req.body
        await Song.updateOne({_id: req.params.id},song)
        console.log(song)
        res.sendStatus(204)

        
    }
    catch(err) {
        res.status(400).send(err)
    }
})

//all requests that usually use an api start with /api... so the url would be localhost:3000/api/songs
app.use("/api", router)
app.listen(3000)
