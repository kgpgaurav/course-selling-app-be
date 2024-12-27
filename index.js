require('dotenv').config()
const express = require('express');

const mongoose = require('mongoose');

const { userRouter } = require('./routers/user');
const { courseRouter } = require('./routers/course');
const { adminRouter } = require('./routers/admin')


const app = express();
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/admin", adminRouter);

async function main() {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("connected to database, now starting your backend")
}
main();
app.listen(3000);