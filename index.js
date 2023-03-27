const express = require("express")
require("dotenv").config()
const cors = require("cors")
const connection = require("./Config/db")
const userRouter = require("./routes/user.routes")
const Authenticator = require("./Middlewares/auth.middleware")
const postRouter = require("./routes/post.routes")

const app = express()
app.use(cors())
app.use(express.json())

// all the routes

app.use("/users",userRouter)
app.use(Authenticator)
app.use("/posts",postRouter)

app.listen(process.env.LOCAL_HOST,async()=>{
    try {
        await connection
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log("could'nt connect to MongoDB")
    }

    console.log(`listening on port ${process.env.LOCAL_HOST}`)
})