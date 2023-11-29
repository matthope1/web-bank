const express = require("express");
const router = express.Router();
const { withdrawalFromAcc, accountExists } = require('../utils/utils') 

router.get('/withdrawal', (req, res) => {
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
        msg : req.session.msg
    }
    delete req.session.msg

    res.render('withdrawalPage', {data})
})

router.post('/withdrawal', (req, res) => {
    // if the user is not logged in, redirect to login page
    const username = req.session.username
    if (!username) {
        res.redirect('/login')
        return
    }
    // if request is a cancel request, return to banking page
    const {withdrawalAmt, submit, cancel} = req.body
    if (cancel) {
        res.redirect('/banking')
        req.session.msg = "Withdrawal cancelled"
        return
    }

    const {success, msg} = withdrawalFromAcc(req.session.accNum, withdrawalAmt)
    req.session.msg = msg

    res.redirect('/banking')
})

module.exports = router
