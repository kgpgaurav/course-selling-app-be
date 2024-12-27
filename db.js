const mongoose = require("mongoose");
const Schema= mongoose.Schema;

const ObjectId= Schema.ObjectId

const userSchema = new Schema({
    email : {type: String, unique:true},
    password: String,
    firstName: String,
    lastName: String
});

const courseSchema= new Schema({
    title: String,
    description: String,
    price: Number,
    img: String,
    creatorId: ObjectId
});

const adminSchema= new Schema({
    email: {type: String, unique:true},
    password: String,
    firstName: String,
    lastName: String
});

const purchaseSchema= new Schema({
    courseid: ObjectId,
    userId: ObjectId
});

const userModel = mongoose.model("user", userSchema);
const adminModel= mongoose.model("admin", adminSchema);
const courseModel= mongoose.model("course", courseSchema);
const purchaseModel= mongoose.model("purchase", purchaseSchema);

module.exports={
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}