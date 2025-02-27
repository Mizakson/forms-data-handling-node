// controllers/usersController.js
const usersStorage = require("../storages/usersStorage");
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const emailErr = "must be in valid address format. (ex. username@site.com)";
const ageErr = "must be between 18 and 120";
const bioErr = "must be at most 200 characters"

exports.usersListGet = (req, res) => {
  res.render("index", {
    title: "User list",
    users: usersStorage.getUsers(),
  });
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
  });
};

exports.usersCreatePost = (req, res) => {
  const { firstName, lastName, email } = req.body;
  usersStorage.addUser({ firstName, lastName, email });
  res.redirect("/");
};

const validateUser = [
  body("firstName").trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
  body("lastName").trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
  body("email").trim()
    .isEmail().withMessage(`Email ${emailErr}`),
  body("age").trim()
    .optional({checkFalsy: true})
    .isInt({ min: 18, max: 120}).withMessage(`Age ${ageErr}`),
  body("bio").trim()
    .optional({checkFalsy: true})
    .isLength({max: 120}).withMessage(`Bio ${bioErr}`)
];

exports.usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.addUser({ firstName, lastName, email, age, bio });
    res.redirect("/");
  }
];

exports.usersUpdateGet = (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    res.render("updateUser", {
      title: "Update user",
      user: user,
    });
  };
  
  exports.usersUpdatePost = [
    validateUser,
    (req, res) => {
      const user = usersStorage.getUser(req.params.id);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("updateUser", {
          title: "Update user",
          user: user,
          errors: errors.array(),
        });
      }
      const { firstName, lastName, email, age, bio } = req.body;
      usersStorage.updateUser(req.params.id, { firstName, lastName, email, age, bio });
      res.redirect("/");
    }
  ];


exports.usersDeletePost = (req, res) => {
    usersStorage.deleteUser(req.params.id);
    res.redirect("/");
  };

exports.usersSearchGet = (req, res) => {
  const firstName = req.query.firstName
  const lastName = req.query.lastName

  for (const users in usersStorage) {
    const userObj = usersStorage[users]
    for (const prop in userObj) {
      const matchedUser = userObj[prop]["id"]
      if (userObj[prop]["firstName"] === firstName && userObj[prop]["lastName"] === lastName) {
        res.render("search", {
          title: "Search result",
          user: usersStorage.getUser(matchedUser),
        })
      }
      else {
        res.render("searchError", {
          title: "Search Error",
        })
      }
    }
  }
  


}