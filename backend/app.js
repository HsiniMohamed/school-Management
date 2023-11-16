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
const Quote = require("./models/quote");
const Cours = require("./models/cours");
const Group = require("./models/group");
const Category = require("./models/category");
const Payement = require("./models/payement");

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
//Configuration Mailtrap with nodemailer
let transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "afcf34ef83695f",
    pass: "35f025444c6c18",
  },
});

// Function Generate Reset Token For Forgot Password
function generateResetToken() {
  const resetToken = uuidv4();
  return resetToken;
}
//Bussiness logic :User Begin
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
  //Check if email exist
  User.findOne({ email: req.body.email })
    .then((doc) => {
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
      return res.json({ message: "0" });
    }
    // Générez un jeton de réinitialisation (peut-être avec une bibliothèque comme crypto-random-string)
    const resetToken = generateResetToken();
    // Enregistrez le jeton dans la base de données pour cet utilisateur
    user.resetToken = resetToken;
    await user.save();

    const mailOptions = {
      from: "test@example.com",
      to: email,
      subject: "Réinitialisation du mot de passe",
      html: `<p>Cliquez sur ce <a href="http://localhost:4200/reset-password/${resetToken}/${user._id}">lien</a> pour réinitialiser votre mot de passe.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "1" });
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

//Bussiness Logic :Reset and Add NEw PAssword
app.put("/api/users/reset-pwd", (req, res) => {
  bcrypt.hash(req.body.pwd, 8).then((cryptedPwd) => {
    req.body.pwd = cryptedPwd;
    User.updateOne({ _id: req.body._id }, req.body).then((response) => {
      if (response.nModified == 1) {
        res.json({ message: "1" });
      } else {
        res.json({ message: "0" });
      }
    });
  });
});
//Bussiness Logic :Edit profile
//Bussiness Logic : Edit profile
app.put("/api/users/edit-profile", (req, res) => {
  User.updateOne({ _id: req.body._id }, req.body).then((response) => {
    if (response.nModified == 1) {
      res.json({ message: "1" });
    } else {
      res.json({ message: "0" });
    }
  });
});

//Bussiness Logic : Update  Photo User
app.put(
  "/api/users/update-photo/:userId",
  multer({ storage: storageConfig }).single("photo"),
  (req, res) => {
    const userId = req.params.userId;
    console.log("here in bl update");
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Aucun fichier de photo n'a été téléchargé." });
    }
    // Mettez à jour l'URL de la photo de profil dans la base de données
    console.log("here in bl hahah");
    User.updateOne(
      { _id: userId },
      {
        photo: `${req.protocol}://${req.get("host")}/myImages/${
          req.file.filename
        }`,
      }
    )
      .then((response) => {
        if (response.nModified == 1) {
          res.json({ message: "1" });
        } else {
          res.json({ message: "0" });
        }
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la mise à jour de la photo de profil :",
          error
        );
        res.status(500).json({
          message: "Erreur lors de la mise à jour de la photo de profil.",
        });
      });
  }
);

//Bussiness Logic : Sending mail
app.post("/api/users/send-email", (req, res) => {
  const { name, email, subject, message } = req.body;

  const mailOptions = {
    from: email,
    to: "admin@example.com", // L'adresse e-mail de l'administrateur
    subject: subject,
    text: `Nom de l'utilisateur : ${name}\nE-mail de l'utilisateur : ${email}\n\nMessage :\n${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        message: "0",
      });
    } else {
      console.log("E-mail envoyé : " + info.response);
      res.status(200).json({ message: "1" });
    }
  });
});
//__________________________________________________________________________________________________

//Bussiness Logic : Ask For a  Quote
app.post("/api/administration/ask-quote", (req, res) => {
  const { firstName, lastName, email, trainingSession, planingOption, date } =
    req.body;
  let quoteObj = new Quote(req.body);
  quoteObj.save((err, doc) => {
    console.log("echec ", err);
    console.log("succes", doc);
    if (err) {
      res.status(200).json({ message: "0" });
    } else {
      res.status(200).json({ message: "1" });
    }
  });
  const mailOptions = {
    from: email,
    to: "admin@example.com", // L'adresse e-mail de l'administrateur
    subject: `Ask For a  Quote ${date}`,
    text: ` Nom de l'utilisateur : ${firstName} ${lastName}\nE-mail de l'utilisateur : ${email}\n\nCours :\n${trainingSession}\nPlannig Option : ${planingOption}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        message: "0",
      });
    } else {
      console.log("E-mail envoyé : " + info.response);
      res.status(200).json({ message: "1" });
    }
  });
});
//Bussiness Logic : Get all Quotes
app.get("/api/administration/quotes", (req, res) => {
  console.log("here in BL : Get All Quotes");
  Quote.find().then((docs) => {
    console.log("here documents", docs);
    res.status(200).json({ quotes: docs, message: "Success" });
  });
});
//Bussiness Logic:Get Quote By Id
app.get("/api/administration/quotes/:id", (req, res) => {
  console.log("here in BL : Get quote By Id");
  Quote.findOne({ _id: req.params.id }).then((doc) => {
    res.status(200).json({ quote: doc });
  });
});

//Bussiness Logic : Sending response  For a  Quote
app.post("/api/administration/send-response-quote", (req, res) => {
  const {
    firstName,
    lastName,
    email,
    planingOption,
    description,
    categoryName,
    date,
    categoryPrice,
  } = req.body;
  const mailOptions = {
    from: "admin@example.com",
    to: email,
    subject: "Response For a  Quote",
    text: ` Objet : Réponse à votre demande de devis || ${date}\n
    Cher(e) ${firstName} ${lastName},
    On vous remercie sincèrement pour l'intérêt que vous portez à notre école de formation,\n
    et pour votre demande de devis concernant le cours que vous souhaitez suivre.:${categoryName}.\n
    Suite a votre choix du planning :${planingOption},${description}\n
    En ce qui concerne les tarifs, nous avons établi un prix compétitif de [${categoryPrice}].\n
    De plus, nous comprenons que le paiement peut être un facteur important pour nos étudiants,\n
    c'est pourquoi nous offrons la possibilité de répartir le coût total en 4 tranches égales.\n
    Vous pouvez choisir cette option de paiement pour faciliter la gestion de votre budget.

    Si vous avez d'autres questions ou si vous souhaitez discuter de certains détails spécifiques à votre formation,\n
    n'hésitez pas à nous contacter à [22241420/22000111].\n
    Notre équipe est là pour vous aider à chaque étape du processus.

    Nous sommes impatients de vous accueillir à notre école de formation,\n
    et de vous offrir une expérience d'apprentissage enrichissante.

    Cordialement,`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        message: "0",
      });
    } else {
      Quote.updateOne({ _id: req.body._id }, req.body).then((result) => {
        console.log("herer object after update", result);
        result.nModified == 1
          ? res.json({ message: "1" })
          : res.json({ message: "0" });
      });
    }
  });
});

//Bussiness Logic : Request For an Invoice
app.post("/api/administration/request-invoice", (req, res) => {
  const { firstName, lastName, email, className, categoryName } = req.body;
  const mailOptions = {
    from: email,
    to: "admin@example.com", // L'adresse e-mail de l'administrateur
    subject: "Request For an Invoice",
    text: ` Nom de l'utilisateur : ${firstName} ${lastName}\nE-mail de l'utilisateur : ${email}\n\nGroup :\n${className}\n\n\nCourses :\n${categoryName}\n`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        message: "0",
      });
    } else {
      console.log("E-mail envoyé : " + info.response);
      res.status(200).json({ message: "1" });
    }
  });
});

//Bussiness Logic : Sending  Invoice
app.post("/api/administration/send-invoice", (req, res) => {
  const { nameUser, email, groupName, categoryName, summaryPayment } = req.body;
  const mailOptions = {
    from: "admin@example.com",
    to: email,
    subject: "Request For an  Invoice",
    text: `Dear : ${nameUser} \nRegistered in the session: ${groupName} in the course: ${categoryName}\n
    You have successfully made the : ${summaryPayment}\n
    An email containing an attached invoice has been sent as per your request.\n
    Sincerely\n
    Service Administration`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        message: "0",
      });
    } else {
      console.log("E-mail envoyé : " + info.response);
      res.status(200).json({ message: "1" });
    }
  });
});

//Bussiness Logic : Get  all payements
app.get("/api/administration/payements", (req, res) => {
  console.log("here in BL : Get All Payements");
  Payement.find().then((docs) => {
    console.log("here documents", docs);
    res.status(200).json({ payements: docs, message: "Success" });
  });
});

//Bussiness Logic:Get Payement By Id
app.get("/api/administration/payements/:id", (req, res) => {
  console.log("here in BL : Get payement By Id");
  Payement.findOne({ _id: req.params.id }).then((doc) => {
    res.status(200).json({ payement: doc });
  });
});

//Bussiness Logic:Get Payement By Student Id and Group Id
app.get(
  "/api/administration/payements/students/:idStudent/:idGroup",
  (req, res) => {
    console.log("here in BL : Get payement By Student Id");
    Payement.findOne({
      userId: req.params.idStudent,
      groupId: req.params.idGroup,
    }).then((doc) => {
      res.status(200).json({ payement: doc });
    });
  }
);
//Bussiness Logic:Get all Payements By Student Id
app.get("/api/administration/payements/students/:id", (req, res) => {
  console.log("here in BL : Get payements By Student Id");
  Payement.find({
    userId: req.params.id,
  }).then((doc) => {
    res.status(200).json({ payements: doc });
  });
});

//Bussiness Logic : Make a payement
app.post("/api/administration/payement", (req, res) => {
  let obj = new Payement(req.body);
  obj.save();
  res.json({ message: "1" });
});

// Bussiness Logic : payment update
app.put("/api/administration/payement", (req, res) => {
  Payement.updateOne({ _id: req.body._id }, req.body).then((result) => {
    console.log("herer object after update", result);
    result.nModified == 1
      ? res.json({ message: "1" })
      : res.json({ message: "0" });
  });
});

// //Bussiness Logic :Put Status Quote
// app.put("/api/quotes", (req, res) => {
//   Quote.updateOne({ _id: req.body._id }, req.body).then((response) => {
//     if (response.nModified == 1) {
//       res.json({ message: "1" });
//     } else {
//       res.json({ message: "0" });
//     }
//   });
// });

//_________________________________________________________________________________________________

//Business Logic get all teachers
app.get("/api/users/teachers", (req, res) => {
  console.log("here into bl : get all teachers");
  User.find({ role: "teacher" }).then((docs) => {
    res.json({ teachersTab: docs });
  });
});
//Business Logic Search teachers By Specialite
app.get("/api/users/teachers/:specialite", (req, res) => {
  const specialiteQuery = new RegExp(req.params.specialite, "i");
  // 'i' pour une recherche insensible à la casse
  User.find({ role: "teacher", specialite: specialiteQuery }).then((docs) => {
    res.json({ usersTab: docs });
  });
});
//Business Logic get all students
app.get("/api/users/students", (req, res) => {
  console.log("here into bl : get all students");
  User.find({ role: "student" }).then((docs) => {
    res.json({ usersTab: docs });
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
//Business Logic: validate teacher By Id
app.put("/api/users", (req, res) => {
  User.findByIdAndUpdate(
    req.body._id,
    { $set: { validity: "Valid" } },
    { new: true },
    (err, updateUser) => {
      if (err) {
        console.error(err);
      } else {
        res.json({ message: "1" });
        console.log("teacher mis à jour :", updateUser);
      }
    }
  );
});
//Business Logic: Delete User By Id
app.delete("/api/users/:id", (req, res) => {
  console.log("here in BL : Delete Users By Id");
  let id = req.params.id;
  User.deleteOne({ _id: id }).then((result) => {
    console.log("here result", result);
    result.deletedCount == 1
      ? res.json({ message: "1" })
      : res.json({ message: "0" });
  });
});
//-----------------------------------------------------------------------------------------//
//Bussiness Logic Groupes Begin
//Bussiness Logic:Get all Groups
app.get("/api/groups", (req, res) => {
  console.log("here in BL : Get All Groupes");
  Group.find().then((docs) => {
    console.log("here documents", docs);
    res.status(200).json({ groups: docs, message: "Success" });
  });
});

//Bussiness Logic:Get Groupe By Id
app.get("/api/groups/:id", (req, res) => {
  console.log("here in BL : Get Groupe By Id");
  let id = req.params.id;
  Group.findOne({ _id: id }).then((doc) => {
    res.status(200).json({ group: doc });
  });
});
//Get Group By student ID
app.get("/api/groups/students/:id", (req, res) => {
  console.log("here in BL : Get Group By Id Student");
  Group.findOne({ studentsId: { $in: [req.params.id] } }).then((doc) => {
    res.status(200).json({ group: doc });
    console.log("here", doc);
  });
});
//Get Classes By student ID
app.get("/api/groups/students/classes/:id", (req, res) => {
  console.log("here in BL : Get Classes By Id Student");
  Group.find({ studentsId: { $in: [req.params.id] } }).then((doc) => {
    res.status(200).json({ groups: doc });
    console.log("here", doc);
  });
});
//Get Group By Teacher ID
app.get("/api/groups/teachers/:id", (req, res) => {
  console.log("here in BL : Get Group By Id Teacher");
  Group.findOne({ teachersId: { $in: [req.params.id] } }).then((doc) => {
    res.status(200).json({ group: doc });
    console.log("here", doc);
  });
});
//Get Group By category ID
app.get("/api/groups/category/:id", (req, res) => {
  console.log("here in BL : Get Group By Id Category");
  Group.findOne({ categoryId: req.params.id }).then((doc) => {
    res.status(200).json({ group: doc });
    console.log("here", doc);
  });
});

//Bussiness Logic: Add  Groupe
app.post("/api/groups", (req, res) => {
  console.log("here in BL : Add Groupe  ");
  let obj = new Group(req.body);
  obj.save();
  res.json({ message: "1" });
});
//Bussiness Logic: Edit  Groupe
app.put("/api/groups", (req, res) => {
  console.log("here in BL : Edit Groupe  ", req.body);
  Group.updateOne({ _id: req.body._id }, req.body).then((result) => {
    console.log("herer object after update", result);
    result.nModified == 1
      ? res.json({ message: "1" })
      : res.json({ message: "0" });
  });
});
//Business Logic: Delete group By Id
app.delete("/api/groups/:id", (req, res) => {
  console.log("here in BL : Delete group By Id");
  Group.deleteOne({ _id: req.params.id }).then((result) => {
    console.log("here result", result);
    result.deletedCount == 1
      ? res.json({ message: "1" })
      : res.json({ message: "0" });
  });
});
//Bussiness Logic Groupes End
//------------------------------------------------------------------------------------------------//
//Bussiness Logic : Get all Category of cours
app.get("/api/category", (req, res) => {
  console.log("here in BL : Get All Category");
  Category.find().then((docs) => {
    console.log("here documents", docs);
    res.status(200).json({ categories: docs, message: "1" });
  });
});

//Get Category By  ID
app.get("/api/category/:id", (req, res) => {
  console.log("here in BL : Get Category By Id ");
  Category.findOne({ _id: req.params.id }).then((doc) => {
    res.status(200).json({ category: doc });
  });
});
//Get Categories By  course ID
app.get("/api/category/cours/:id", (req, res) => {
  console.log("here in BL : Get Categories By cours Id ");
  Category.find({ coursesId: req.params.id }).then((doc) => {
    res.status(200).json({ categories: doc });
  });
});
//Business Logic Search category By Name Or description
app.get("/api/category/research/:search", (req, res) => {
  const specialiteQuery = new RegExp(req.params.search, "i");
  // 'i' pour une recherche insensible à la casse
  Category.find({
    $or: [{ name: specialiteQuery }, { description: specialiteQuery }],
  }).then((docs) => {
    res.json({ categoriesTab: docs });
  });
});

//Bussiness Logic: Add  Category of course
app.post(
  "/api/category",
  multer({ storage: storageConfig }).single("photo"),
  (req, res) => {
    console.log("here in BL : Add category  ");
    req.body.photo = `${req.protocol}://${req.get("host")}/myImages/${
      req.file.filename
    }`;
    let obj = new Category(req.body);
    obj.save();
    res.json({ message: "1" });
  }
);

//Bussiness Logic: Edit category of cours
app.put("/api/category", (req, res) => {
  console.log("here in BL : Edit Category  ", req.body);
  Category.updateOne({ _id: req.body._id }, req.body).then((result) => {
    console.log("herer object after update", result);
    result.nModified == 1
      ? res.json({ message: "1" })
      : res.json({ message: "0" });
  });
});

//Business Logic: Delete Category of cours By Id
app.delete("/api/category/:id", (req, res) => {
  console.log("here in BL : Delete Category By Id");
  Category.deleteOne({ _id: req.params.id }).then((result) => {
    console.log("here result", result);
    result.deletedCount == 1
      ? res.json({ message: " 1" })
      : res.json({ message: "0" });
  });
});
//----------------------------------------------------------------------------------------------//
//Bussiness Logic Cours Begin

//Bussiness Logic:Get all Cours
app.get("/api/cours", (req, res) => {
  console.log("here in BL : Get All Cours");
  Cours.find().then((docs) => {
    console.log("here documents", docs);
    res.status(200).json({ courses: docs, message: "Success" });
  });
});

//Bussiness Logic:Get Cours By teacher Id
app.get("/api/cours/teacher/:techerId", (req, res) => {
  console.log("here in BL : Get Cours By teacher Id");
  Cours.find({ teacherId: req.params.techerId }).then((doc) => {
    res.status(200).json({ courses: doc });
  });
});
//Bussiness Logic:Get Cours By Id
app.get("/api/cours/:id", (req, res) => {
  console.log("here in BL : Get Cours By Id");
  Cours.findOne({ _id: req.params.id }).then((doc) => {
    res.status(200).json({ cours: doc });
  });
});

//Bussiness Logic: Add  Cours
app.post(
  "/api/cours",
  multer({ storage: storageConfig }).single("photo"),
  async (req, res) => {
    console.log("here in BL : Add Cours  ");
    req.body.photo = `${req.protocol}://${req.get("host")}/myImages/${
      req.file.filename
    }`;
    try {
      let obj = new Cours(req.body);
      await obj.save();
      res.json({ message: "1" });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du cours : ", error);
      res
        .status(500)
        .json({ message: "Erreur lors de l'enregistrement du cours" });
    }
  }
);

//Bussiness Logic: Edit  Cours
app.put("/api/cours", (req, res) => {
  console.log("here in BL : Edit Cours  ", req.body);
  Cours.updateOne({ _id: req.body._id }, req.body).then((result) => {
    console.log("herer object after update", result);
    result.nModified == 1
      ? res.json({ message: "1" })
      : res.json({ message: "0" });
  });
});

//Business Logic: Delete Cours By Id
app.delete("/api/cours/:id", (req, res) => {
  console.log("here in BL : Delete Cours By Id");
  Cours.deleteOne({ _id: req.params.id }).then((result) => {
    console.log("here result", result);
    result.deletedCount == 1
      ? res.json({ message: "1" })
      : res.json({ message: "0" });
  });
});
//Bussiness Logic Cours End

//make application exportables
module.exports = app;
