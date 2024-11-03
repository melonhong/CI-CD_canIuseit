const express = require('express');
const router = express.Router();
const axios = require('axios');
const calendarController = require('../controllers/calendarController');
const { ensureAuthenticated } = require('../middleware/authMid'); // 인증 미들웨어 임포트

// UID 생성 함수 정의
function generateUID() {
    const uuid = URL.createObjectURL(new Blob()).slice(-36);  // UUID 생성
    const domain = "sample.com";  // 도메인 부분은 실제 사용하는 도메인으로 대체
    return `${uuid}@${domain}`;
}

// GET 라우트: 클라이언트에서 일정 데이터를 가져오기 위해 호출
router.get('/events', calendarController.getCalendarEvents);

// DELETE 라우트: 이벤트 삭제
router.delete('/events/:calendarId', ensureAuthenticated, calendarController.deleteCalendarEvent);

// POST 라우트: 클라이언트에서 전달된 캘린더 이벤트를 저장 및 네이버 캘린더에 동기화
router.post('/', async (req, res) => {
  try {
    await calendarController.calendar(req, res);

    if (res.headersSent) return;

    const accessToken = req.session.accessToken;

    if (!accessToken) {
      return res.status(401).json({ error: '먼저 네이버를 통해 로그인해야 합니다.' });
    }

    const { alias: title, start } = req.body;
    const uid = generateUID();  // UID를 생성하여 사용

    try {
      const scheduleIcalString = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:Naver Calendar
CALSCALE:GREGORIAN
BEGIN:VTIMEZONE
TZID:Asia/Seoul
BEGIN:STANDARD
DTSTART:19700101T000000
TZNAME:GMT+09:00
TZOFFSETFROM:+0900
TZOFFSETTO:+0900
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
UID:${uid}
DTSTART;TZID=Asia/Seoul:20240815T090000
SUMMARY:999
DESCRIPTION:Your Event Description Here
LOCATION:Online
CREATED:20240815T000000
LAST-MODIFIED:20240815T000000
DTSTAMP:20240815T000000
END:VEVENT
END:VCALENDAR`;

      const response = await axios.post(
        'https://openapi.naver.com/calendar/createSchedule.json',
        { calendarId: 'defaultCalendarId', scheduleIcalString: scheduleIcalString },
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );

      if (response.data.result === 'success') {
        return res.status(200).json({ message: '이벤트가 성공적으로 저장되고 네이버 캘린더와 동기화되었습니다.' });
      } else {
        if (!res.headersSent) {
          return res.status(500).json({ error: '네이버 캘린더와 동기화에 실패했습니다.' });
        }
      }
    } catch (error) {
      return res.status(500).json({ error: 'iCalendar 데이터 생성 중 오류가 발생했습니다.' });
    }
  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({ error: '이벤트 저장 중 오류가 발생했습니다.' });
    }
  }
});

module.exports = router;
