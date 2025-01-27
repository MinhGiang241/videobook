import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_LOCAL!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("Mongodb connected successfully");
    });

    connection.on("error", (err) => {
      console.log(
        "Mongodb connection error. Please make sure MongoDb is running" + err,
      );
      process.exit();
    });
  } catch (error) {
    console.log("Something went wrong");
    console.log(error);
  }
}
