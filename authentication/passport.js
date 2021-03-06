const { use } = require("passport");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const connection = require("../models/user");
const validatePassword = require("./passwordUtils").validatePassword;
const User = connection.models.User;

const verifyCallback = async (username, password, done) => {
  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return done(null, false);
    }

    const isValid = validatePassword(password, user.hash, user.salt);

    if (!isValid) {
      return done(null, false);
    }

    if (isValid) {
      return done(null, user);
    }
  } catch (err) {
    done(err);
  }
};

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await User.findById(userId);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
