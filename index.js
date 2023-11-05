const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const path = require('path')
const fs = require('fs')
const { validatePassword, getAccounts, addNewAccount, depositToAcc, accountExists} = require('./utils/utils')
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
    // TODO:  to accomplish the above, try giving the inputs all the same name but different value

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
    res.render('openAccountPage', {username})
})

app.post('/openAccount', (req, res) => {
    console.log("open account endpoint hit", req.body)
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

    const {success, msg} = addNewAccount(accType)
    const data = {
        msg: msg,
        username: username,
    }
    res.render('bankingPage', {data})
})

app.get('/deposit', (req, res) => {
    // TODO: we're incorrectly using res.render
    // the issue is that render won't change the url that were making requests to
    // when we fail to make a deposit we end up trying to post rather than get from the
    // banking page 
    // to fix this were going to have to serve up error messages using the session 
    // dso why does this work for the balance page? 

    const username = req.session.username
    if (!username) {
        res.redirect('/login')
        return
    }

    const accNum = req.session.accNum
    console.log("deposit get accNum", accNum)
    console.log("accnum type", typeof accNum)

    if (!accNum) {
        const data = {
            msg: "Missing account number",
        }
        // res.render('bankingPage', {data})
        res.redirect('/banking')
        return
    } 
    console.log("account exists", accountExists(accNum))

    if (!accountExists(accNum)) {
        const data = {
            msg: "Account number not found",
        }
        // res.render('bankingPage', {data})
        delete req.session.accNum
        res.redirect('/banking')    
        return
    }

    const data = {
        accNum: accNum,
    }

    console.log("deposit rendering from HERE ")
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
        res.redirect('/banking')
        return
    }

    const {success, msg} = depositToAcc(req.session.accNum, depositAmt)
    console.log({success, msg})
    const data = {
        msg: msg,
        accNum: req.session.accNum,
    }

    res.render('bankingPage', {data})

})

app.get('/balance', (req, res) => {
    const username = req.session.username
    if (!username) {
        res.redirect('/login')
        return
    }

    const accNum = req.session.accNum
    if (!accNum) {
        const data = {
            msg: "Missing account number",
        }
        // send back item to be re selected 
        res.render('bankingPage', {data})
        return
    }

    const accounts = getAccounts()
    if (!accountExists(accNum)) {
        const data = {
            msg: "Account number not found",
        }
        res.render('bankingPage', {data})
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

})

app.post('/withdrawal', (req, res) => {

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
