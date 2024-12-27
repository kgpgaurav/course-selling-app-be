const { Router } = require('express');
const { userModel, purchaseModel, courseModel } = require('../db');
const {z }= require('zod');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const {JWT_user_secret}= require('../config')
const{userMiddleware}= require('../middleware/user')

const userRouter = Router();

userRouter.post("/signup",async function (req, res) {
    
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
    
        await userModel.create({
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: hashedPassword
        });
    
        return res.json({
            message: "Admin created successfully"
        });
    
    } catch (e) {
        console.error(e); // Log the error details
        return res.json({
            message: "Error while processing request",
            error: e.message
        });
    }
    

    
})


userRouter.post("/signin",  async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await userModel.findOne({
        email: email,

    })

    if (!user) {
        res.status(403).json({
            message: "User doesn't exist"
        })
        return
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
        const token = jwt.sign({
            id: user._id.toString()
        }, JWT_user_secret);
        res.json({
            token: token
        });
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
})


userRouter.get("/purchases",userMiddleware, async function (req, res) {
    const userId= req.userId;

    const purchases=await purchaseModel.find({
        userId
    });

    // let purchasedCourses=[];
    // for(let i=0;i<purchases.length;i++){
    //     purchasedCourses.push(purchases[i].courseId);
    // }
    
    const coursesData= await courseModel.find({
        _id: {$in: purchases.map(x=>x.courseId)}
    })

    res.json({
        purchases,
        coursesData
    })
})
userRouter.post("/signin", function (req, res) {
    res.json({
        message: "signup endpoint"
    })
})
module.exports = {
    userRouter: userRouter
}