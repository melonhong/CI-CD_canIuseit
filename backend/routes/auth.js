const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { ensureAuthenticated } = require('../middleware/authMid'); // ensureAuthenticated로 변경

// 세션 및 사용자 정보 로깅 미들웨어 추가
router.use((req, res, next) => {
  console.log('Session:', req.session);
  console.log('User:', req.user);
  next();
});

// Google 로그인 라우트
router.get('/google', authController.googleLogin);
router.get('/google/callback',
  authController.googleCallback,
  authController.googleCallbackSuccess
);

// 보호된 라우트 예시
router.get('/protected', ensureAuthenticated, (req, res) => { // ensureAuthenticated로 변경
  res.send('This is a protected route');
});

// Naver 로그인 라우트
router.get('/naver', (req, res, next) => {
  console.log('Naver login request');
  next();
}, authController.naverLogin);

router.get('/naver/callback', (req, res, next) => {
  console.log('Naver callback request');
  console.log('Query:', req.query); // 추가: 쿼리 파라미터 로그
  next();
}, authController.naverCallback, authController.naverCallbackSuccess);
// 에러 로깅 추가

// 로그아웃 라우트 추가
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err); // 로그아웃 에러 로그
            return next(err);
        }
        req.session.destroy(() => {
            console.log('Session destroyed'); // 세션 삭제 로그
            res.redirect('/login'); // 세션을 삭제한 후 로그인 페이지로 리디렉션
        });
    });
});

module.exports = router;
