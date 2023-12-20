const { table } = require('table');
const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

// let db = null; should i have this??

const questions = [
  {
    type: 'list',
    name: 'selectOption',
    message: 'What would you like to do?',
    choices: [
      'View All Departments',
      'View All Roles',
      'View All Employees',
      'Add a Department',
      'Add a Role',
      'Add an Employee',
      'Update Employee Role',
      'Update Employee Manager',
      'View Employees by Manager',
      'View Employees by Department',
      'Delete departments, roles, and employees',
      'View the total utilized budget of a department',
      'Quit'
    ]
  },
]

const init = async () => {
  db = await mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'rootroot',
      database: 'employeeTracker_db'
    }
  )
  startMenu();
};

console.log(`Connected to the employeeTracker_db database.`);
console.log(db);

// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
async function startMenu() {
  const answers = await inquirer.prompt(questions)
  console.log(answers);
  const choice = await answers.choice;
  switch (choice) {
    case 'View All Departments':
      return viewAllDepartments();
      break;
    case 'View All Roles':
      return viewAllRoles();
      break;
    case 'View All Employees':
      return viewAllEmployees();
      break;
    case 'Add a Department':
      return addDepartment();
      break;
    case 'Add a Role':
      return addRole();
      break;
    case 'Add an Employee':
      return addEmployee();
      break;
    case 'Update Employee Role':
      return captureInput();
      break;
    case 'Update Employee Manager':
      return captureInput();
      break;
    case 'View Employees by Manager':
      return captureInput();
      break;
    case 'View Employees by Department':
      return captureInput();
      break;
    case 'Delete departments, roles, and employees':
      return captureInput();
      break;
    case 'View the total utilized budget of a department':
      return captureInput();
      break;
    default: Quit()
  }
};

// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
function viewAllDepartments() {
  const query = db.query('SELECT * FROM department;', function (err, results) {
    console.log(results);
  })
};

// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
function viewAllRoles() {
  const query = db.query('SELECT * FROM role;', function (err, results) {
    console.log(results);
  })
};

// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
function viewAllEmployees() {
  db.query('SELECT * FROM employee', function (err, results) {
    console.log(results);
  })
};

// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
async function addDepartment() {
  await inquirer.prompt([
    {
      name: 'newDepartment',
      type: 'input',
      message: 'Enter the name of the new department.'
    }
  ])
    .then((answers) => {
      db.query('INSERT INTO department (name) VALUES (?)', answers.name, function (err, results) {
        console.log(results);
        console.log('Department added to database.')
      })
    })
};

// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
async function addRole() {
  const results = await db.query("SELECT * FROM DEPARTMENT");
  console.log(results);
  const departmentChoice = await results.map(({ id, name }) => ({
    name: name,
    value: id
  }))
  const newRoleChoice = await inquirer.prompt([
    {
      name: 'title',
      type: 'input',
      message: 'What is the name of the role?'
    },
    {
      name: 'salary',
      type: 'input',
      message: 'What is the salary for this role?'
    },
    {
      type: 'list',
      name: 'department_id',
      message: 'What department should this role be added to?',
      choices: departmentChoice
    }
  ])
  db.query('INSERT INTO role (name, salary, department_id) VALUES (?,?,?)', answers.name, answers.salary, answers.department_id);
  console.log('Role added to database.')
};


// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
async function addEmployee() {
  const results = await db.query("SELECT id, title FROM role");
  console.log(results);
  const roles = results.map(({ id, title }) => ({
    name: title,
    value: id,
  }))
  const newEmployee = await inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: "Enter the employee's first name.",
    },
    {
      type: 'input',
      name: 'lastName',
      message: "Enter the employee's last name.",
    },
    {
      type: 'list',
      name: 'role_Id',
      message: "Select the employee's role.",
      choices: roles,
    },
    {
      type: 'list',
      name: 'manager_Id',
      message: "Select the employee's manager.",
      choices: [
        { name: "None", value: null },
        ...managers,
      ],
    }
  ])
  db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", answers.firstName, answers.lastName, answers.role_Id, answers.manager_Id,);
  console.log('Employee added to database.')
};


// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 















function Quit() {
  console.log("exitting")
  process.exit()
}


// // table module
// const arrOfArr = data.map( row => Object.values(row));
// // add column names
// arrOfArr.unshift(["id", "name"]);
// // print table
// console.log(table(arrOfArr));


init();







