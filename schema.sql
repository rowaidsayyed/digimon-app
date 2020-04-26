DROP TABLE IF EXISTS digimonsTable;

CREATE TABLE digimonsTable(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  image VARCHAR(255),
  level VARCHAR(255) 
);

-- INSERT INTO digimonsTable (name,image,level) VALUES ('hiiii','linkkkkkkk','herooo');