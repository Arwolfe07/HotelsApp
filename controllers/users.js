const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.createNewUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Hotels Site!');
            res.redirect('/hotels');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.userLogin = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/hotels';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
    })
    req.flash('success', 'GoodBye!');
    res.redirect('/hotels');
}
