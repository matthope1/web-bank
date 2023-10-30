const express = require('express')
const cookieParser = require("cookie-parser");
const exphbs = require('express-handlebars')
const path = require('path')
const fs = require('fs')
const { validatePassword } = require('./utils/utils')
const app = express()
const port = process.env.PORT || 3000 

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

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
    
    const { cookies } = req.cookies
    console.log("login get cookies", cookies)

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

    res.render('loginPage', {                                               
        data: bankData 
    });
        
})

app.post('/login', (req, res) => {
    const {username, password} = req.body
    const { cookies } = req.cookies
    const {passValid, msg} = validatePassword(username, password)
    // console.log({passValid, msg})
    // if its not valid, redirect to login page with err message

    // sending a cookie
    // console.log("Cookies from client: ", req.cookies);                              //  Displays cookies submitted via request message
    // res.cookie("firstName", "Albert");                                              //  Set cookie name as "firstName" and value as "Albert"
    // res.send("<h0>Send one cookie from server to client</h1>");
    // end sending a cookie

    // setting a cookie that expires
    // res.cookie("expiration", "ten", {maxAge: 9999});                               //  Set cookie name as "expiration" and value as "ten" and expire in 10000 miliseconds
    //  res.cookie(name, 'value', {expire: 359999 + Date.now()});                   //  Expires after 360000 ms from the time the cookie is set
    // end setting a cookie that expires

    //  getting cookie from request
    // console.log("Cookies from client: ", req.cookies);   
    //  end getting cookie from request

    console.log("login post cookies", cookies)

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
    console.log("setting username cookie...")
    res.cookie("username", username);
    res.render(page, {data})

})


// app.get('/test', (req,res) => {

//     // read file
//     fs.readFile('./user.json', 'utf8', (err, data) => {
//         console.log("data form user data file")
//         const parsedData = JSON.parse(data) // convert json string to js object
//         console.log("parsed data", parsedData)
//     })

//     // read file sync
//     const rawData = fs.readFileSync('./user.json')
//     let users = JSON.parse(rawData)

//     // how to add a user
//     users['newUserEmail@gmail.com'] = "newTestUserPass"

//     // add new user to the user.json file
//     fs.writeFile('./user.json', JSON.stringify(users, null, 4), (err) => {
//         if (err) throw err;
//         console.log('The user file has been updated!');
//     })
//     // how to check if[user] exists in db
//     users.hasOwnProperty('testUser@gmail.com')


//     res.send('check console')
// })

app.get('*', (req, res) => {
    res.send('This page cannot be found (^_^)')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
