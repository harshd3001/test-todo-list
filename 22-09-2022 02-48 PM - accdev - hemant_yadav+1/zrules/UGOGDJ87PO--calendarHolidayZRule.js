{
    contextVar.jsonObjInsert = [];
    contextVar.jsonObjDelete = [];
    if(typeof contextVar.calendarHoliday.holidayList !== 'undefined' && contextVar.calendarHoliday.holidayList !== '' && contextVar.calendarHoliday.holidayList.length !== 0) {
        for (var i = 0; i < contextVar.calendarHoliday.holidayList.length; i++) {
            contextVar.calendarHoliday.holidayList[i].calendarId = contextVar.calendarHoliday.id;
            contextVar.jsonObjInsert.push(contextVar.calendarHoliday.holidayList[i]);
        }
    }
    if(typeof contextVar.calendarHoliday.removeHolidayList !== 'undefined' && contextVar.calendarHoliday.removeHolidayList !== '' && contextVar.calendarHoliday.removeHolidayList.length !== 0) {
        for (var i = 0; i < contextVar.calendarHoliday.removeHolidayList.length; i++) {
            contextVar.jsonObjDelete.push({
                "calendarId": contextVar.calendarHoliday.removeHolidayList[i].calendarHolidayCalendarId,
                "holidayId": contextVar.calendarHoliday.removeHolidayList[i].holidayId,
                "recver":contextVar.calendarHoliday.removeHolidayList[i].calendarHolidayRecver
            });
        }
    }
}