const express = require("express");
const router = express.Router();
const { addNewAccount } = require('../utils/utils') 

router.get('/openAccount', async (req, res) => {
	const username = req.session.username
	if (!username) {
		res.redirect('/login')
		return
	}
	let data = {}

	const database = req.database.db('web_bank')
	const users = await database.collection("users").find({}).toArray()
	const currentUser = users.find(user => user.username === username)
	data.chequing = currentUser?.chequing
	data.savings = currentUser?.savings

	if (data.chequing) {  
		data.disableChequing = true
	}
	if (data.savings) {  
		data.disableSavings = true
	}
	res.render('openAccountPage', {data})
})

router.post('/openAccount', async (req, res) => {
	const username = req.session.username
	if (!username) {
		res.redirect('/login')
		return
	}
	const {accType, submit, cancel} = req.body
	const database = req.database.db('web_bank')

	if (cancel) {
		res.redirect('/banking')
		return
	}

	const {_, msg, newId} = addNewAccount(accType)
	const filter = { username: username }	
	// TODO: add error handling for database operations
	const result = await database.collection("users").updateOne(filter, { $set: { [accType]: newId } })

	req.session.msg = msg

	res.redirect('/banking')
})

module.exports = router