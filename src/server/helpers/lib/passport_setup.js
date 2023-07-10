const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const { Authentication } = require("../../services");

const initPassport = ({ db, app }) => {
  passport.use(
    "signUp",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async function (req, email, password, done) {
        try {
          let auth = new Authentication({ db });
          let result = await auth.register({
            email,
            password,
            passwordConfirmation: req.body.confirmation,
          });
          if (result.success) {
            return done(
              null,
              { email: email, userId: result.userId },
              { message: result.message }
            );
          } else {
            return done(null, false, { message: result.message });
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    "signIn",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async function (email, password, done) {
        try {
          let auth = new Authentication({ db });
          let result = await auth.login({ email, password });
          if (result.success) {
            return done(
              null,
              { email, userId: result.userId },
              { message: result.message }
            );
          } else {
            return done(null, false, result.message);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    "jwt",
    new JWTstrategy(
      {
        secretOrKey: "TOP_SECRET",
        jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token"),
      },
      async (token, done) => {
        try {
          return done(null, token.user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
  app.use(passport.initialize());
};

module.exports = Object.assign({}, { initPassport });
