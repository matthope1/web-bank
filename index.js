const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const path = require('path')
const fs = require('fs')
const { validatePassword, getAccounts, addNewAccount, depositToAcc, withdrawalFromAcc, accountExists} = require('./utils/utils')
const randomStr = require("randomstring");		
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

app.get('/', (req, res) => {
  res.redirect('/login')
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
        username: username,
        msg: req.session.msg,
    }

    // clear any messages
    delete req.session.msg

    if (!username)  {
        res.redirect('/login')
    } else {
        res.render('bankingPage', {data})
    }
})

app.post('/banking', (req, res) => {
    const { accNum, deposit, balance, withdrawal, openAcc } = req.body
    const username = req.session.username
    req.session.accNum = accNum

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

app.get('/openAccount', (req, res) => {
    const username = req.session.username
    if (!username) {
        res.redirect('/login')
        return
    }
    res.render('openAccountPage', {})
})

app.post('/openAccount', (req, res) => {
    const username = req.session.username
    if (!username) {
        res.redirect('/login')
        return
    }
    const {accType, submit, cancel} = req.body

    if (cancel) {
        res.redirect('/banking')
        return
    }

    const {_, msg} = addNewAccount(accType)
    req.session.msg = msg

    res.redirect('/banking')
})

app.get('/deposit', (req, res) => {
    const username = req.session.username
    if (!username) {
        res.redirect('/login')
        return
    }

    const accNum = req.session.accNum

    if (!accNum) {
        req.session.msg = "Missing account number"
        res.redirect('/banking')
        return
    } 

    if (!accountExists(accNum)) {
        req.session.msg = "Account number not found"
        delete req.session.accNum
        res.redirect('/banking')    
        return
    }

    const data = {
        accNum: accNum,
    }

    res.render('depositPage', {data})
})


app.post('/deposit', (req, res) => {
    // if the user is not logged in, redirect to login page
    const username = req.session.username
    if (!username) {
        res.redirect('/login')
        return
    }

    // if request is a cancel request, return to banking page
    const {depositAmt, submit, cancel} = req.body
    if (cancel) {
        req.session.msg = "Deposit cancelled"
        res.redirect('/banking')
        return
    }

    const {success, msg} = depositToAcc(req.session.accNum, depositAmt)

    req.session.msg = msg
    res.redirect('/banking')
})

app.get('/balance', (req, res) => {
    const username = req.session.username
    if (!username) {
        res.redirect('/login')
        return
    }

    const accNum = req.session.accNum
    if (!accNum) {
        req.session.msg = "Missing account number"
        res.redirect('/banking')
        return
    }

    const accounts = getAccounts()
    if (!accountExists(accNum)) {
        req.session.msg = "Account number not found"
        res.redirect('/banking')
        return
    }

    const accountData = accounts[`${accNum}`]
    const data = {
        username: username,
        accNum: accNum,
        accType: accountData.accountType,
        accBalance: accountData.accountBalance,
    }

    res.render('balancePage', {data})
})

app.post('/balance', (req, res) => {
    res.redirect('/banking')
})

app.get('/withdrawal', (req, res) => {
    const username = req.session.username
    if (!username) {
        res.redirect('/login')
        return
    }

    const accNum = req.session.accNum

    if (!accNum) {
        req.session.msg = "Missing account number"
        res.redirect('/banking')
        return
    } 

    if (!accountExists(accNum)) {
        req.session.msg = "Account number not found"
        delete req.session.accNum
        res.redirect('/banking')    
        return
    }

    const data = {
        accNum: accNum,
        msg : req.session.msg
    }
    delete req.session.msg

    res.render('withdrawalPage', {data})
})

app.post('/withdrawal', (req, res) => {
    // if the user is not logged in, redirect to login page
    const username = req.session.username
    if (!username) {
        res.redirect('/login')
        return
    }
    // if request is a cancel request, return to banking page
    const {withdrawalAmt, submit, cancel} = req.body
    if (cancel) {
        res.redirect('/banking')
        req.session.msg = "Withdrawal cancelled"
        return
    }

    const {success, msg} = withdrawalFromAcc(req.session.accNum, withdrawalAmt)
    req.session.msg = msg

    res.redirect('/banking')
})


// app.get('/test', (req,res) => {
//     // test getting accounts 
//     const accounts = getAccounts()
//     // updateLastID()
//     // end  test getting accounts
//     res.send('check console')
// })

app.get('*', (req, res) => {
    res.send('This page cannot be found (?_?)')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
