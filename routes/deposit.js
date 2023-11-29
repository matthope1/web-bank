const express = require("express");
const router = express.Router();
const { depositToAcc } = require('../utils/utils') 


router.get('/deposit', (req, res) => {
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


router.post('/deposit', (req, res) => {
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

module.exports = router