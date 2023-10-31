const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const path = require('path')
const fs = require('fs')
const { validatePassword, getAccounts, updateLastID } = require('./utils/utils')
const randomStr = require("randomstring");		
const app = express()
const port = process.env.PORT || 3000 

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let strRandom = randomStr.generate();

app.engine(".hbs", exphbs.engine({											
    extname: ".hbs",                                                 
    defaultLayout: false,                                              
    layoutsDir: path.join(__dirname, "/views")                           
}))

app.set("view engine", ".hbs");   

app.use(session ({
	secret: strRandom,
	saveUninitialized: true,
	resave: false,
	cookie: {
		expires:  600000  // 10 minutes
	}
}));

app.get('/', (req, res) => {
  res.send(`It's alive... It's alive, it's moving, it's alive, it's alive, it's alive, it's alive, IT'S ALIVE!`)
})

app.post('/logout', (req, res) => {
    console.log("logout endpoint hit")
    req.session.destroy()
    res.redirect('/login')
})

app.get("/login", (req,res) => {
    
    console.log("login get session", req.session.MySession)

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

    let page = 'loginPage'

    if (req.session.MySession) { 
        console.log("session exists")
        bankData.username = req.session.MySession
        page = 'bankingPage'
    }
    res.render(page, {                                               
        data: bankData 
    });
})

app.post('/login', (req, res) => {
    const {username, password} = req.body
    const {passValid, msg} = validatePassword(username, password)
    // if its not valid, redirect to login page with err message

    let page = ''
    let data = {
        msg: msg,
        username: username,
        bankName: "Club Cyberia Bank",
        timeOpen: {
            startTime: "9:30AM",
            finishTime: "12:30PM",
        },
        myList: ["item1", "item2", "item3"],
        location: {
            city: "Toronto",
        },
    }

    page = passValid ? 'bankingPage' : 'loginPage'
    console.log("setting username cookie..." ,username)
    req.session.MySession = username;		
    console.log("req.session.MySession" ,req.session.MySession)

    res.render(page, {data})
})


app.get('/test', (req,res) => {
    // test getting accounts 
    const accounts = getAccounts()
    // updateLastID()


    // end  test getting accounts

    // // read file
    // fs.readFile('./user.json', 'utf8', (err, data) => {
    //     console.log("data form user data file")
    //     const parsedData = JSON.parse(data) // convert json string to js object
    //     console.log("parsed data", parsedData)
    // })

    // // read file sync
    // const rawData = fs.readFileSync('./user.json')
    // let users = JSON.parse(rawData)

    // // how to add a user
    // users['newUserEmail@gmail.com'] = "newTestUserPass"

    // // add new user to the user.json file
    // fs.writeFile('./user.json', JSON.stringify(users, null, 4), (err) => {
    //     if (err) throw err;
    //     console.log('The user file has been updated!');
    // })
    // // how to check if[user] exists in db
    // users.hasOwnProperty('testUser@gmail.com')


    res.send('check console')
})

app.get('*', (req, res) => {
    res.send('This page cannot be found (^_^)')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
