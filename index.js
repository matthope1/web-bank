const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const path = require('path')
const fs = require('fs')
const { validatePassword, getAccounts, addNewAccount, depositToAcc, withdrawalFromAcc, accountExists} = require('./utils/utils')
const randomStr = require("randomstring");		
const login = require('./routes/login')
const banking = require('./routes/banking')
const openAccount = require('./routes/openAccount')
const deposit = require('./routes/deposit')
const withdrawal = require('./routes/withdrawal')
const balance = require('./routes/balance')
const mongoUtil = require('./mongoDb/dbConnect')
const app = express()
const port = process.env.PORT || 3000 

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/public')));

let strRandom = randomStr.generate();

app.engine(".hbs", exphbs.engine({											
    extname: ".hbs",                                                 
    defaultLayout: false,                                              
    layoutsDir: path.join(__dirname, "/views"),
    partialsDir: path.join(__dirname, '/views/partials') 
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

// initialize database
(async () => {
    const database = await mongoUtil.connectDb() 

    app.use((req, res, next) => {
        req.database = database
        next()
    })

    app.get('/', (req, res) => {
        res.redirect('/login')
    })

    app.post('/logout', (req, res) => {
        req.session.destroy()
        res.redirect('/login')
    })

    app.get('/login', login)
    app.post('/login', login)

    app.get('/banking', banking)
    app.post('/banking', banking)

    app.get('/openAccount', openAccount)
    app.post('/openAccount', openAccount)

    app.get('/deposit', deposit)
    app.post('/deposit', deposit)

    app.get('/withdrawal', withdrawal)
    app.post('/withdrawal', withdrawal)

    app.get('/balance', balance)
    app.post('/balance', balance)

    app.get('/test', async (req,res) => {
        // // test getting accounts 
        // const accounts = getAccounts()
        // // updateLastID()
        // // end  test getting accounts

        const users = await db.collection("users").find({}).toArray()
        console.log("users", users)

        res.send('check console')
    })

    app.get('*', (req, res) => {
        res.send('This page cannot be found (?_?)')
    })

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })

})()

