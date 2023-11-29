const express = require("express");
const router = express.Router();
const { validatePassword } = require('../utils/utils') 

router.get("/login", (req,res) => {
		const username = req.session.username

		if (username) { 
			res.redirect('/banking')
		} else {
			res.render('loginPage', {});
		}
})

router.post('/login', (req, res) => {
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

module.exports = router;