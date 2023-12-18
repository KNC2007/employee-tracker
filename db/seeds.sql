INSERT INTO departments (name)
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

INSERT INTO roles (title, salary, department_id)
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
('Harry', 'Potter', 1, 1),
('Albus', 'Dumbledore', 2, 2),
('Minerva', 'McGonagall', 3, 3),
('Argus', 'Filch', 4, 4),
('Moaning', 'Myrtle', 5, 5),
('Draco', 'Malfoy', 6, 6),
('Hermione', 'Granger', 7, 7),
('Sybill', 'Trelawney', 8, 8),
('Lord', 'Voldemort', 9, 9),
('Rubeus', 'Hagrid', 10, 10);