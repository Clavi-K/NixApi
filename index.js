/* ===== ENVIROMENT VARIABLES FILE CONFIG ===== */

require("dotenv").config({ path: ".env" })

/* ========== */

/* ===== REQUIRED IMPORTS ===== */

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const router = require("./controllers/index")

/* ========== */

/* ===== VARIABLES ===== */

const PORT = process.env.PORT || 8080
// mongodb+srv://<db_username>:<db_password>@cluster0.j3uwp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0 
const dburi = `mongodb+srv://${process.env.db_username}:${process.env.db_password}@cluster0.j3uwp.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.app_name}`

/* ========== */

/* ===== APP INITIALIZATION ===== */

const app = express()

/* ========== */

/* ===== DATABASE CONNECTION ===== */

mongoose.connect(dburi).then(() => {

    /* ===== MIDDLEWARES ===== */

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cors())

    /* ========== */

    /* ===== HEADERS ===== */

    app.use((req, res, next) => {

        res.header('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Credentials", 'true');
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept"
        );
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");

        next();
    })

    /* ========== */

    /* ===== ROUTERS ===== */
    
    app.use("/", router)
    
    /* ========== */
    
    /* ===== APP LISTENING ===== */
    
    app.listen(PORT, () => console.log("Listening on port: " + PORT))
    
    /* ========== */

})

/* ========== */



