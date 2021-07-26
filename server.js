//Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTables = require("console.table");
// created blank arrays for my tables
var managers = [];
var roles = [];
var departments = [];
var employees = [];
// connection to mysql database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employeesDB",
});
// function to grab managers from database and insert them into managers array
const getManager = () => {
  connection.query(`SELECT manager, manager_id FROM managers`, (err, res) => {
    if (err) throw err;
    managers = [];
    for (let i = 0; i < res.length; i++) {
      const manager = res[i].manager;
      const manager_id = res[i].manager_id;
      var newManager = {
        name: manager,
        value: manager_id,
      };
      managers.push(newManager);
    };
    return managers;
  });
};
// function to grab departments from database and insert them in departments array
const getDepartments = () => {
  connection.query(`SELECT role, department_id FROM department`, (err, res) => {
    if (err) throw err;
    departments = [];
    for (let i = 0; i < res.length; i++) {
      const id = res[i].department_id;
      const title = res[i].role;
      var newDepartment = {
        name: title,
        value: id,
      };
      departments.push(newDepartment);
    };
    return departments;
  });
};
// function to grab roles from database and insert them roles array
const getRole = () => {
  connection.query(`SELECT title, role_id FROM role`, (err, res) => {
    if (err) throw err;
    roles = [];
    for (let i = 0; i < res.length; i++) {
      const id = res[i].role_id;
      const title = res[i].title;
      var newRole = {
        name: title,
        value: id,
      };
      roles.push(newRole);
    };
    return roles;
  });
};
// function to grab employees from database and insert them employees array
const getEmployee = () => {
  connection.query(
    `SELECT first_name, last_name, id FROM employee`,
    (err, res) => {
      if (err) throw err;
      employees = [];
      for (let i = 0; i < res.length; i++) {
        const id = res[i].id;
        const firstName = res[i].first_name;
        const lastName = res[i].last_name;
        var newEmployees = {
          name: firstName.concat(" ", lastName),
          value: id,
        };
        employees.push(newEmployees);
      }
      return employees;
    }
  );
};
// function that initializes the app and asks what they would like to do and directs them to associated function
const init = () => {
  getEmployee();
  getRole();
  getDepartments();
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
        "Add Department",
        "Add Role",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "View All Roles",
        "View All Departments",
        "View All Managers",
        "View Budget"
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

        case "Add Department":
          addDepartment();
          break;

        case "Add Role":
          addRole();
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

        case "View All Departments":
          allDepartments();
          break;

        case "View Budget":
          viewBudget();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
};
// function that previews all departments
const allDepartments = () => {
  connection.query(`SELECT role FROM department`, (err, res) => {
    console.log("\nALL DEPARTMENTS\n");
    if (err) throw err;
    console.table(res);
    init();
  });
};
// function to add a new department to the database
const addDepartment = () => {
  inquirer
    .prompt({
      type: "input",
      name: "department",
      message: "What department would you like to add?"
    })
    .then((answer) => {
      connection.query(`INSERT INTO department(role)
      VALUES("${answer.department}")`, (err, res) => {
        if (err) throw err;
        init();
      })
    })
};
// function to add a new role to the database
const addRole = () => {
  inquirer
    .prompt([
      {
      type: "input",
      name: "role",
      message: "What role would you like to add?"
    },
    {
      type: "input",
      name: "salary",
      value: "What is their salary?"
    },
    {
      type: "list",
      name: "department",
      value: "What department does this role belong to?",
      choices: departments
    }
    ])
    .then((answer) => {
      connection.query(`INSERT INTO role(title, salary, department_id)
      VALUES("${answer.role}", ${answer.salary}, ${answer.department})`, (err, res) => {
        if (err) throw err;
        init();
      })
    })
};
// function that displays all the employees that are associated with a manager
const allEmployeeManagers = () => {
  inquirer
    .prompt({
      type: "list",
      name: "manager",
      message: "choose a manager?",
      choices: managers,
    })
    .then((answer) => {
      connection.query(
        `SELECT first_name, last_name FROM employee
      WHERE manager_id = ${answer.manager};`,
        (err, res) => {
          if (err) throw err;
          console.table(res);
          init();
        }
      );
    });
};
// function to update an employees manager
const updateManager = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: "What employee is getting anew manager?",
        choices: employees,
      },
      {
        type: "list",
        name: "manager",
        message: "Who is your new manager?",
        choices: managers,
      },
    ])
    .then((answer) => {
      connection.query(
        `UPDATE employee
    SET manager_id = ${answer.manager}
    WHERE id = ${answer.employee}`,
        (err, res) => {
          if (err) throw err;
          init();
        }
      );
    });
};
// function to update role of an employee
const updateRole = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: "Whose role are we updating?",
        choices: employees,
      },
      {
        type: "list",
        name: "role",
        message: "What is their new role?",
        choices: roles,
      },
    ])
    .then((answer) => {
      connection.query(
        `UPDATE employee
  SET role_id = ${answer.role}
  WHERE id = ${answer.employee};`,
        (err, res) => {
          if (err) throw err;
          init();
        }
      );
    });
};
// function that displays all managers
const allManagers = () => {
  connection.query(`SELECT manager FROM managers`, (err, res) => {
    if (err) throw err;
    console.log("\nALL MANAGERS\n");
    console.table(res);
    init();
  });
};
// function that displays all employees and their associated data like role, salary, department and manager
const allEmployees = () => {
  connection.query(`SELECT id, employee.first_name, employee.last_name, title, salary, department.role, managers.manager
  FROM employee
  JOIN role ON employee.role_id = role.role_id 
  JOIN department ON role.department_id = department.department_id
  LEFT JOIN managers on employee.manager_id = managers.manager_id`, (err, res) => {
    console.log("\nALL EMPLOYEES\n");
    if (err) throw err;
    console.table(res);
    init();
  });
};
// function to display all roles
const allRoles = () => {
  connection.query(`SELECT title FROM role`, (err, res) => {
    console.log("\nALL ROLES\n");
    if (err) throw err;
    console.table(res);
    init();
  });
};
// function to display all employees associated with a department
const allEmployeeDepartments = () => {
  inquirer
    .prompt({
      type: "rawlist",
      name: "departments",
      message: "Choose a department.",
      choices: departments,
    })
    .then((answer) => {
      if (answer.departments === "Engineering") {
        connection.query(
          `SELECT employee.first_name, employee.Last_name FROM employee
                JOIN role ON employee.role_id = role.role_id 
                JOIN department ON role.department_id = department.department_id and department.role = "Engineering"`,
          (err, res) => {
            console.log("\nEngineers\n");
            if (err) throw err;
            console.table(res);
            init();
          }
        );
      } else if (answer.departments === "Finance") {
        connection.query(
          `SELECT employee.first_name, employee.Last_name FROM employee
                JOIN role ON employee.role_id = role.role_id 
                JOIN department ON role.department_id = department.department_id and department.role = "Finance"`,
          (err, res) => {
            console.log("\nFinance\n");
            if (err) throw err;
            console.table(res);
            init();
          }
        );
      } else if (answer.departments === "Legal") {
        connection.query(
          `SELECT employee.first_name, employee.Last_name FROM employee
                JOIN role ON employee.role_id = role.role_id 
                JOIN department ON role.department_id = department.department_id and department.role = "Legal"`,
          (err, res) => {
            console.log("\nLegal\n");
            if (err) throw err;
            console.table(res);
            init();
          }
        );
      }
    });
};
// function to add a new employee to the database
addEmployee = () => {
  managers.push("none");
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is your first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is your last name?",
      },
      {
        type: "list",
        name: "role",
        message: "What is your position?",
        choices: roles,
      },
      {
        type: "list",
        name: "manager",
        message: "Who is your manager?",
        choices: managers,
      },
    ])
    .then((answer) => {
      if (answer.manager === "none") {
        connection.query(
          `INSERT INTO employee(first_name, last_name, role_id, manager_id)
                Values ('${answer.first_name}', '${answer.last_name}', ${answer.role}, null)`,
          (err, res) => {
            if (err) throw err;
            init();
          }
        );
      } else {
        connection.query(
          `INSERT INTO employee(first_name, last_name, role_id, manager_id)
                Values ('${answer.first_name}', '${answer.last_name}', ${answer.role}, ${answer.manager})`,
          (err, res) => {
            if (err) throw err;
            init();
          }
        );
      }
    });
};
// function to remove existing employee from database
const removeEmployee = () => {
  inquirer
    .prompt({
      type: "list",
      name: "employee",
      message: "Who would you like to remove?",
      choices: employees,
    })
    .then((answer) => {
      connection.query(
        `DELETE FROM employee WHERE id=${answer.employee}`,
        (err, res) => {
          if (err) throw err;
          init();
        }
      );
      console.log(answer);
    });
};

const viewBudget = () => {
  connection.query(`SELECT salary 
  FROM employee
  JOIN role ON employee.role_id = role.role_id 
  JOIN department ON role.department_id = department.department_id
  LEFT JOIN managers on employee.manager_id = managers.manager_id`, (err, res) => {
    if (err) throw err;
    console.log(res);
    var budget = [];
    for (let i = 0; i < res.length; i++) {
      const addBudget = res[i].salary;
      budget.push(addBudget)
    }
    var sum = budget.reduce(function(a, b){
      return a + b;
    }, 0);
    console.log("TOTAL BUDGET")
    console.log(sum)
    init();
  })
}

// initializes application
init();
