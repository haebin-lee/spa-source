CREATE DATABASE IF NOT EXISTS example;

USE example;

CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  todo VARCHAR(255) NOT NULL,
  checked BOOLEAN DEFAULT false,
  created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);