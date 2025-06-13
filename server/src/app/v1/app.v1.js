import passport from "passport";
import passportJWT from "passport-jwt";
import express from 'express';
import config from "../../../../config.js";
const { Strategy: JwtStrategy, ExtractJwt } = passportJWT;

// file deepcode ignore DisablePoweredBy:  
const app = express();

import dataLakeRouter from "./routes/dataLake.routes.js";
const passportStrategy = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.SECRET_KEY,
}, (jwt_payload, next) => {
    console.log(jwt_payload)
    next(null, jwt_payload)
});

passport.use(passportStrategy);

app.use('/api', dataLakeRouter);
export default app;
