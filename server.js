const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTables = require("console.table");
const managers = [];
const roles = [];

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employeesDB",
});
const getManager = () => {
    connection.query(`SELECT manager FROM managers`, (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
        managers.push(res[i].manager)
    }
      });
};

const getRole = () => {
    connection.query(`SELECT title FROM role`, (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            roles.push(res[i].title)
        }
    });
};


const roleCheck = `SELECT id, employee.first_name, employee.last_name, title, salary, department.role, managers.manager
FROM employee
JOIN role ON employee.role_id = role.role_id 
JOIN department ON role.department_id = department.department_id
LEFT JOIN managers on employee.manager_id = managers.manager_id`;

const checkConnection = () => {
  connection.query(roleCheck, (err, res) => {
    if (err) throw err;
    console.table(res);
    connection.end();
  });
};

const init = () => {
    getRole();
    getManager();
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
const allManagers = () => {
    connection.query(`SELECT manager FROM managers`, (err, res) => {
        if (err) throw err;
        console.log("\nALL MANAGERS\n");
        console.table(res);
        init();
    })
};

const allEmployees = () => {
    connection.query(roleCheck, (err, res) => {
        console.log("\nALL EMPLOYEES\n");
        if (err) throw err;
        console.table(res);
        init();
      })
};

const allRoles = () => {
    connection.query(`SELECT title FROM role`, (err, res) => {
        console.log("\nALL ROLES\n");
        if (err) throw err;
        console.table(res);
        init();
      })
};

const allEmployeeDepartments = () => {
    inquirer
        .prompt({
            type: 'rawlist',
            name: 'departments',
            message: 'Choose a department.',
            choices: ['Engineering', 'Finance', 'Legal']
        }).then((answer) => {
            if (answer.departments === 'Engineering'){
                connection.query(`SELECT employee.first_name, employee.Last_name FROM employee
                JOIN role ON employee.role_id = role.role_id 
                JOIN department ON role.department_id = department.department_id and department.role = "Engineering"`, (err, res) => {
                    console.log("\nEngineers\n");
                    if (err) throw err;
                    console.table(res);
                    init();
                  })
                }
            else if (answer.departments === 'Finance'){
                connection.query(`SELECT employee.first_name, employee.Last_name FROM employee
                JOIN role ON employee.role_id = role.role_id 
                JOIN department ON role.department_id = department.department_id and department.role = "Finance"`, (err, res) => {
                    console.log("\nFinance\n");
                    if (err) throw err;
                    console.table(res);
                    init();
                  }) 
                }
            else if (answer.departments === 'Legal'){
                connection.query(`SELECT employee.first_name, employee.Last_name FROM employee
                JOIN role ON employee.role_id = role.role_id 
                JOIN department ON role.department_id = department.department_id and department.role = "Legal"`, (err, res) => {
                    console.log("\nLegal\n");
                    if (err) throw err;
                    console.table(res);
                    init();
                  })
            }
        });
};

addEmployee = () => {
    managers.push('none');
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'What is your first name?'
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'What is your last name?'
            },
            {
                type: 'list',
                name: 'role',
                message: 'What is your position?',
                choices: roles
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Who is your manager?',
                choices: managers
            },
        ]).then((answer) => {
            console.log(managers);
            
        })
}

init()
// getManager();
