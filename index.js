const express = require('express')
const path = require('path')
const csrf = require('csurf')
const helmet = require('helmet')
const compression = require('compression')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const Handlebars = require('handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const coursesRoutes = require('./routes/courses')
const addRoutes = require('./routes/add')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const errorHandler = require('./middleware/error')
const fileMiddleware = require('./middleware/file')
const keys = require('./keys/index')


const app = express()
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: require('./utils/hbs-helpers')
})
const store = new MongoStore({
    collection: 'session',
    uri: keys.MONGODB_URI,
    connectionOption: {useUnifiedTopology: true}
})


app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    store
}))
app.use(fileMiddleware.single('avatar'))
app.use(csrf())
app.use(flash())
app.use(helmet())
app.use(compression())
app.use(varMiddleware)
app.use(userMiddleware)
app.use('/', homeRoutes)
app.use('/courses', coursesRoutes)
app.use('/add', addRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)
app.use(errorHandler)


const PORT = process.env.PORT || 3000

async function start() {
 try {
     await mongoose.connect(keys.MONGODB_URI, {
         useNewUrlParser: true,
         useFindAndModify: false
     })
     app.listen(PORT, () => {
         console.log(`Server is running on port ${PORT}`)
     })
 } catch (e) {
     console.log(e)
 }
}

start()





