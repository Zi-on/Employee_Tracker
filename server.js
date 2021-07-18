const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTables = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employeesDB',
});

const checkConnection = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.log(res);
        connection.end();
    })
}

checkConnection();