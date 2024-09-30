import mongoose from 'mongoose';
// import dotenv from "dotenv";
// dotenv.config()
const dbConnection = async() =>{
    try{
        const dbConnection = await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB CONNECTION SUCCESSFULLY")
    }
    catch(err){
        console.log("DB Error" + err);
    }
}
export default dbConnection;