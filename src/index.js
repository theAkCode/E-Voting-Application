const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(express.static("public"));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.set('view engine', 'ejs');


mongoose.connect('YOUR CONNECTION STRING', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch(err => {
    console.log("Error connecting to database: ", err);
  });


const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});


const User = mongoose.model('User', UserSchema);


app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});


app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("Username already taken!");
    }

    
    const newUser = new User({ username, password });
    await newUser.save();

    console.log("User registered:", newUser);
    res.redirect("/login"); 
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error during registration.");
  }
});


app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send("Invalid username or password.");
    }

    
    if (user.password !== password) {
      return res.status(400).send("Invalid username or password.");
    }

    
    res.redirect("/voting"); 
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error during login.");
  }
});


app.get("/voting", (req, res) => {
  res.render("voting");
});
app.get("/thank-you", (req, res) => {
  res.render("thank-you");
});
app.get("/results", (req, res) => {
  res.render("results");
});
app.get("/genderchart", (req, res) => {
  res.render("genderchart");
});
app.get("/voucher", (req, res) => {
  res.render("voucher");
});
app.get("/support", (req, res) => {
  res.render("support");
});
app.get("/feedback", (req, res) => {
  res.render("feedback");
});
app.get("/datafeedback", (req, res) => {
  res.render("datafeedback");
});
app.get("/supportreply", (req, res) => {
  res.render("supportreply");
});



const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
