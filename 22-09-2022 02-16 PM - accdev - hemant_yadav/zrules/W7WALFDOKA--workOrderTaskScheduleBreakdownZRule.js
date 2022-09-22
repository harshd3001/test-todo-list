function Breakdown(startDate, endDate, duration, durationInHours) {
	this.startDate = startDate;
	this.endDate = endDate;
	this.duration = duration;
	this.durationInHours = durationInHours;
}


function convertUTCDateToLocalDate(date) {

	function pad(number) {
		if (number < 10) {
			return '0' + number;
		}
		return number;
	}

	var newDate = new Date(date);
	var offset = contextVar.timezoneOffset;
	var minutes = date.getMinutes();
	newDate.setMinutes(minutes - offset);
	newDate = newDate.getFullYear() + "-" + pad(newDate.getMonth() + 1) + "-" + pad(newDate.getDate()) + ' ' + newDate.toString().split(' ')[4];
	return newDate;
}

function timeOffsetCalculation(date) {
	return toDateString(new Date(new Date(date).getTime() - (contextVar.timezoneOffset * 60000)));
}

function toDateString(date) {
	var dateString = '';

	function pad(number) {
		if (number < 10) {
			return '0' + number;
		}
		return number;
	}
	if (date instanceof Date) {
		dateString = date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + '.' + (date.getMilliseconds() / 1000).toFixed(3).slice(2, 5);
	}
	return dateString;
}

// polyfill to get the time
function getTime(dateString) {
	var time = '';
	if (typeof dateString === 'string' || dateString instanceof String) {
		time = dateString.split(' ')[1];
		time = time.substring(0, time.lastIndexOf(':'));
	}
	return time;
}

// function to add date to time
function constructDate(date, time) {
	return date + ' ' + time;
}

// polyfill to get the date
function getDate(dateString) {
	var date = '';
	if (typeof dateString === 'string' || dateString instanceof String) {
		date = dateString.split(' ')[0];
	}
	return date;
}

function setDates(date1, date2) {
	return (getDate(date1) + ' ' + date2);
}

function setEndDate(date, minutes) {
	return new Date(new Date(date).getTime() + minutes * 60000);
}

function compareDates(date1, date2) {
	if (!(date1 instanceof Date)) date1 = new Date(date1);
	date1.setMilliseconds(0);
	date1.setSeconds(0);
	if (!(date2 instanceof Date)) date2 = new Date(date2);
	date2.setMilliseconds(0);
	date2.setSeconds(0);
	return (date1 >= date2);
}

var holidayList = [];
if (Array.isArray(contextVar.calendarHolidayData)) {
	contextVar.calendarHolidayData.forEach(function (element) {
		holidayList.push(element.holidayDate);
	});
}

//function to calculate breakdown
function calculateBreakdown(scheduledStartDate, scheduledEndDate) {
	var startDate, endDate;
	var currentDate = new Date().toISOString().replace('T', ' ').replace('Z', '');
	if (scheduledStartDate !== '') {
		startDate = new Date(scheduledStartDate);
	}
	if (scheduledEndDate !== '') {
		endDate = new Date(scheduledEndDate);
	}
	var startDailyAtTime = contextVar.startDailyAt.split(":");
	var num = parseInt(startDailyAtTime[0]) * 60 + parseInt(startDailyAtTime[1]) + contextVar.timezoneOffset;
	contextVar.startDailyAt = (Math.floor(num / 60)) + ":" + (num % 60);

	if (typeof contextVar.weeklyScheduleData !== 'undefined' && typeof contextVar.weeklyScheduleData[startDate.getDay()].isOpen !== 'undefined' && contextVar.weeklyScheduleData.length > 0) {
		if ((!isHoliday(toDateString(startDate)) || contextVar.scheduleOnPublicHolidays) && (contextVar.weeklyScheduleData[startDate.getDay()].isOpen || contextVar.scheduleOnDaysOff)) {
			if (compareDates(toDateString(new Date(setDates(toDateString(startDate), contextVar.startDailyAt))), currentDate)) {
				contextVar.taskScheduleBreakdown = [];
				while (startDate <= endDate) {
					if (!isHoliday(toDateString(startDate)) || contextVar.scheduleOnPublicHolidays) {
						if (contextVar.weeklyScheduleData[startDate.getDay()].isOpen || contextVar.scheduleOnDaysOff) {
							let start = toDateString(new Date(setDates(toDateString(startDate), contextVar.startDailyAt)));
							let end = toDateString(setEndDate(setDates(toDateString(startDate), contextVar.startDailyAt), contextVar.timePerDay));
							contextVar.taskScheduleBreakdown.push(new Breakdown(start, end, contextVar.timePerDay, ((contextVar.timePerDay / 60) % 1) ? (contextVar.timePerDay / 60).toFixed(2) : (contextVar.timePerDay / 60).toFixed(0)));
							startDate.setDate(startDate.getDate() + 1);
						} else {
							startDate.setDate(startDate.getDate() + 1);
						}
					} else {
						startDate.setDate(startDate.getDate() + 1);
					}
				}
			} else {
				contextVar.modalAction = 'startDailyAtLessThanStartTime';
			}
		} else {
			contextVar.modalAction = 'startDateUnderDOOrPH';
		}
	}

}

//function to calculate breakdown for Long Duration Task
function calculateLongDurationBreakdown(scheduledStartDate, scheduledEndDate) {
	var startDate, endDate;
	var currentDate = new Date().toISOString().replace('T', ' ').replace('Z', '');
	if (scheduledStartDate !== '') {
		startDate = new Date(convertUTCDateToLocalDate(new Date(new Date(scheduledStartDate))));
	}
	if (scheduledEndDate !== '') {
		endDate = new Date(convertUTCDateToLocalDate(new Date(new Date(scheduledEndDate))));
	}

	if (typeof contextVar.weeklyScheduleData !== 'undefined' && typeof contextVar.weeklyScheduleData[startDate.getDay()].isOpen !== 'undefined' && contextVar.weeklyScheduleData.length > 0) {

		let sw_time_start_startTime = new Date(), sw_time_start_endTime = new Date(), scheduled_time_start = new Date();
		let sw_time_end_startTime = new Date(), sw_time_end_endTime = new Date(), scheduled_time_end = new Date();
		let sw_start, sw_end, sch_start, sch_end, startDailyAtTime;

		if (contextVar.weeklyScheduleData[startDate.getDay()].isOpen && contextVar.weeklyScheduleData[endDate.getDay()].isOpen) {

			sw_start_startTime = contextVar.weeklyScheduleData[startDate.getDay()].schedule[0].start.split('.')[0].split(':');
			sw_start_endTime = contextVar.weeklyScheduleData[startDate.getDay()].schedule[0].end.split('.')[0].split(':');
			sw_end_startTime = contextVar.weeklyScheduleData[endDate.getDay()].schedule[0].start.split('.')[0].split(':');
			sw_end_endTime = contextVar.weeklyScheduleData[endDate.getDay()].schedule[0].end.split('.')[0].split(':');

			sch_start = convertUTCDateToLocalDate(new Date(scheduledStartDate)).split(' ')[1].split('.')[0].split(':');
			sch_end = convertUTCDateToLocalDate(new Date(scheduledEndDate)).split(' ')[1].split('.')[0].split(':');

			scheduled_time_start = scheduled_time_start.setHours(sch_start[0], sch_start[1], sch_start[2], 0);
			scheduled_time_end = scheduled_time_end.setHours(sch_end[0], sch_end[1], sch_end[2], 0);

			sw_time_start_startTime = sw_time_start_startTime.setHours(sw_start_startTime[0], sw_start_startTime[1], sw_start_startTime[2], 0);
			sw_time_start_endTime = sw_time_start_endTime.setHours(sw_start_endTime[0], sw_start_endTime[1], sw_start_endTime[2], 0);
			sw_time_end_startTime = sw_time_end_startTime.setHours(sw_end_startTime[0], sw_end_startTime[1], sw_end_startTime[2], 0);
			sw_time_end_endTime = sw_time_end_endTime.setHours(sw_end_endTime[0], sw_end_endTime[1], sw_end_endTime[2], 0);
			

			contextVar.timePerDay = Number(sw_time_start_startTime - sw_time_start_endTime) / 60000;

			startDailyAtTime = sw_time_start_startTime;
			contextVar.startDailyAt = startDailyAtTime[0] + ":" + startDailyAtTime[1];


			if ( (scheduled_time_start >= sw_time_start_startTime && scheduled_time_start <= sw_time_start_endTime ) && (scheduled_time_end >= sw_time_end_startTime && scheduled_time_end <= sw_time_end_endTime)) {
				if ((!isHoliday(toDateString(startDate)) || contextVar.scheduleOnPublicHolidays) && (contextVar.weeklyScheduleData[startDate.getDay()].isOpen || contextVar.scheduleOnDaysOff) && (!isHoliday(toDateString(endDate)) || contextVar.scheduleOnPublicHolidays) && (contextVar.weeklyScheduleData[endDate.getDay()].isOpen || contextVar.scheduleOnDaysOff)) {
					
						contextVar.taskScheduleBreakdown = [];
						contextVar.workOrderTaskEstimatedDuration = 0;
						
						while (startDate.getTime() <= endDate.getTime()) {

							if (!isHoliday(toDateString(startDate)) || contextVar.scheduleOnPublicHolidays) {
								if (contextVar.weeklyScheduleData[startDate.getDay()].isOpen || contextVar.scheduleOnDaysOff) {

									let sw_start_time = new Date(), sw_end_time = new Date();

									if(new Date(convertUTCDateToLocalDate(new Date(new Date(scheduledStartDate)))).getDate() === new Date(startDate).getDate() ){
										sw_start = convertUTCDateToLocalDate(new Date(new Date(scheduledStartDate))).split(' ')[1].split('.')[0].split(':');
									}
									else{
										sw_start = contextVar.weeklyScheduleData[startDate.getDay()].schedule[0].start.split('.')[0].split(':');
									}

									if(new Date(convertUTCDateToLocalDate(new Date(new Date(scheduledEndDate)))).getDate() === new Date(startDate).getDate() ){
										sw_end = convertUTCDateToLocalDate(new Date(new Date(scheduledEndDate))).split(' ')[1].split('.')[0].split(':');
									}
									else{
										sw_end = contextVar.weeklyScheduleData[startDate.getDay()].schedule[0].end.split('.')[0].split(':');
									}
									
									sw_start_time = sw_start_time.setHours(sw_start[0], sw_start[1], sw_start[2], 0);
									sw_end_time = sw_end_time.setHours(sw_end[0], sw_end[1], sw_end[2], 0);

									contextVar.timePerDay = Number(sw_end_time - sw_start_time) / 60000;

									startDailyAtTime = sw_start;
									contextVar.startDailyAt = startDailyAtTime[0] + ":" + startDailyAtTime[1];

									let start = toDateString(new Date(setDates(toDateString(startDate), contextVar.startDailyAt)));
									let end = toDateString(setEndDate(setDates(toDateString(startDate), contextVar.startDailyAt), contextVar.timePerDay));
									start = new Date(start).toISOString().replace('T', ' ').replace('Z', '');
									end = new Date(end).toISOString().replace('T', ' ').replace('Z', '');
									if(Number(contextVar.timePerDay) > 0){
										contextVar.taskScheduleBreakdown.push(new Breakdown(start, end, contextVar.timePerDay, ((contextVar.timePerDay / 60) % 1) ? (contextVar.timePerDay / 60).toFixed(2) : (contextVar.timePerDay / 60).toFixed(0)));
									}
									

									//Reinitalisting the start time as per the service window , before incrementing the date, for the in between duration/range.
									sw_start = contextVar.weeklyScheduleData[startDate.getDay()].schedule[0].start.split('.')[0].split(':');
									startDailyAtTime = sw_start;
									contextVar.startDailyAt = startDailyAtTime[0] + ":" + startDailyAtTime[1];
									
									startDate = new Date(toDateString(new Date(setDates(toDateString(startDate), contextVar.startDailyAt))));
									startDate.setDate(startDate.getDate() + 1);
									contextVar.workOrderTaskEstimatedDuration += Number(contextVar.timePerDay) / 60;
								} else {
									startDate.setDate(startDate.getDate() + 1);
								}
							} else {
								startDate.setDate(startDate.getDate() + 1);
							}
							
						}

					
				} else {
					contextVar.bannerType = 'timeSlotsOutsideSW';
				}
			}
			else {
				contextVar.bannerType = 'timeSlotsOutsideSW';
			}
		}
		else {
			contextVar.bannerType = 'timeSlotsOutsideSW';
		}

	}




}

function generateBannerType() {
	var holidayCount = 0;
	var outOfServiceWindowCount = 0;
	if (contextVar.taskScheduleBreakdown !== '') {
		for (var i in contextVar.taskScheduleBreakdown) {
			let day = new Date(contextVar.taskScheduleBreakdown[i].startDate).getDay();

			if (isHoliday(contextVar.taskScheduleBreakdown[i].startDate) && holidayCount < 1) {
				holidayCount++;
			}
			if (!contextVar.weeklyScheduleData[day].isOpen || !(getTime(timeOffsetCalculation(contextVar.taskScheduleBreakdown[i].startDate)) >= getTime(constructDate(currentDate, contextVar.weeklyScheduleData[day].schedule[0].start)) && getTime(timeOffsetCalculation(contextVar.taskScheduleBreakdown[i].startDate)) <= getTime(constructDate(currentDate, contextVar.weeklyScheduleData[day].schedule[0].end))) || !(getTime(timeOffsetCalculation(contextVar.taskScheduleBreakdown[i].endDate)) >= getTime(constructDate(currentDate, contextVar.weeklyScheduleData[day].schedule[0].start)) && getTime(timeOffsetCalculation(contextVar.taskScheduleBreakdown[i].endDate)) <= getTime(constructDate(currentDate, contextVar.weeklyScheduleData[day].schedule[0].end)))) {
				outOfServiceWindowCount++;
			}
		}
	}
	if (holidayCount >= 1 && outOfServiceWindowCount >= 1) {
		contextVar.bannerType = 'timeSlotsInPHandFallsOutsideSW';
	} else if (holidayCount >= 1) {
		contextVar.bannerType = 'timeSlotsInPH';
	} else if (outOfServiceWindowCount >= 1) {
		contextVar.bannerType = 'timeSlotsFallsOutsideSW';
	} else {
		contextVar.bannerType = '';
	}
}

function isHoliday(dateString) {
	for (var i = 0; i < holidayList.length; i++) {
		if (getDate(dateString) === getDate(holidayList[i])) {
			if (getTime(dateString) < getTime(holidayList[i])) {
				continue;
			} else {
				return true;
			}
		} else {
			if (getDate(dateString) < getDate(holidayList[i])) {
				continue;
			} else {
				var holidayDate = new Date(holidayList[i]);
				holidayDate.setDate(holidayDate.getDate() + 1);
				if (compareDates(holidayDate, dateString)) {
					return true;
				} else {
					continue;
				}
			}
		}
	}
	return false;
}

function calculateIndividualBreakdown() {
	if (typeof contextVar.workOrderTaskScheduledIndividualDate !== 'undefined' && typeof contextVar.timePerDay !== 'undefined' && contextVar.workOrderTaskScheduledIndividualDate !== '' && contextVar.timePerDay !== '') {
		var workOrderTaskDate = toDateString(new Date(new Date(contextVar.workOrderTaskScheduledIndividualDate).getTime() + (Number(contextVar.timePerDay) * 60000)));

		let timeSlotObj = new Breakdown(contextVar.workOrderTaskScheduledIndividualDate, workOrderTaskDate, contextVar.timePerDay, ((contextVar.timePerDay / 60) % 1) ? (contextVar.timePerDay / 60).toFixed(2) : (contextVar.timePerDay / 60).toFixed(0));
		if (typeof contextVar.taskScheduleBreakdown === 'undefined' || contextVar.taskScheduleBreakdown === '') {
			contextVar.taskScheduleBreakdown = [];
			contextVar.taskScheduleBreakdown.push(timeSlotObj);
		} else {
			var checkNotExists = true;
			for (var i in contextVar.taskScheduleBreakdown) {
				if ((contextVar.workOrderTaskScheduledIndividualDate >= contextVar.taskScheduleBreakdown[i].startDate && contextVar.workOrderTaskScheduledIndividualDate <= contextVar.taskScheduleBreakdown[i].endDate) || (workOrderTaskDate >= contextVar.taskScheduleBreakdown[i].startDate && workOrderTaskDate <= contextVar.taskScheduleBreakdown[i].endDate) || (contextVar.workOrderTaskScheduledIndividualDate <= contextVar.taskScheduleBreakdown[i].startDate && workOrderTaskDate >= contextVar.taskScheduleBreakdown[i].endDate)) {
					checkNotExists = false;
					contextVar.modalAction = 'timeSlotOverlap';
					break;
				}
			}
			if (checkNotExists) {
				contextVar.taskScheduleBreakdown.push(timeSlotObj);
				contextVar.taskScheduleBreakdown.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
				contextVar.modalAction = '';
			}
		}
	}
}

var currentDate = new Date().toISOString().replace('T', ' ').replace('Z', '').split(' ')[0];

if (contextVar.workOrderscheduleMethodId === 'addTimeSlotsBulk') {
	calculateBreakdown(contextVar.scheduledStartDate, contextVar.scheduledEndDate);
	generateBannerType();
} else if (contextVar.workOrderscheduleMethodId === 'addTimeSlotsForLongDurationTask') {
	calculateLongDurationBreakdown(contextVar.scheduledStartDate, contextVar.scheduledEndDate);
} else {
	calculateIndividualBreakdown();
	generateBannerType();
}