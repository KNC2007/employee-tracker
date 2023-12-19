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
  );

  console.log(`Connected to the employeeTracker_db database.`);
  console.log(db);

  // TODO use inquirer if you want
  async function startMenu() {
    const answers = await inquirer.prompt(questions)
    console.log(answers);
  }
  .then((answers) => {
    if (answers === 'View All Departments') {
      db.query('SELECT * FROM department;', function (err, results) {
        console.log(results);
        process.exit(0);
      })
    };
    if (answers === 'View All Roles') {
      db.query('SELECT * FROM role;', function (err, results) {
        console.log(results);
        process.exit(0);
      })
    };
    if (answers === 'View All Employees') {
      db.query('SELECT * FROM employee', function (err, results) {
        console.log(results);
        process.exit(0);
      })
    };
    if (answers === 'Add a Department') {
      addDepartment();
      })
    };

//   }
//   )
// };

// use prepared_statement
// const objInput = {
//   // must match database column and values
//   name: "Nelson"
// }
// const idata = await db.query("INSERT INTO island SET ?", objInput)

async function addDepartment() {
  await inquirer.prompt([
    {
      name: 'newDepartment',
      type: 'input',
      message: 'Enter the name of the new department.'
    }
  ])
  .then((answers) => {
    db.query('INDERT INTO department (department.name) VALUES (?)', function (err, results){
      console.log(results);
      process.exit(0);
    })
  })
}

// get data from results;
const data = results[0];
console.log(data);

  // // table module
  // const arrOfArr = data.map( row => Object.values(row));
  // // add column names
  // arrOfArr.unshift(["id", "name"]);
  // // print table
  // console.log(table(arrOfArr));


init();

