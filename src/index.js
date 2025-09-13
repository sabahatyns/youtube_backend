// import mongoose from "mongoose";
// import { DB_NAME} from "./constants.js";
// import e from "express";
import { app } from "./app.js";
import connectDB from "./db/db.js";
import dotenv from "dotenv"

dotenv.config({
    path: './env'
})
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`server is lisenting at port ${process.env.PORT}`)
        })
        app.on("error", (error) => {
            console.log("error", error)
            throw error
        })
    })
    .catch((error) => {
        console.log("db connection failed", error)
    })


// there are two ways to do that. one is write all code in index.js like below,
//  second is write in separate file in db folder and import here

// ; (async () => {
//     try {
//         mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//         app.on("error", (error)=>{
//             console.log("error", error)
//             throw error
//         })
//         app.listen(process.env.PORT, ()=>{
//             console.log(`App is listening on port ${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.error("error", error)
//         throw error
//     }
// })() // IIFE in javascript

