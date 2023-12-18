const { table } = require('table');
const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

let db = null;

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

  // use prepared_statement
  // const objInput = {
  //   // must match database column and values
  //   name: "Nelson"
  // }
  // const idata = await db.query("INSERT INTO island SET ?", objInput)

  const results = await db.query("SELECT * FROM island;");
  
  // get data from results;
  const data = results[0];
  console.log(data);

  // table module
  const arrOfArr = data.map( row => Object.values(row));
  // add column names
  arrOfArr.unshift(["id", "name"]);
  // print table
  console.log(table(arrOfArr));
}
init();
