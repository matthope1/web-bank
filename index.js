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
    const username = req.session.username

    if (username) { 
        res.redirect('/banking')
    } else {
        res.render('loginPage', {});
    }
})

app.post('/login', (req, res) => {
    const {username, password} = req.body
    const {passValid, msg} = validatePassword(username, password)

    const data = {  
        msg: msg,
    }

    if (!passValid) {
        // if its not valid, redirect to login page with err message
        res.render('loginPage', {data})
    } else {
        req.session.username = username
        res.redirect('/banking')
    }
})

app.get('/banking', (req, res) => {
    const username = req.session.username
    const data = {
        username: username
    }

    if (!username)  {
        res.redirect('/login')
    } else {
        res.render('bankingPage', {data})
    }
})

app.post('/banking', (req, res) => {
    console.log("banking req body", req.body)
    const { accNum, deposit, balance, withdrawal, openAcc } = req.body
    // TODO: maybe body can return a single response rather than a bunch of different options ..
    // that way we can just take the response and just redirect to that page instead of having 
    // to check each one individually

    const username = req.session.username

    if (!username) {
        res.redirect('/login')
        return
    }

    if (openAcc) {
        // display open account page
        res.redirect('/openAccount')
        return
    } 

    if (!accNum) {
        const data = {
            username: username,
            msg: "Missing account number",
        }
        // send back item to be re selected 
        res.render('bankingPage', {data})
        return
    }

    if (deposit) {
        // display deposit page
        res.redirect('/deposit')
        return
    }

    if (balance) {
        // display balance page
        res.redirect('/balance')
        return
    }

    if (withdrawal) {
        res.redirect('/withdrawal')
        return
    }

    res.redirect('/banking')
})

app.get('/test', (req,res) => {
    // test getting accounts 
    const accounts = getAccounts()
    // updateLastID()
    // end  test getting accounts
    res.send('check console')
})

app.get('*', (req, res) => {
    res.send('This page cannot be found (^_^)')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
