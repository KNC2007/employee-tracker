SELECT *
FROM course_names /* COURSE */
JOIN department 
/*
  FOREIGN KEY (department)
  REFERENCES department(id)
*/
ON course_names.department = department.id;