// Initializes the npm packages used
var mysql = require("mysql");
var inquirer = require("inquirer");

// Initializes the connection variable to sync with a MySQL database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon_customer"
});

// Creates the connection with the server and loads the product data upon a successful connection
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  loadProducts();
});

// Function to load the products table from the database and print results to the console
function loadProducts() {
  // Selects all of the data from the MySQL products table
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    // Draw the table in the terminal using the response
    console.table(res);

    // Then prompt the customer for their choice of product, pass all the products to promptCustomerForItem
    promptCustomerForItem(res);
  });
}

// Prompt the customer for a product ID
function promptCustomerForItem(inventory) {
  // Prompts user for what they would like to purchase
  inquirer
    .prompt([
      {
        type: "input",
        name: "choice",
        message: "What is the ID of the item you would you like to purchase? [Quit with Q]",
        validate: function(val) {
          return !isNaN(val) || val.toLowerCase() === "q";
        }
      }
    ])
    .then(function(val) {
      // Check if the user wants to quit the program
      checkIfShouldExit(val.choice);
      var choiceId = parseInt(val.choice);
      var product = checkInventory(choiceId, inventory);

      // If there is a product with the id the user chose, prompt the customer for a desired quantity
      if (product) {
        // Pass the chosen product to promptCustomerForQuantity
        promptCustomerForQuantity(product);
      }
      else {
        // Otherwise let them know the item is not in the inventory, re-run loadProducts
        console.log("\nThat item is not in the inventory.");
        loadProducts();
      }
    });
}

// Prompt the customer for a product quantity
function promptCustomerForQuantity(product) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "How many would you like? [Quit with Q]",
        validate: function(val) {
          return val > 0 || val.toLowerCase() === "q";
        }
      }
    ])
    .then(function(val) {
      // Check if the user wants to quit the program
      checkIfShouldExit(val.quantity);
      var quantity = parseInt(val.quantity);

      // If there isn't enough of the chosen product and quantity, let the user know and re-run loadProducts
      if (quantity > product.stock_quantity) {
        console.log("\nInsufficient quantity!");
        loadProducts();
      }
      else {
        // Otherwise run makePurchase, give it the product information and desired quantity to purchase
        makePurchase(product, quantity);
      }
    });
}

// Purchase the desired quantity of the desired item
function makePurchase(product, quantity) {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
    [quantity, product.item_id],
    function(err, res) {
      // Let the user know the purchase was successful, re-run loadProducts
      console.log("\nSuccessfully purchased " + quantity + " " + product.product_name + "'s!");
      loadProducts();
    }
  );
}

// Check to see if the product the user chose exists in the inventory
function checkInventory(choiceId, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === choiceId) {
      // If a matching product is found, return the product
      return inventory[i];
    }
  }
  // Otherwise return null
  return null;
}

// Check to see if the user wants to quit the program
function checkIfShouldExit(choice) {
  if (choice.toLowerCase() === "q") {
    // Log a message and exit the current node process
    console.log("Goodbye!");
    process.exit(0);
  }
}



// var mysql = require("mysql");
// var inquirer = require("inquirer");

// var connection = mysql.createConnection({
//     host: "localhost",
//     port: 3306,
//     user: "root",
//     password: "password",
//     database: "bamazon_customer"
// });


// connection.connect(function(error) {
//     if (error) throw error;
// });

// function start() {
//     connection.query("SELECT * FROM products", function(error, response) {
//         if (error) throw error;

//         for (var i = 0; i < response.length; i++) {
//             console.log("----------");
//             console.log("ID: " + response[i].item_id);
//             console.log("Product: " + response[i].product_name);
//             console.log("Price: " + response[i].price);
//             console.log("----------");

//         }

//         inquirer.prompt([{
//             name: "id",
//             type: "input",
//             message: "What would you like to buy? Enter ID: ",
//             validate: function(value) {
//                 if (isNaN(value) === false) {
//                     return true;
//                 }
//                 return false;
//             }
//         }, {
//             name: "units",
//             type: "input",
//             message: "How many would you like to buy?",
//             validate: function(value) {
//                 if (isNaN(value) === false) {
//                     return true;
//                 }
//                 return false;
//             }

//         }]).then(function(answer) {

//             for (var i = 0; i < response.length; i++) {
//                 if (response[i].item_id === parseInt(answer.id))
//                     stock(parseInt(answer.id), answer.units);
//             }
//         });
//     });
// }

// function stock(itemID, units) {
//     connection.query("SELECT * FROM products WHERE ?", {
//         item_id: itemID
//     }, function(error, response) {
//         if (error) throw error;

//         if (response[0].stock_quantity <= 0) {
//             console.log("Insufficient quantity!");
//             restart();
//         } else
//             updateQuantity(itemID, units);
//     });
// }

// function cost(itemID, units) {
//     connection.query("SELECT * FROM products WHERE ?", {
//         item_id: itemID
//     }, function(error, response) {
//         if (error) throw error;

//         var totalCost = response[0].price * units;
//         console.log("Total cost is $ " + totalCost);

//         restart();
//     });
// }

// function updateQuantity(itemID, units) {
//     connection.query("SELECT * FROM products WHERE ?", {
//         item_id: itemID
//     }, function(error, response) {
//         if (error) throw error;

//         var newQuantity = response[0].stock_quantity - units;

//         if (newQuantity < 0)
//             newQuantity = 0;

//         connection.query("UPDATE products SET ? WHERE ?", [{
//             stock_quantity: newQuantity
//         }, {
//             item_id: itemID
//         }], function(error, response) {});

//         cost(itemID, units);
//     });
// }

// function restart() {
//     inquirer.prompt([{
//         type: "confirm",
//         message: "Add more items?",
//         name: "confirm",
//         default: true
//     }]).then(function(answer) {
//         if (answer.confirm)
//             start();
//         else {

//             connection.end();
//         }
//     });
// }

// start();