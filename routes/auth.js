const {Router} = require('express')
const {validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const router = Router()
const {registerValidators, loginValidators} = require('../utils/validators')


router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
})

router.post('/login', loginValidators, async (req, res) => {
    try {
        const {email, password} = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('loginError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#login')
        }
        const user = await User.findOne({email})
        req.session.user = user
        req.session.isAuthenticated = true
        req.session.save(err => {
            if (err) {
                throw err
            }
            res.redirect('/')
        })
    } catch (e) {
        console.log(e)
    }

})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/register', registerValidators, async (req, res) => {
    try {
        const {email, password, name} = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register')
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({
            email, name, password: hashPassword, cart: {items: []}
        })
        await user.save()
        res.redirect('/auth/login#login')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router
