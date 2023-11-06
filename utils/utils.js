const fs = require('fs')

const getUserData = () => {
	// read file sync
	// TODO: add err handling
	const rawData = fs.readFileSync('./user.json')
	let users = JSON.parse(rawData)
	return users || {}
}

const getAccounts = () => {
	const rawData = fs.readFileSync('./accounts.json')
	let accounts = JSON.parse(rawData)
	return accounts || {}
}

const accountExists = (accNum) => {
	const accounts = getAccounts()
	return accounts.hasOwnProperty(accNum)
}

const addNewAccount = (newAccountType) => {
	console.log("add new account")
	const accounts = getAccounts()
	let newId = parseInt(accounts.lastID) + 1
	newId = newId.toString().padStart(7, '0')
	accounts.lastID = newId
	const updatedAccounts = {
		...accounts,
		// new record with key as new id
		[newId]: {
			accountType: newAccountType,
			accountBalance: 0
		}
	}

	fs.writeFile('./accounts.json', JSON.stringify(updatedAccounts, null, 4), (err) => {
		if (err) {
			return {success: false, msg: "Error writing to file"}
		} 
	})
	console.log('The accounts file has been updated!');
	return {success: true, msg: `Account #${newId} created`}
}

const depositToAcc = (accNum, depositAmt) => {
	// returns boolean indicating success or failure
	// and a msg to display to the user

	const accounts = getAccounts()
	let newAccounts = {...accounts}
	if (!accountExists(accNum)) {
		return {success: false, msg: "Account number not found"} 
	}

	console.log("data from current account:", newAccounts[accNum])

	accounts[accNum.toString()].accountBalance += parseInt(depositAmt)

	fs.writeFile('./accounts.json', JSON.stringify(accounts, null, 4), (err) => {
		if (err) throw err;
		console.log('The accounts file has been updated!');
	})

	return {success: true, msg: "Deposit successful"} 
}

const withdrawalFromAcc = (accNum, withdrawalAmt) => {
	// returns boolean indicating success or failure
	// and a msg to display to the user

	const accounts = getAccounts()
	let newAccounts = {...accounts}
	if (!accountExists(accNum)) {
		return {success: false, msg: "Account number not found"} 
	}

	console.log("data from current account:", newAccounts[accNum])

	// ensure that this amount does not make the account negative
	const accountBalance = accounts[accNum.toString()].accountBalance

	if (accountBalance < withdrawalAmt) {	
		return {success: false, msg: "Insufficient funds"} 
	}

	accounts[accNum.toString()].accountBalance -= parseInt(withdrawalAmt)

	fs.writeFile('./accounts.json', JSON.stringify(accounts, null, 4), (err) => {
		if (err) throw err;
		console.log('The accounts file has been updated!');
	})

	return {success: true, msg: "Withdrawal successful"} 
}

const addNewUser = (newUserEmail, newUserPass) => {
	// get current users data 
	// read file sync

	// how to check if[user] exists in db
	if (users.hasOwnProperty('testUser@gmail.com')) {
		console.log("user exists")
		return
	}

	// read file sync
	const rawData = fs.readFileSync('./user.json')
	let users = JSON.parse(rawData)

	// how to add a user
	users['newUserEmail@gmail.com'] = "newTestUserPass"

	// add new user to the user.json file
	fs.writeFile('./user.json', JSON.stringify(users, null, 4), (err) => {
			if (err) throw err;
			console.log('The user file has been updated!');
	})

}

const validatePassword = (username, password) => {
	// returns an object with a boolean indicating if the password is valid
	// and msg for error/success 

	const userData = getUserData()
	// does user exist in db?
	const userExists = userData.hasOwnProperty(username)
	if (!userExists) {
		return {passValid: false, msg: 'Not a registered username'}
	}
	// does user pass match db pass?
	if (userData[username] === password) {
		return {passValid: true, msg: 'Valid user and pass'} 
	}
	return {passValid: false, msg: 'Invalid password'} 
}

module.exports = { validatePassword, getAccounts, addNewAccount, depositToAcc, accountExists, withdrawalFromAcc};