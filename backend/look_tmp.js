const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('pdfkit');
const { google } = require('googleapis');
const { Product } = require('./models'); // Sequelize 모델 불러오기
require('dotenv').config();

// Express 앱 생성
const app = express();
app.use(bodyParser.json());

// Google Calendar API 설정
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });


// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});