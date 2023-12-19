INSERT INTO department (name)
VALUES 
('English/Language Arts'),
('Mathematics'),
('School Operations'),
('Administration'),
('Career and Technical Education'),
('Unified Arts'),
('Social Studies'),
('Science'),
('Foreign Languages'),
('Guidance');

INSERT INTO role (title, salary, department_id)
VALUES 
('General Education Teacher', 70000, 1),
('Principal', 100000, 2),
('Assistant Principal', 90000, 3),
('Custodian', 60000, 4),
('Secretary', 60000, 5),
('Cafeteria Worker', 60000, 6),
('Counselor', 70000, 7),
('Special Education Teacher', 70000, 8),
('ELL Teacher', 70000, 9),
('Bus Driver', 60000, 10);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Harry', 'Potter', 1, 2),
('Albus', 'Dumbledore', 2, 2),
('Minerva', 'McGonagall', 3, 2),
('Argus', 'Filch', 4, 3),
('Moaning', 'Myrtle', 5, 3),
('Draco', 'Malfoy', 6, 3),
('Hermione', 'Granger', 7, 2),
('Sybill', 'Trelawney', 8, 2),
('Lord', 'Voldemort', 9, 2),
('Rubeus', 'Hagrid', 10, 3);