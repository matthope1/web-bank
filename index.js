const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const fs = require('fs')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine(".hbs", exphbs.engine({											
    extname: ".hbs",                                                 
    defaultLayout: false,                                              
    layoutsDir: path.join(__dirname, "/views")                           
}))

app.set("view engine", ".hbs");   

app.get('/', (req, res) => {
  res.send(`It's alive... It's alive, it's moving, it's alive, it's alive, it's alive, it's alive, IT'S ALIVE!`)
})

app.get("/login", (req,res) => {
    
    var bankData = {
				bankName: "Club Cyberia Bank",
        timeOpen: {
            startTime: "9:30AM",
            finishTime: "12:30PM",
        },
        myList: ["item1", "item2", "item3"],
        location: {
            city: "Toronto",
        },
    };

    res.render('viewData', {                                               
        data: bankData 
    });
        
})

app.get('/readFile', (req,res) => {
    // read file
    fs.readFile('./user.json', 'utf8', (err, data) => {
        console.log("data form user data file")
        const parsedData = JSON.parse(data) // convert json string to js object
        console.log("parsed data", parsedData)
    })

    // read file sync
    const rawdata = fs.readFileSync('./user.json')
    let users = JSON.parse(rawdata)

    // how to add a user
    users['newUserEmail@gmail.com'] = "newTestUserPass"

    // add new user to the user.json file
    fs.writeFile('./user.json', JSON.stringify(users, null, 4), (err) => {
        if (err) throw err;
        console.log('The user file has been updated!');
    })
    // how to check if[user] exists in db
    users.hasOwnProperty('testUser@gmail.com')


    res.send('check console')
})

app.post('/login', (req, res) => {
	console.log("post to bank req body", req.body)
    res.send("guts is just like me for real")
})

app.get('*', (req, res) => {
    res.send('This page cannot be found (^_^)')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
