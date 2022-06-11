//importaciones
const express = require('express')
const cors = require("cors")
const userModel = require('./model/user.model')
const middleTest = require('./middleware')
const { tokenValidator, compare, encrypt } = require('./utils')
const jwt = require('jsonwebtoken');

//declaraciones
const app = express()
const port = 5000

//middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//puerto
app.get('/users', tokenValidator,(req, res) => { 
    const users = userModel.getAllUsers();

    res.status(200).json(users)
    console.log(users)
})

app.post("/register", async (req, res) => {
    
    const {email, password} = req.body;

    //const email = req.body.email
    //const password = req.body.password

    //validaciones
    if(!email || !password){
        res.status(500).json({
            message: "Email and password are required"
        });
        return;
    }

    const existEmail = userModel.getUserByEmail(email)
    
    if(existEmail){
        res.status(500).json({
            message: "Email already exists"
        })
        return;
    }

    const encrypted = await encrypt(password)

    const newUser = {
        id: Date.now(),
        email,
        password: encrypted
    }

    /* try{
        userModel.create(newUser)
    } catch(error){
    } */

    userModel.create(newUser);

    res.status(200).json({
        message: 'User created'
    })
    return;
})

app.post("/login", async (req, res)=>{
    const {email, password} = req.body;

    //validaciones
    if(!email || !password){
        res.status(500).json({
            message: "Email and password are required"
        });
        return;
    }

    const user = userModel.getUserByEmail(email)

    const invalidEmail = email !== user.email;

    const invalidPassword = await compare(password, user.password);

    console.log(`invalidpassword: ${invalidPassword}`);

    if(invalidEmail || invalidPassword || !user){
        res.status(500).json({
            message: "Email or password are incorrect"
        })
        return;
    }

    //generar token
    const token = jwt.sign({user}, "SECRET");

    res.status(200).json({
        message: 'Logged in succesfully',
        user
    })

})

//escucha
app.listen(port, () => console.log('> Server is up and running on port : ' + port))