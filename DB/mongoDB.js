import mongoose from "mongoose";

const connectMongoDB = async function () {
   try {
      await mongoose.connect(process.env.MONGODB_URL);

      console.log("MONGODB CONNECTED 🛠 🔐");
   } catch (error) {
      console.log("ERROR IN DB CONNECTION ::", error);
   }
};
export default connectMongoDB;
