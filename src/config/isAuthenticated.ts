import passportJwt, { ExtractJwt } from 'passport-jwt';
import UserService from 'services/user.service';
import passport, { PassportStatic } from 'passport';

const userService = new UserService();

const isAuthenticated = (localPassport: PassportStatic) => {
    localPassport.use(
        new passportJwt.Strategy(
            {
                secretOrKey: process.env.SECRET,
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            },
            async (payload, done) => {
                try {
                    const user = await userService.getById(payload.user);
                    if (user !== null) return done(null, { id: user._id, role: user.role });

                    return done(null, false);
                } catch (err) {
                    return done(err, false);
                }
            },
        ),
    );
};

isAuthenticated.isLoggedIn = passport.authenticate('jwt', { session: false });

export default isAuthenticated;
