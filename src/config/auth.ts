import passportJwt, { ExtractJwt } from 'passport-jwt';
import UserService from 'services/user.service';
import { PassportStatic } from 'passport';

const userService = new UserService();

const auth = (passport: PassportStatic) => {
    passport.use(
        new passportJwt.Strategy(
            {
                secretOrKey: process.env.SECRET,
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            },
            async (payload, done) => {
                try {
                    const user = await userService.getById(payload.sub);
                    if (user !== null) return done(null, user);

                    return done(null, false);
                } catch (err) {
                    return done(err, false);
                }
            },
        ),
    );
};

export default auth;
