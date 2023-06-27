require("dotenv").config();

const mongoose = require("mongoose");
const mongoUri = process.env.MONGO_URI;

async function connect() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
    const fetched_data = await mongoose.connection.db.collection("food_items");
    const cursor = fetched_data.find({});
    const data = await cursor.toArray();
    const food_category = await mongoose.connection.db.collection(
      "food_category"
    );
    const catData = food_category.find({});
    const catFood = await catData.toArray();
    global.food_items = data;
    global.foodCategory = catFood;
    // console.log(global.food_items);
  } catch (error) {
    console.log("Could not connect to MongoDB");
    throw error;
  }
}

module.exports = connect;
