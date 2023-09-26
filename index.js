const express = require('express')
const exphbs = require('express-handlebars');
const path = require("path");
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

app.get("/bank", (req,res) => {
    
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

app.post('/bank', (req, res) => {
	console.log("post to bank req body", req.body)
})

app.get('*', (req, res) => {
    res.send('This page cannot be found (^_^)')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
