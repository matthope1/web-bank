const fs = require('fs')

export const getUserData = () => {
	// read file sync
	// TODO: add err handling
	const rawData = fs.readFileSync('./user.json')
	let users = JSON.parse(rawData)
	return users || {}
}

export const addNewUser = (usersArray) => {
	// add new user to the user.json file
	fs.writeFile('./user.json', JSON.stringify(usersArray, null, 4), (err) => {
		if (err) throw err;
		console.log('The user file has been updated!');
	})

	// TODO: rewrite using fs.writeFileSync 
	// fs.writeFileSync('./user.json', JSON.stringify(usersArray, null, 4))
	// TODO: add err handling
}