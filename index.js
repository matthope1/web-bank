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
    req.session.destroy()
    res.redirect('/login')
})

app.get("/login", (req,res) => {
    
    console.log("login get session", req.session.MySession)
    console.log("req.session.username" ,req.session.username)

    if (req.session.username) { 
        bankData.username = req.session.username
        page = 'bankingPage'
        res.redirect('/banking')
        return
    }
    res.render('loginPage', {});
})

app.post('/login', (req, res) => {
    const {username, password} = req.body
    const {passValid, msg} = validatePassword(username, password)

    if (!passValid) {
        // if its not valid, redirect to login page with err message
        res.render('loginPage', {msg : msg})
        return
    }

    req.session.username = username
    res.redirect('/banking')
})

app.get('/banking', (req, res) => {
    const username = req.session.username
    if (!username)  {
        res.redirect('/login')
    }
    res.render('bankingPage', {data: {username}})
})

app.post('/banking', (req, res) => {
    console.log("banking req body", req.body)
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



    res.send('check console')
})

app.get('*', (req, res) => {
    res.send('This page cannot be found (^_^)')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
