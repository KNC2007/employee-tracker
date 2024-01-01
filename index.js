const { table } = require('table');
const inquirer = require('inquirer');
// const mysql = require('mysql2/promise');
const startConnection = require('./db/connection')
let db = null;

const config = {
  columns: {
    0: { alignment: 'left' },
    1: { alignment: 'left' },
  },
  border: {
    topBody: `─`,
    topJoin: `┬`,
    topLeft: `┌`,
    topRight: `┐`,

    bottomBody: `─`,
    bottomJoin: `┴`,
    bottomLeft: `└`,
    bottomRight: `┘`,

    bodyLeft: `│`,
    bodyRight: `│`,
    bodyJoin: `│`,

    joinBody: `─`,
    joinLeft: `├`,
    joinRight: `┤`,
    joinJoin: `┼`
  }
};


const questions = [
  {
    type: 'list',
    name: 'option',
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



async function init() {
  // connect to database
  db = await startConnection();
  // console.log(db);
  // const results = await db.query('SELECT * FROM department');
  // get data from results
  // console.log(results[0]);
  console.log(`Connected to the employeeTracker_db database.`);
  // console.log(db);
  await startMenu();
}


// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
async function startMenu() {
  const answers = await inquirer.prompt(questions)
  // console.log(answers);
  const choice = await answers.option;
  // console.log(choice);
  switch (choice) {
    case 'View All Departments':
      viewAllDepartments();
      break;
    case 'View All Roles':
      viewAllRoles();
      break;
    case 'View All Employees':
      viewAllEmployees();
      break;
    case 'Add a Department':
      addDepartment();
      break;
    case 'Add a Role':
      addRole();
      break;
    case 'Add an Employee':
      addEmployee();
      break;
    case 'Update Employee Role':
      captureInput();
      break;
    case 'Update Employee Manager':
      captureInput();
      break;
    case 'View Employees by Manager':
      captureInput();
      break;
    case 'View Employees by Department':
      captureInput();
      break;
    case 'Delete departments, roles, and employees':
      captureInput();
      break;
    case 'View the total utilized budget of a department':
      captureInput();
      break;
    case 'Quit':
      Quit()
      break;
  }
};

// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
async function viewAllDepartments() {
  try {
    const results = await db.query("SELECT * FROM department");
    // console.log(results[0]);
    console.log("Viewing All Departments: ");
    const displayTable = results[0].map(row => Object.values(row));
    // console.table(displayTable);
    displayTable.unshift(["id", "name"]);
    // console.table(displayTable);
    console.log(table(displayTable, config));
  } catch (error) {
    console.error(error);
  }
  init();
};


// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
async function viewAllRoles() {
  try {
    const results = await db.query('SELECT * FROM role');
    console.log("Viewing All Roles: ");
    const displayTable = results[0].map(row => Object.values(row));
    displayTable.unshift(["id", "title", "salary", "department_id"]);
    console.log(table(displayTable, config));
  } catch (error) {
    console.error(error);
  }
  init();
};


// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
async function viewAllEmployees() {
  try {
    const results = await db.query('SELECT * FROM employee');
    console.log("Viewing All Employees: ");
    const displayTable = results[0].map(row => Object.values(row));
    displayTable.unshift(["id", "first_name", "last_name", "role_id", "manager_id"]);
    console.log(table(displayTable, config));
  } catch (error) {
    console.error(error);
  }
  init();
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
async function addEmployeeRole() {
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














// function Quit() {
//   console.log("exitting")
//   process.exit()
// }


// // table module
// const arrOfArr = data.map( row => Object.values(row));
// // add column names
// arrOfArr.unshift(["id", "name"]);
// // print table
// console.log(table(arrOfArr));




init();
// startMenu();






