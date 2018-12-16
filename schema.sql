DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(45) NOT NULL,
    department_name VARCHAR(45) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
  ("Tomb Raider", "Video Games", 59.99, 150),
  ("Cards Against Humanity", "Board Games", 19.95, 200),
  ("The Dark Knight", "Movies", 24.50, 50),
  ("PS4", "Game Console", 299.95, 75),
  ("Ray Bans", "Apparel", 125, 35),
  ("Levi Jeans", "Apparel", 59.99, 42),
  ("Cast Iron Pot", "Cookware", 74.99, 25),
  ("Avengers: Infinity War", "Movies", 25.50, 100),
  ("Monopoly", "Board Games", 20.00, 35),
  ("Blender", "Cookware", 19.95, 20);

  Select * from products; 