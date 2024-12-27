const {Router} =require('express');
const adminRouter= Router();
const {adminModel} =require('../db');
const {courseModel} =require('../db');
const {z }= require('zod');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const {JWT_admin_secret}= require('../config')
const{ adminMiddleware}= require('../middleware/admin')

adminRouter.post("/signup", async(req,res)=>{
    const requireBody = z.object({
        email: z.string().min(5).max(100).email(),
        firstName: z.string().min(3).max(100),
        lastName: z.string().min(3).max(100),
        password: z.string().min(3).max(30)
    })
    const parsedDataWithSuccess = requireBody.safeParse(req.body);
    if (!parsedDataWithSuccess.success) {
        return res.json({
            message: "Incorrect data format",
            error: parsedDataWithSuccess.error
        })

    }

    try {
        const { email, password, firstName, lastName } = req.body;
        const hashedPassword = await bcrypt.hash(password, 5);
    
        await adminModel.create({
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: hashedPassword
        });
    
        return res.json({
            message: "User created successfully"
        });
    
    } catch (e) {
        console.error(e); // Log the error details
        return res.json({
            message: "Error while processing request",
            error: e.message
        });
    }
})

adminRouter.post("/signin", async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    const admin = await adminModel.findOne({
        email: email,

    })

    if (!admin) {
        res.status(403).json({
            message: "Admin doesn't exist"
        })
        return
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (passwordMatch) {
        const token = jwt.sign({
            id: admin._id.toString()
        }, JWT_admin_secret);
        res.json({
            token: token
        });
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
})

adminRouter.post("/course", adminMiddleware, async(req,res)=>{
    const adminId= req.userId;

    const{title, description, imageUrl,price}= req.body;
    const course= await courseModel.create({
        title:title,
        description: description,
        imageUrl: imageUrl,
        price:price,
        creatorId: adminId
    })
    res.json({
        message:"course created",
        courseId: course._id
    })
})

adminRouter.put("/updatecourses", adminMiddleware, async(req,res)=>{
    const adminId= req.userId;

    const{title, description, imageUrl,price, courseId}= req.body;

    const course= await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId

    },{ title:title,
        description: description,
        imageUrl: imageUrl,
        price:price,
        creatorId: adminId
    })
    res.json({
        message:"course updated",
        courseId: course._id
    })
})


adminRouter.get("/course/bulk",adminMiddleware, async (req,res)=>{
    const adminId= req.userId;


    const courses= await courseModel.find({
        
        creatorId: adminId

    })
    res.json({
        message:"the courses",
        courses
    })
})
module.exports={
    adminRouter: adminRouter
}