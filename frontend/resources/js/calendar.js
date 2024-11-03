var calendar;  // calendar 객체를 전역 변수로 선언
var currentSelectedEventId = null; // 선택된 이벤트 ID 저장 변수
var currentSelectedEventElement = null; // 선택된 이벤트 요소 저장 변수
    
document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');

  // calendar 객체 초기화
  calendar = new FullCalendar.Calendar(calendarEl, {
    height: '700px', // 캘린더 높이 설정
    expandRows: true, // 화면에 맞게 높이 재설정
    slotMinTime: '08:00', // DAY 캘린더에서 시작 시간
    slotMaxTime: '20:00', // DAY 캘린더에서 종료 시간

    customButtons: {
      myCustomButton: {
        text: "일정 추가",
        click: function () {
          // 부트스트랩 모달 열기
          $("#calendarModal").modal("show");
        }
      },
      mySaveButton: {
        text: "저장",
        click: async function () {
          if (confirm("저장하시겠습니까?")) {
            var allEvent = calendar.getEvents();
            const eventData = allEvent.map(event => ({
              alias: event.title,
              start: event.start.toISOString(),
              backgroundColor: event.backgroundColor
            }));

            // 이벤트 저장하기
            const saveEvent = await axios.post('/calendar', eventData);
            console.log('Event saved:', saveEvent);
          }
        }
      },
      // 삭제 버튼 클릭 시
      myDeleteButton: {
        text: "삭제",
        click: function () {
          console.log('삭제 버튼 클릭');
          if (currentSelectedEventId) {
            if (confirm("정말로 이 일정을 삭제하시겠습니까?")) {
              const selectedEvent = calendar.getEventById(currentSelectedEventId);
              
              if (selectedEvent) {
                console.log('삭제할 이벤트:', selectedEvent);
      
                // 서버에 삭제 요청
                axios.delete(`/calendar/events/${currentSelectedEventId}`)
                  .then(function (response) {
                    console.log('이벤트 삭제 성공:', response);
      
                    // 캘린더에서 이벤트 삭제
                    selectedEvent.remove();
      
                    // 페이지 새로고침
                    location.reload(); // 이벤트 삭제 후 페이지 새로고침
                  })
                  .catch(function (error) {
                    console.error('이벤트 삭제 중 오류 발생:', error);
                  });
              } else {
                console.log('선택된 이벤트가 존재하지 않습니다.');
              }
            }
          } else {
            console.log('삭제할 이벤트가 선택되지 않음');
            alert("삭제할 이벤트를 선택하세요.");
          }
        }
      }
      
    },

      // 헤더에 표시할 툴바
      headerToolbar: {
        left: 'prev,next today,myCustomButton,mySaveButton,myDeleteButton',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      initialView: 'dayGridMonth',
      navLinks: true, // 날짜를 클릭하면 그 날짜로 이동
      editable: true, // 이벤트를 드래그할 수 있음
      selectable: true, // 날짜를 클릭하여 선택할 수 있음
      nowIndicator: true, // 현재 시간을 표시
      dayMaxEvents: true, // 하루에 표시할 최대 이벤트 수
      locale: 'ko', // 한국어 로케일 설정

      eventClick: function (info) {
        // 이전에 선택된 이벤트가 있으면 스타일 제거
        if (currentSelectedEventElement) {
          currentSelectedEventElement.classList.remove('selected-event');
        }
      
        // 새로운 선택된 이벤트를 저장하고 스타일 추가
        currentSelectedEventElement = info.el;
        currentSelectedEventElement.classList.add('selected-event');
      
        // 이벤트 ID 저장
        currentSelectedEventId = info.event.id;
      
        // 이벤트 ID 출력하여 확인
        console.log('선택된 이벤트 ID:', currentSelectedEventId);
      },
      

      eventAdd: function (obj) {
        console.log(obj);
      },
      eventChange: function (obj) {
        console.log(obj);
      },
      eventRemove: function (obj) {
        console.log(obj);
      },
      select: function (arg) {
        var title = prompt('Event Title:');
        if (title) {
          calendar.addEvent({
            title: title,
            start: arg.start,
            end: arg.end,
            allDay: arg.allDay
          });
        }
        calendar.unselect();
      }
    });

  // 페이지 로드 시 이벤트 가져오기
  fetchNaverEvents();

  // 캘린더 렌더링
  calendar.render();
});

// 네이버/사용자 이벤트를 가져오는 함수
async function fetchNaverEvents() {
  try {
    const response = await axios.get('/calendar/events');  // 서버에 요청 보내기

    // 서버에서 가져온 데이터를 콘솔에 출력하여 확인
    console.log('서버에서 가져온 이벤트:', response.data);  // 이벤트 데이터 확인

    // 서버에서 받은 이벤트 데이터를 FullCalendar 이벤트 형식으로 매핑
    const events = response.data.map(event => ({
      id: event.calendarId,  // 서버에서 가져온 calendarId를 ID로 사용
      title: event.alias,  // alias를 title로 매핑
      start: event.start,
      backgroundColor: event.backgroundColor,
    }));

    console.log('매핑된 이벤트:', events);  // 매핑된 이벤트 데이터 확인

    // 캘린더에 이벤트 추가
    calendar.addEventSource(events);  
  } catch (error) {
    console.error('Error fetching events:', error);
  }
}