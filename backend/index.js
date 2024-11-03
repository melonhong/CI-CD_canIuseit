const dotenv = require('dotenv').config();
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const flash = require('connect-flash');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/productRoutes');
const lookRoutes = require('./routes/lookRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const sequelize = require('./config/database');
const { initDb } = require('./models/initDb');
const { ensureAuthenticated } = require('./middleware/authMid');
require('./config/passport-setup');
const axios = require('axios');

const app = express();

// CORS 설정
app.use(cors({
    origin: 'http://localhost:3000',
}));

// 세션 설정
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: sequelize,
    })
}));

app.use(express.static(path.join(__dirname, '..', 'frontend', 'resources')));

// 미들웨어 및 기타 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport 미들웨어 설정
app.use(passport.initialize());
app.use(passport.session());

// Body Parser 미들웨어 설정
app.use(bodyParser.json());

// 플래시 메시지 설정
app.use(flash());
app.use((req, res, next) => {
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// 라우트 설정
app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/look', lookRoutes);
app.use('/calendar', calendarRoutes);

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, '..', 'frontend', 'resources')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// EJS 템플릿 엔진 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'frontend', 'views'));

// 기본 라우트 설정
app.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

// /look 경로를 lookRoutes.js에서 처리하도록 연결
app.use('/look', lookRoutes);

app.get('/calendar', (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }
    res.render('calendar', { user: req.user });
});

app.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});

// 세션 설정
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: sequelize,
    }),
    cookie: { secure: false }  // HTTPS 사용 시 true로 설정
}));

// 보호된 라우트 예시 (로그인 필요)
app.get('/protected', ensureAuthenticated, (req, res) => {
    res.send('This is a protected route');
});

const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
        // 데이터베이스 연결 확인
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // 데이터베이스 초기화
        await initDb();
        
        // 서버 시작
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
