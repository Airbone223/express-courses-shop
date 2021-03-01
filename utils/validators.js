const {body} = require('express-validator')
const User = require('../models/user')
const bcrypt = require('bcryptjs')


const passwordMin = 3
const passwordMax = 40
const nameMin = 4
const nameMax = 25

exports.registerValidators = [
    body('email').isEmail().withMessage('Введите корректный email')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value})
                if (user) {
                    return Promise.reject('Пользователь с таким email уже зарегистрирован')
                }
            } catch (e) {
                console.log(e)
            }
        })
        .trim(),
    body('password', `Пароль должен быть от ${passwordMin} до ${passwordMax} символов`)
        .isLength({min: passwordMin, max: passwordMax})
        .isAlphanumeric(),
    body('repeat').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw  new Error('Пароли не совпадают')
        }
        return true
    }),
    body('name', `Имя должно быть не короче ${nameMin} символов`)
        .isLength({min: nameMin, max: nameMax})
        .trim()
]


exports.loginValidators = [
    body('email')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value})
                if (!user) {
                    return Promise.reject('Пользователь с таким email незарегистрирован')
                }
            } catch (e) {
                console.log(e)
            }
        })
        .trim(),
    body('password')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: req.body.email})
                const isSame = await bcrypt.compare(value, user.password)
                if (!isSame) {
                    return Promise.reject('Пароль неверный')
                }
            } catch (e) {
                console.log(e)
            }
        })
]

exports.courseValidators = [
    body('title').isLength({min: 3}).withMessage('Минимальная длина названия 3 символа'),
    body('price').isLength({min: 1}).isNumeric().withMessage('Цена должна состоять минимум из одной цифры'),
    body('img', 'Введите корректный URL картинки').isURL(),
    body('description').isLength({min: 3}).withMessage('Минимальная длина описания 3 символа'),
    body('fullDescription').isLength({min: 20}).withMessage('Полное описание должно содержать минимум 20 символов'),
]
