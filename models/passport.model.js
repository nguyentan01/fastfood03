const localStrategy = require('passport-local').Strategy
const userModel = require('./user.model')
const brypt = require('bcrypt')
const githubStrategy = require('passport-github').Strategy
const googleStrategy = require('passport-google-oauth20').Strategy
module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id)
            return done(null, user)
        } catch (e) {
            console.log(e)
            return done(e)
        }
    })

    passport.use(new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async function (email, password, done) {
            const user = await userModel.findOne({ 'email': email })
            if (!user) {
                return done(null, false, { message: "No user with that email" })
            }
            try {
                if (await bcrypt.compare(password, user.password)) {
                    return done(null, user, { message: "Login successfully" })
                }
                return done(null, false, { message: "password incorrect" })
            } catch (e) {
                return done(e)
            }
        }
    ))

    passport.use(new githubStrategy({
        clientID: "0f4b68c73cd8ce8e5aa5",
        clientSecret: "dce050a59a4bb5b9fca64b67735b13ccecb5443f",
        callbackURL: "process.env.PORT/user/github/callback"
    },
        async function (accessToken, refreshToken, profile, done) {
            console.log(profile)
            try {
                const user = await userModel.findOne({ email: profile._json.email })
                if (user) return done(null, user)
                const newUser = new userModel({
                    username: profile._json.login,
                    email: profile._json.url,
                    pasword: ""
                })
                await newUser.save()
                return done(null, newUser)
            } catch (e) {
                console.log(e.message)
                return done(e)
            }

        }
    ))

    passport.use(new googleStrategy({
        clientID: "204932086780-n5vl3fko9noeeql8aemt9qu2bn8thufo.apps.googleusercontent.com",
        clientSecret: "D_Wvo8W1v1YPldH05FawaY-x",
        callbackURL: "process.env.PORT/user/google/callback"
    },
        async function (accessToken, refreshToken, profile, done) {
            try {
                const user = await userModel.findOne({ email: profile._json.email })
                if (user) return done(null, user)
                const newUser = new userModel({
                    username: profile._json.name,
                    email: profile._json.email,
                    pasword: ""
                })
                await newUser.save()
                return done(null, newUser)
            } catch (e) {
                console.log(e)
                return done(e)
            }

        }
    ))
}
