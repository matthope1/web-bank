const fs = require('fs')

const getUserData = () => {
	// read file sync
	// TODO: add err handling
	const rawData = fs.readFileSync('./user.json')
	let users = JSON.parse(rawData)
	return users || {}
}

const updateLastID = () => {
	const rawData = fs.readFileSync('./accounts.json')
	let accounts = JSON.parse(rawData)
	let newId = parseInt(accounts.lastID) + 1
	newId = newId.toString().padStart(7, '0')
	accounts.lastID = newId

	fs.writeFile('./accounts.json', JSON.stringify(accounts, null, 4), (err) => {
		if (err) throw err;
		console.log('The accounts file has been updated!');
	})
}

const getAccounts = () => {
	const rawData = fs.readFileSync('./accounts.json')
	let accounts = JSON.parse(rawData)
	console.log("get accounts: ", accounts)
	// remove the last id record from accounts
	delete accounts.lastID
	return accounts || {}
}

const addNewAccount = (newAccountType) => {


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

module.exports = { validatePassword, getAccounts, updateLastID};