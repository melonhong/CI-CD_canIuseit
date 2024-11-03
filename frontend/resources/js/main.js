// main.js

window.onload = function() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (code) {
    // OAuth2 인증 코드를 처리하는 로직을 여기에 추가
    fetch('/auth/google/callback?code=' + code)
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('oauthToken', data.token);
          window.location.href = '/';
        }
      })
      .catch(error => console.error('Error:', error));
  }

  // 로그아웃 버튼이 있는 경우 로그아웃 이벤트 리스너 추가
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', logout);
  }
};

function logout() {
  console.log('Logout button clicked'); // 로그아웃 버튼 클릭 로그
  fetch('/auth/logout')
    .then(response => {
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        console.error('Failed to log out');
      }
    })
    .catch(error => console.error('Error:', error));
}

function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('oauthToken');
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }
  return fetch(url, options);
}
