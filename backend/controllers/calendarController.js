const Calendar = require('../models/Calendar');

/* 캘린더 이벤트 저장 (POST 요청): /calendar 에서 처리 */
exports.calendar = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('Unauthorized');
        }

        const userId = req.user.userId;
        const events = Array.isArray(req.body) ? req.body : [req.body];

        for (const event of events) {
            await Calendar.create({
                alias: event.alias,
                start: event.start,
                userId: userId,
                backgroundColor: event.backgroundColor,
            });
        }
        res.status(200).send('Calendar events created successfully');
    } catch (error) {
        res.status(500).send('Failed to create calendar events');
    }
};

/* 캘린더 이벤트 삭제 (DELETE 요청): /calendar/events/:id 에서 처리 */
exports.deleteCalendarEvent = async (req, res) => {
    try {
        const calendarId = req.params.calendarId;
        console.log('Received calendar ID:', calendarId);
        const userId = req.user.userId;

        // 이벤트가 현재 유저의 것인지 확인 후 삭제
        const event = await Calendar.findOne({
            where: {
                calendarId: calendarId,
                userId: userId,
            },
        });

        if (!event) {
            console.log('Event not found');
            return res.status(404).send('Event not found');
        }

        await event.destroy();
        console.log('Event deleted successfully');
        res.status(200).send('Event deleted successfully');
    } catch (error) {
        console.error('Failed to delete calendar event:', error); // 구체적인 에러 로그 출력
        res.status(500).send('Failed to delete calendar event');
    }
};


/* 캘린더 이벤트 조회 (GET 요청): /calendar/events 에서 처리 */
exports.getCalendarEvents = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send('Unauthorized');
        }

        const userId = req.user.userId;
        const events = await Calendar.findAll({
            where: {
                userId: userId
            }
        });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).send('Failed to fetch calendar events');
    }
};