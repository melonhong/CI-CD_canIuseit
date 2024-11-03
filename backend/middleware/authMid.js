function ensureAuthenticated(req, res, next) {
  console.log('authMid 실행됨'); // 미들웨어 실행 확인

  if (req.isAuthenticated && req.isAuthenticated()) {
      console.log('Authenticated user:', req.user); // 유저 정보 출력
      return next();
  } else {
      console.log('User not authenticated');
      
      // 요청된 경로가 '/look'인 경우 경고 메시지를 표시합니다.
      if (req.originalUrl === '/look') {
          res.render('look', { user: null, products: [], warning: '로그인 후 이용해주세요.' });
      } else {
          res.status(401).redirect('/login'); // 인증되지 않은 경우 로그인 페이지로 리다이렉트
      }
  }
}

module.exports = { ensureAuthenticated };