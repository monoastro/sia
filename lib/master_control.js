const { Client } = require('pg');

const client = new Client({
	host: 'dpg-cqaagslds78s739od8j0-a.singapore-postgres.render.com',
	user: 'admin',
	port: 5432,
	password: 'lQ22c6aDiRv6XfglVATEKt27uEGmIJkn',
	database: 'electrocord_db',
	ssl: {
		rejectUnauthorized: false
	}
});


const deleteUser = async (username) => {
	client.connect();
	try {
		await client.query('DELETE FROM users WHERE username = $1', [username]);
		console.log('User deleted successfully');
	} catch (err) {
		console.log(err);
	}
	client.end();
};

const showUsers = async () => {

	client.connect();
	try
	{
		const res = await client.query("SELECT * FROM users");
		console.log(res.rows);
	}
	catch (err)
	{
		console.log(err);
	}
	client.end();
};


const activate = async (email) => {
	client.connect();
	try {
		const query = {
			text: 'UPDATE users SET is_active = true WHERE email = $1 RETURNING user_id, username, email, is_admin, is_active',
			values: [email]
		};
		const res = await client.query(query);
		if (res.rows.length > 0) {
			console.log('Activated successfully');
			console.log(res.rows[0]);
		} else {
			console.log('No user found with the provided email');
		}
	} catch (err) {
		console.error('Error activating user:', err);
	} finally {
		client.end();
	}
};

//activate('jenish.078bei018@tcioe.edu.np');

//deleteUser("bernhardturing");

showUsers();

