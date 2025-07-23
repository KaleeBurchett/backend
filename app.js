const express = require("express")
const Song = require("./models/songs")
var cors = require('cors')
//const bodyParser = require('body-parser')
const jwt = require('jwt-simple')
const User = require("./models/users")

const app = express();
app.use(cors())


app.use(express.json());

const router = express.Router();
const secret = "supersecret"

//creating a new user
router.post("/user", async (req, res) => {
    if(!req.body.username || !req.body.password){
        res.status(400).json({error: "Missing username or password"})
    }

    const newUser = await new User({
        username: req.body.username,
        password: req.body.password,
        status: req.body.status
    })

    try {
        await newUser.save()
        console.log(newUser)
        res.sendStatus(201) //created
    }
    
    catch (err) {
        res.status(400).send(err)
    }
})

//authenticate or login
//post request - reason why is because when you login you are creating what we call a new 'session'
router.post("/auth", async (req, res) => {
    if (!req.body.username || !req.body.password){
        res.status(400).json({error: "Missing username or password"})
        return
    }
    //try to find the username in the database, then see if it matches with a username and password
    //await finding a user
    let user = await User.findOne({username : req.body.username})

        if(!user) {
            res.status(401).json({error: "Bad Username"})
        }
        //check it to see if the user's password matches the request password
        else {
            if(user.password != req.body.password){
                res.status(401).json({error: "Bad Password"})
            }
            //successful login
            else{
                //create a token that is encoded with the jwt library, and send back the username... this will be important later
                //we also will send back as part of the token that you are currently authorized
                //we could do this with a boolean or a number value i.e. if auth = 0 then you are not authorized, if auth = 1 you are authorized

                username2 = user.username
                const token = jwt.encode({username: user.username}, secret)
                const auth = 1

                //respond with the token
                res.json({
                    username2,
                    token : token,
                    auth : auth
                })
            }
        }
    })

    //check status of user with a valid token, see if it matches the front end token
    router.get("/status", async (req, res) => {
        if(!req.headers["x-auth"]){
            return res.status(401).json({error: "Missing X-Auth"})
        }

        //if x-suth contains the token (it should)
        const token = req.headers["x-auth"]
        try{
            const decoded = jwt.decode(token, secret)

            //send back all username and status fields to the user or front end
            let users = User.find("{} username status")
            res.json(users)
        }
        catch(ex){
            res.status(401).json({error: "invalide jwt token"})
        }
    })

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

router.delete("/songs/:id", async (req, res) => {
    //method or function in Mongoose/Mongo to delete a single instance of a song or object
    try{
        const song = await Song.findById(req.params.id)
        console.log(song)
        await Song.deleteOne({ _id: song._id })
        res.sendStatus(204)
    }
    catch (err) {
        res.status(400).send(err)
    }
})

//all requests that usually use an api start with /api... so the url would be localhost:3000/api/songs
app.use("/api", router)
app.listen(3000)
