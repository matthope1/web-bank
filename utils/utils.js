const fs = require('fs')

const getUserData = () => {
	// read file sync
	// TODO: add err handling
	const rawData = fs.readFileSync('./user.json')
	let users = JSON.parse(rawData)
	return users || {}
}

const addNewUser = (usersArray) => {
	// add new user to the user.json file
	fs.writeFile('./user.json', JSON.stringify(usersArray, null, 4), (err) => {
		if (err) throw err;
		console.log('The user file has been updated!');
	})

	// TODO: rewrite using fs.writeFileSync 
	// fs.writeFileSync('./user.json', JSON.stringify(usersArray, null, 4))
	// TODO: add err handling
}

const validatePassword = (username, password) => {
	const userData = getUserData()
	console.log("validating user pass...userData", userData)
	// does user exist in db?
	const userExists = userData.hasOwnProperty(username)
	if (!userExists) {
		return {passValid: false, msg: 'not a registered username'}
	}
	// does user pass match db pass?
	if (userData[username] === password) {
		return {passValid: true, msg: 'valid user and pass'} 
	}
	return {passValid: false, msg: 'Invalid password'} 
}

module.exports = { validatePassword };