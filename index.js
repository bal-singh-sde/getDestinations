const { db } = require("./database");
const express = require("express");
const cors = require("cors")
const { getUID, getPhoto} = require("./services")

const server = express();
server.use(cors());

//grab the body from client as JSON object' request and create body property
server.use(express.json());

// for urlencoded body as 
server.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 3000;


server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})
//GET : /

server.get('/', (req, res) => {
    const { location } = req.query;

    if (!location) return res.send(db);

    const locations = db.filter(
      (dest) =>
        dest.location.toLocaleLowerCase() === location.toLocaleLowerCase()
    );

    return res.send(location);
    
})

//POST : creating new keys and value, we get photo before
server.post("/", async (req, res) => {
    const { name, location, description} = req.body

    if(!name || !location) return res.status(400).json({error: "name and location are required"});

    //generate UID
    const uid = getUID()

    //get Picture from Unsplash
    const photo = await getPhoto(name)

    // push to db

    db.push({
        uid,
        name,
        photo,
        location,
        description: description || ""
    })

    res.send({uid})
});


//PUT : /?uid
server.put("/", async (req, res) => {
    const { uid } = req.query;

    if(!uid || uid.length !== 6) return res.status(400).json({error: "uid is a required 6 digit number"})
    
    const { name, location, description} = req.body;

    if(!name && !location && !description){
        return res.status(400).json({error: "we need at least one property to update"})
    }
    
    let found = false;

    for(let index = 0; index < db.length; index++) {
        const dest = db[index];

        if(dest.uid === uid){
    
            // found = true;
            dest.description = description ? description : dest.description;
            dest.location = location ? location : dest.location;

            //first get the photo then update name and photo
            if(name){
                const photo = await getPhoto(name)

                dest.name = name;
                dest.photo = photo;
            }
            break;
        }
    }
    res.send({success: "true"})
    
});


//DELETE: /?uid
server.delete("/", (req, res) => {
    const { uid } = req.query;

if (!uid || uid.length !== 6)
  return res.status(400).json({ error: "uid is a required 6 digit number" });

  let found = false;
  for(let index = 0; index < db.length; index++) {
        const dest = db[index];

        if(dest.uid === uid){
            found = true
            db.splice(index, 1)
            break;
         }
        }
    if (found){
        res.send({suceess: "true"})
    }
    else {
        res.send("not updated")
    }
    
});

//GET /?location => destinations in that location

server.get("/:location/:name", (req, res) => {
    const{location} = req.params;

    if(!location) return res.status(400).json({error: "location required"})

    const locations = db.filter(dest => dest.location.toLocaleLowerCase() === location.toLocaleLowerCase())

    return res.send(locations)
})

