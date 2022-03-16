const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const util = {};

// Home
router.get("/", function (req, res) {
  res.render("home/welcome");
});

router.get("/socket", function (req, res) {
  res.render("home/socket");
});

router.get("/onlinept", function (req, res) {
  res.render("home/making");
});

router.get("/onlinept/makingone", function (req, res) {
  res.render("home/firstone");
});

router.get("/onlinept/makingtwo", function (req, res) {
  res.render("home/firsttwo");
});

router.get("/onlinept/makingthree", function (req, res) {
  res.render("home/firstthree");
});

router.get("/onlinept/purchase_squat", function (req, res) {
  res.render("home/purchase_squat");
});

util.isLoggedin = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("errors", { login: "로그인을 먼저 해주세요!" });
    res.redirect("/login");
  }
};

router.get("/onlinept/purchase_one", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("home/purchase_one");
  } else {
    req.flash("errors", { login: "로그인을 먼저 해주세요!" });
    res.redirect("/login");
  }
});

router.get("/onlinept/purchase_two", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("home/purchase_two");
  } else {
    req.flash("errors", { login: "로그인을 먼저 해주세요!" });
    res.redirect("/login");
  }
});

router.get("/onlinept/purchase_three", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("home/purchase_three");
  } else {
    req.flash("errors", { login: "로그인을 먼저 해주세요!" });
    res.redirect("/login");
  }
});

// Login
router.get("/login", function (req, res) {
  var username = req.flash("username")[0];
  var errors = req.flash("errors")[0] || {};
  res.render("home/login", {
    username: username,
    errors: errors,
  });
});

// Post Login
router.post(
  "/login",
  function (req, res, next) {
    var errors = {};
    var isValid = true;

    if (!req.body.username) {
      isValid = false;
      errors.username = "아이디를 입력해주세요!";
    }
    if (!req.body.password) {
      isValid = false;
      errors.password = "비밀번호를 입력해주세요!";
    }

    if (isValid) {
      next();
    } else {
      req.flash("errors", errors);
      res.redirect("/login");
    }
  },
  passport.authenticate("local-login", {
    successRedirect: "/posts",
    failureRedirect: "/login",
  })
);

// Logout
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
