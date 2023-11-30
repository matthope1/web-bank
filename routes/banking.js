const express = require("express");
const router = express.Router();

router.get('/banking', async (req, res) => {
	const username = req.session.username
	let data = {
		username: username,
		msg: req.session.msg,
	}

	// clear any messages
	delete req.session.msg

	// when we render the banking page we need to pull the account details from the database
	// and display them on the page
	const database = req.database.db('web_bank')
	const users = await database.collection("users").find({}).toArray()
	const currentUser = users.find(user => user.username === username)
	data.chequing = currentUser?.chequing
	data.savings = currentUser?.savings
	if (data.chequing && data.savings) {  
		data.disableAccountCreation = true
	}

	if (!data.chequing && !data.savings) {
		data.noAccounts = true
	}


	console.log("data to render", data)

	if (!username)  {
		res.redirect('/login')
	} else {
		res.render('bankingPage', {data})
	}
})

router.post('/banking', (req, res) => {
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


module.exports = router;