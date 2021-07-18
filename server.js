const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTables = require("console.table");

const roleCheck = `SELECT first_name, last_name, title, salary, department.role, manager_id
FROM employee
JOIN role ON employee.role_id = role.role_id 
JOIN department ON role.department_id = department.department_id`;

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employeesDB",
});

const checkConnection = () => {
  connection.query(roleCheck, (err, res) => {
    if (err) throw err;
    console.table(res);
    connection.end();
  });
};

// checkConnection();

const init = () => {
  inquirer
    .prompt({
      name: "init",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Employees By Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Manager Role",
        "Update Employee Manager",
        "View All Roles",
        "View All Managers",
      ],
    })
    .then((answer) => {
      switch (answer.init) {
        case "View All Employees":
          allEmployees();
          break;

        case "View All Employees By Department":
          allEmployeeDepartments();
          break;

        case "View All Employees By Manager":
          allEmployeeManagers();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Update Employee Role":
          updateRole();
          break;

        case "Update Employee Manager":
          updateManager();
          break;

        case "View All Roles":
          allRoles();
          break;

        case "View All Managers":
          allManagers();
          break;
      }
    });
};

const allEmployees = () => {
    connection.query()
}

checkConnection();
init();