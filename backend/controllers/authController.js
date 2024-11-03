const passport = require('passport');

// 구글 로그인 처리
exports.googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] });

// 구글 로그인 콜백 처리
exports.googleCallback = passport.authenticate('google', { failureRedirect: '/' });

// 구글 로그인 성공 후 처리
exports.googleCallbackSuccess = (req, res) => {
  console.log('Google User:', req.user);  // 로그인한 사용자 정보 출력
  req.login(req.user, (err) => {
    if (err) {
      return res.redirect('/login');
    }
    return res.redirect('/'); // 로그인 후 메인 페이지로 리다이렉트
  });
};

// 네이버 로그인 처리
exports.naverLogin = passport.authenticate('naver');

// 네이버 로그인 콜백 처리
exports.naverCallback = passport.authenticate('naver', { failureRedirect: '/', failureFlash: true });

// 네이버 로그인 성공 후 처리
exports.naverCallbackSuccess = (req, res) => {
  console.log('Naver User:', req.user);  // 로그인한 사용자 정보 출력
  req.session.accessToken = req.user.accessToken;  // 세션에 accessToken 저장
  console.log('Access Token saved in session:', req.session.accessToken); // 로그 추가
  req.login(req.user, (err) => {
    if (err) {
      console.error('Login error:', err); // 로그인 에러 로그
      return res.redirect('/login');
    }
    return res.redirect('/'); // 로그인 후 메인 페이지로 리다이렉트
  });
};

// 사용자 정보 반환
exports.getUserProfile = (req, res) => {
  res.json(req.user);
};
