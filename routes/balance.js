const express = require("express");
const router = express.Router();
const { getAccounts, accountExists} = require('../utils/utils') 


router.get('/balance', (req, res) => {
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

router.post('/balance', (req, res) => {
		res.redirect('/banking')
})

module.exports = router