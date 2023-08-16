// import express module
const express = require("express");

//import body-parser module
const bodyParser = require("body-parser");

//import bcrypt module
const bcrypt = require("bcrypt");

//import muletr module
const multer = require("multer");

//import path module
const path = require("path");

//import axios module
const axios = require("axios");

//import nodemailer module
const nodemailer = require("nodemailer");
//import uuid module

const { v4: uuidv4 } = require("uuid");

// import mongoose module
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/projetFinEtudesDB");

// import JsonWebToken module
const jwt = require("jsonwebtoken");

// import express-session module
const session = require("express-session");

//create application express
const app = express();

//Models Importation
const User = require("./models/user");

//application config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Security configuration
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-with, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, OPTIONS, PATCH, PUT"
  );
  next();
});

// Session Configuration
const secretKey = "croco23";
app.use(
  session({
    secret: secretKey,
  })
);

// shortCut
app.use("/myImages", express.static(path.join("backend/images")));
app.use("/myPDFs", express.static(path.join("backend/pdfs")));

//Media types
const MIME_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "application/pdf": "pdf",
};

const storageConfig = multer.diskStorage({
  // destination
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE[file.mimetype];
    let error = new Error("Mime type is invalid");
    if (isValid) {
      error = null;
    }
    if (file.mimetype === "application/pdf") {
      cb(null, "backend/pdfs");
    } else {
      cb(null, "backend/images");
    }
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const extension = MIME_TYPE[file.mimetype];
    const fileName = name + "-" + Date.now() + "-crococoder-" + "." + extension;
    cb(null, fileName);
  },
});

// Function Generate Reset Token For Forgot Password
function generateResetToken() {
  const resetToken = uuidv4();
  return resetToken;
}

//Bussiness logic :Signup Begin

// Business Logic Signup Admin
app.post("/api/users/signup/admin", (req, res) => {
  bcrypt.hash(req.body.pwd, 8).then((cryptedPwd) => {
    req.body.pwd = cryptedPwd;
    let userObj = new User(req.body);
    userObj.save((err, doc) => {
      console.log("echec ", err);
      console.log("succes", doc);
      if (err) {
        if (err.errors.email) {
          res.status(200).json({ message: "0" });
        } else if (err.errors.tel) {
          res.status(200).json({ message: "1" });
        }
      } else {
        res.status(200).json({ message: "2" });
      }
    });
  });
});

//function gener Signup for Students and Teachers
function processSignup(req, res, userType) {
  bcrypt.hash(req.body.pwd, 8).then((cryptedPwd) => {
    req.body.pwd = cryptedPwd;

    let userObj = new User(req.body);

    if (userType === "teacher") {
      req.body.cv = `${req.protocol}://${req.get("host")}/myPDFs/${
        req.files["cv"][0].filename
      }`;
      userObj.cv = req.body.cv;

      req.body.photo = `${req.protocol}://${req.get("host")}/myImages/${
        req.files["photo"][0].filename
      }`;
      userObj.photo = req.body.photo;
    } else if (userType === "student") {
      req.body.photo = `${req.protocol}://${req.get("host")}/myImages/${
        req.file.filename
      }`;
      userObj.photo = req.body.photo;
    }

    userObj.save((err, doc) => {
      console.log("echec ", err);
      console.log("succes", doc);
      if (err) {
        if (err.errors.email) {
          res.status(200).json({ message: "0" });
        } else if (err.errors.phone) {
          res.status(200).json({ message: "1" });
        } else {
          res.status(500).json({ message: "An error occurred." });
        }
      } else {
        res.status(200).json({ message: "2" });
      }
    });
  });
}

// Business Logic Signup Teacher

app.post(
  "/api/users/signup/teacher",
  multer({ storage: storageConfig }).fields([
    { name: "cv", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  (req, res) => {
    const cvFile = req.files["cv"][0];
    const imageFile = req.files["photo"][0];

    processSignup(req, res, "teacher", cvFile, imageFile);
  }
);

// Business Logic Signup Student
app.post(
  "/api/users/signup/student",
  multer({ storage: storageConfig }).single("photo"),
  (req, res) => {
    console.log("here backend");
    processSignup(req, res, "student");
  }
);
//Bussiness logic :Signup End

//Bussiness logic :Login Begin
app.post("/api/users/login", (req, res) => {
  let user;
  console.log("here into Bl Login", req.body);
  //Check if email exist
  User.findOne({ email: req.body.email })
    .then((doc) => {
      console.log("herer doc login", doc);
      user = doc;
      //Send  email Error msg
      if (!doc) {
        res.json({ msg: "0" });
      } else {
        //Check pwd
        return bcrypt.compare(req.body.pwd, doc.pwd);
      }
    })
    .then((isEqual) => {
      console.log("here is equal", isEqual);
      if (!isEqual) {
        res.json({ msg: "1" });
      } else {
        let userToSend = {
          userId: user._id,
          fName: user.firstName,
          lName: user.lastName,
          phone: user.phone,
          email: user.email,
          role: user.role,
        };
        // If the user is valid, generate a JWT token
        const token = jwt.sign(userToSend, secretKey, {
          expiresIn: "1h",
        });

        res.json({ user: token, msg: "2" });
      }
    });
});
//Bussiness logic :Login End

//Bussiness logic :Forgot Password Begin

app.post("/api/users/forgot-password", async (req, res) => {
  const email = req.body.email;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("L'utilisateur n'existe pas.");
      return res.json({ message: "L'utilisateur n'existe pas." });
    }
    // Générez un jeton de réinitialisation (peut-être avec une bibliothèque comme crypto-random-string)
    const resetToken = generateResetToken();
    // Enregistrez le jeton dans la base de données pour cet utilisateur
    user.resetToken = resetToken;
    await user.save();

    // Envoi de l'e-mail de réinitialisation with MailTrap
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "afcf34ef83695f",
        pass: "35f025444c6c18",
      },
    });

    const mailOptions = {
      from: "test@example.com",
      to: email,
      subject: "Réinitialisation du mot de passe",
      html: `<p>Cliquez sur ce <a href="http://localhost:4200/reset-password/${resetToken}/${user._id}">lien</a> pour réinitialiser votre mot de passe.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Demande de réinitialisation envoyée avec succès." });
  } catch (error) {
    console.error(
      "Erreur lors de la réinitialisation du mot de passe :",
      error
    );
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la réinitialisation du mot de passe.",
    });
  }
});

//Bussiness logic :Forgot Password End

//Bussiness Logic : Add NEw PAssword
app.put("/api/users", (req, res) => {
  bcrypt.hash(req.body.pwd, 8).then((cryptedPwd) => {
    req.body.pwd = cryptedPwd;
    console.log("here backend", req.body);
    User.updateOne({ _id: req.body._id }, req.body).then((response) => {
      if (response.nModified == 1) {
        res.json({ message: "OK" });
      } else {
        res.json({ message: "Not OK" });
      }
    });
  });
});
//Bussiness Logic:Get User By Id
app.get("/api/users/:id", (req, res) => {
  console.log("here in BL : Get User By Id");
  let id = req.params.id;
  User.findOne({ _id: id }).then((doc) => {
    res.status(200).json({ user: doc });
  });
});

//make application exportables
module.exports = app;
