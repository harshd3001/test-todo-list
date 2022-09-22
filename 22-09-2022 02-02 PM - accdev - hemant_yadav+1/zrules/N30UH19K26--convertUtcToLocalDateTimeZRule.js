function convertUTCDateToLocalDate(date) {
	var newDate = new Date(date);
	var offset = contextVar.timezoneOffset;
	var minutes = date.getMinutes();
	newDate.setMinutes(minutes - offset);
	newDate = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate() + ' ' + newDate.toString().split(' ')[4];
	return newDate;
}

/* 	reusable function to set date */
var setDates = function (date, time) {
	return (date + ' ' + time);
};

contextVar.workOrderRequestedDate = convertUTCDateToLocalDate(new Date(contextVar.workOrderRequestedDate));
var currentDate = new Date().toISOString().replace('T', ' ').replace('Z', '').split(' ')[0];
var getWeeklyScheduleData = contextVar.getWeeklyScheduleData;
for (var i = 0; i < getWeeklyScheduleData.length; i++) {
	if (typeof getWeeklyScheduleData[i].weeklyScheduleSchedule !== 'undefined' && getWeeklyScheduleData[i].weeklyScheduleSchedule.length > 0) {
		getWeeklyScheduleData[i].weeklyScheduleOpeningTime = setDates(currentDate, getWeeklyScheduleData[i].weeklyScheduleSchedule[0].start);
		getWeeklyScheduleData[i].weeklyScheduleClosingTime = setDates(currentDate, getWeeklyScheduleData[i].weeklyScheduleSchedule[0].end);
		getWeeklyScheduleData[i].hours = new Date(setDates(currentDate, getWeeklyScheduleData[i].weeklyScheduleSchedule[0].end)).getHours() - new Date(setDates(currentDate, getWeeklyScheduleData[i].weeklyScheduleSchedule[0].start)).getHours();
	} else if (typeof getWeeklyScheduleData[i].weeklyScheduleOpeningTime !== 'undefined' && getWeeklyScheduleData[i].weeklyScheduleOpeningTime !== null && typeof getWeeklyScheduleData[i].weeklyScheduleClosingTime !== 'undefined' && getWeeklyScheduleData[i].weeklyScheduleClosingTime !== null) {
		getWeeklyScheduleData[i].weeklyScheduleOpeningTime = convertUTCDateToLocalDate(new Date(getWeeklyScheduleData[i].weeklyScheduleOpeningTime));
		getWeeklyScheduleData[i].weeklyScheduleClosingTime = convertUTCDateToLocalDate(new Date(getWeeklyScheduleData[i].weeklyScheduleClosingTime));
		getWeeklyScheduleData[i].hours = new Date(getWeeklyScheduleData[i].weeklyScheduleClosingTime).getHours() - new Date(getWeeklyScheduleData[i].weeklyScheduleOpeningTime).getHours();
	} else {
		getWeeklyScheduleData[i].hours = 0;
		continue;
	}
}


var getHolidays = contextVar.getHolidays;
for (var i = 0; i < getHolidays.length; i++) {
	getHolidays[i].holidayDate = convertUTCDateToLocalDate(new Date(getHolidays[i].holidayDate));
}