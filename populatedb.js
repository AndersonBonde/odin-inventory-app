#! /usr/bin/env node

console.log(
  'This script populates some items and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require('./models/item');
const Category = require('./models/category');

const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(index, name, description) {
  const category = new Category({ name, description });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(index, name, description, category, price, numberInStock) {
  const item = new Item({ name, description, category, price, numberInStock });
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log('Adding categories');
  await Promise.all([
    categoryCreate(0,
      'Beverages',
      'A liquid intended for human consumption.'
    ),
    categoryCreate(1,
      'Bakery',
      'Flour-based baked goods made in an oven such as bread, cookies, cakes.'
    ),
    categoryCreate(2,
      'Dairy',
      'Milk and products made from milk.'
    ),
    categoryCreate(3,
      'Meat',
      'The flesh or other edible parts of animals (usually domesticated cattle, swine, and sheep) used for food, including not only the muscles and fat but also the tendons and ligaments.'
    ),
  ]);
}

async function createItems() {
  console.log('Adding items');
  await Promise.all([
    itemCreate(0,
      'Coca Cola 2L',
      'A carbonated soft drink with a cola flavor manufactured by the Coca-Cola Company',
      categories[0],
      2.89,
      24
    ),
    itemCreate(1,
      'Guaraná 2L',
      'A very popular effervescent drink originated in Brazil. Created from the extract of the guaraná plant, native to the Amazon region, this drink has a unique and invigorating flavor.',
      categories[0],
      2.59,
      16
    ),
    itemCreate(2,
      'Sliced Bread',
      'A loaf of bread that has been sliced with a machine and packaged for convenience',
      categories[1],
      3.14,
      18
    ),
    itemCreate(3,
      'Chocolate Cake',
      'A cake flavored with melted chocolate. Sweet and savory.',
      categories[1],
      11.59,
      3
    ),
    itemCreate(4,
      'Milk 1L',
      'An opaque white fluid rich in fat and protein, secreted by cows.',
      categories[2],
      1.79,
      36
    ),
    itemCreate(5,
      'Mussarela Cheese 150g',
      'A dairy product produced from cow milk.',
      categories[2],
      3.19,
      13
    ),
    itemCreate(6,
      'Beef Minced Meat 500g',
      'Beef that has been finely chopped with a knife or meat grinder.',
      categories[3],
      6.19,
      9
    ),
    itemCreate(7,
      'Meetballs 275g',
      'Ground meat (mince) rolled into a ball, sometimes along with other ingredients, such as bread crumbs, minced onion, eggs, butter, and seasoning',
      categories[3],
      9.29,
      17 
    )
  ]);
}
