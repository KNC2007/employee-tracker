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
      'Delete department',
      'Delete role',
      'Delete employee',
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
      updateEmployeeRole();
      break;
    case 'Delete department':
      deleteDepartment();
      break;
    case 'Delete role':
      deleteRole();
      break;
    case 'Delete employee':
      deleteEmployee();
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
    const results = await db.query(`
    SELECT 
        role.id, 
        role.title, 
        role.salary, 
        department.name AS department
      FROM 
        role
      JOIN 
        department ON role.department_id = department.id`);
    console.log("Viewing All Roles: ");
    const displayTable = results[0].map(row => Object.values(row));
    displayTable.unshift(["id", "title", "salary", "department"]);
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
    const results = await db.query(`
    SELECT 
        employee.id, 
        employee.first_name, 
        employee.last_name, 
        role.title AS job_title, 
        department.name AS department, 
        role.salary, 
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
      FROM 
        employee
      LEFT JOIN 
        role ON employee.role_id = role.id
      LEFT JOIN 
        department ON role.department_id = department.id
      LEFT JOIN 
        employee manager ON employee.manager_id = manager.id`);
    console.log("Viewing All Employees: ");
    const displayTable = results[0].map(row => Object.values(row));
    displayTable.unshift(["id", "first_name", "last_name", "job_title", "department", "salary", "manager_name"]);
    console.log(table(displayTable, config));
  } catch (error) {
    console.error(error);
  }
  init();
};


// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
async function addDepartment() {
  try {
    const answers = await inquirer.prompt([
      {
        name: 'newDepartment',
        type: 'input',
        message: 'Enter the name of the new department.'
      }
    ]);
    await db.query('INSERT INTO department (name) VALUES (?)', answers.newDepartment);
    console.log('Department added to the database.');
  } catch (error) {
    console.error(error);
  }
  init();
};


// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
async function addRole() {
  try {
    const results = await db.query("SELECT * FROM department");
    console.log(results);
    const departmentChoices = results[0].map(({ id, name }) => ({
      name: name,
      value: id
    }));

    const newRoleData = await inquirer.prompt([
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
        choices: departmentChoices
      }
    ]);

    await db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [newRoleData.title, newRoleData.salary, newRoleData.department_id]);
    console.log('Role added to the database.');
  } catch (error) {
    console.error(error);
  }
  init();
}


// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
async function addEmployee() {
  try {
    const roleResults = await db.query("SELECT id, title FROM role");
    console.log(roleResults);
    const roles = roleResults[0].map(({ id, title }) => ({
      name: title,
      value: id,
    })
    );
    const employeeNames = await db.query("SELECT id, first_name, last_name FROM employee");
    console.log(employeeNames);
    const employees = employeeNames[0].map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    })
    );
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
          ...employees
        ],
      }
    ]);
    await db.query(
      "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
      [newEmployee.firstName, newEmployee.lastName, newEmployee.role_Id, newEmployee.manager_Id]
    );
    console.log('Employee added to the database.');
  } catch (error) {
    console.error(error);
  }
  init();
}


// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
async function updateEmployeeRole() {
  try {
    const employeeResults = await db.query("SELECT id, first_name, last_name FROM employee");
    console.log(employeeResults);
    const employees = employeeResults[0].map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    })
    );
    const roleResults = await db.query("SELECT id, title FROM role");
    console.log(roleResults);
    const roles = roleResults[0].map(({ id, title }) => ({
      name: title,
      value: id,
    })
    );
    const updatedEmployee = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select the employee to update:',
        choices: employees,
      },
      {
        type: 'list',
        name: 'newRoleId',
        message: 'Select the new role for the employee:',
        choices: roles,
      },
    ]);
    await db.query(
      "UPDATE employee SET role_id = ? WHERE id = ?",
      [updatedEmployee.newRoleId, updatedEmployee.employeeId]
    );
    console.log('Employee role updated in the database.');
  } catch (error) {
    console.error(error);
  }
  init();
};


// delete a department
async function deleteDepartment() {
  const departments = await db.query("SELECT * FROM department");
  const departmentChoices = departments[0].map(({ id, name }) => ({
    name: name,
    value: id,
  }));
  const { departmentId } = await inquirer.prompt({
    type: 'list',
    name: 'departmentId',
    message: 'Select the department to delete:',
    choices: departmentChoices,
  });
  await db.query('DELETE FROM department WHERE id = ?', [departmentId]);
  console.log('Department deleted.');
  init();
}

// delete a role
async function deleteRole() {
  const roles = await db.query("SELECT * FROM role");
  const roleChoices = roles[0].map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  const { roleId } = await inquirer.prompt({
    type: 'list',
    name: 'roleId',
    message: 'Select the role to delete:',
    choices: roleChoices,
  });
  await db.query('DELETE FROM role WHERE id = ?', [roleId]);
  console.log('Role deleted.');
  init();
}

// Function to delete an employee
async function deleteEmployee() {
  const employees = await db.query("SELECT * FROM employee");
  const employeeChoices = employees[0].map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));

  const { employeeId } = await inquirer.prompt({
    type: 'list',
    name: 'employeeId',
    message: 'Select the employee to delete:',
    choices: employeeChoices,
  });

  await db.query('DELETE FROM employee WHERE id = ?', [employeeId]);
  console.log('Employee deleted.');
  init();
}

function Quit() {
  console.log("exitting")
  process.exit()
}

init();







