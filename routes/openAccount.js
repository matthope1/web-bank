const express = require("express");
const router = express.Router();
const { addNewAccount } = require('../utils/utils') 

router.get('/openAccount', (req, res) => {
	const username = req.session.username
	if (!username) {
		res.redirect('/login')
		return
	}
	res.render('openAccountPage', {})
})

router.post('/openAccount', (req, res) => {
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

module.exports = router