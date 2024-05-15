import pkg from 'passport-jwt';
import GoogleStrategy from 'passport-google-oauth2';
import config from './config.js';
import tokenTypes from './tokens.js';
import { User, TempUser } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import { userService } from '../services/index.js';

const { Strategy, ExtractJwt } = pkg;

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new Strategy(jwtOptions, jwtVerify);

const googleStrategy = new GoogleStrategy(
  {
    clientID: config.googleAuth.client_id,
    clientSecret: config.googleAuth.client_secret,
    callbackURL: 'http://127.0.0.1:3000/auth/google/callback',
    passReqToCallback: true,
  },
  function (request, accessToken, refreshToken, profile, done) {
    TempUser.findOne({ social_login_id: profile.id }).then((existingUser) => {
      if (existingUser) {
        // done(null, existingUser)
        throw new ApiError('User already exist!');
      } else {
        userService
          .createUser({
            social_login_id: profile.id,
            fullname: profile.displayName,
            email: profile.email,
            email_verified: true,
            mobile_number: null,
            login_with: profile.provider,
          })
          .then((newUser) => {
            return done(null, newUser);
          });
      }
    });
  }
);

export { jwtStrategy, googleStrategy };
