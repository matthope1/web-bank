const express = require("express");
const router = express.Router();

router.get('/banking', (req, res) => {
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