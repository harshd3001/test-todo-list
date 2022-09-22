function checkForNull(dataChecker) {
	if (typeof dataChecker === 'undefined' || dataChecker === null || dataChecker === '') {
		return true;
	} else {
		return false;
	}
}

function gettimediff(t1, t2) {
	t1.setSeconds(0, 0);
	t2.setSeconds(0, 0);
	var t1val = Number(t1.getHours() * 60 + t1.getMinutes());
	var t2val = Number(t2.getHours() * 60 + t2.getMinutes());
	var min = Math.floor((t2val - t1val) % 60);
	var hours = parseInt((t2 - t1) / (1000 * 60 * 60));
	return (hours + ':' + min + ':00');
}

function yyyymmdd(dueDate) {
	function twoDigit(n) {
		return (n < 10 ? '0' : '') + n;
	}
	return '' + dueDate.getFullYear() + '-' + twoDigit(dueDate.getMonth() + 1) + '-' + twoDigit(dueDate.getDate());
}

function DifferenceInDays(firstDate, secondDate) {
	return Math.floor((secondDate - firstDate) / (1000 * 60 * 60 * 24));
}

function findNextWrkngDay(dueDate, days, daysOffInWeek, hlDaysCal) {
	while (true) {
		var yyyymmddDate = yyyymmdd(dueDate);
		if (daysOffInWeek.indexOf(days[dueDate.getDay()]) > -1 || hlDaysCal.indexOf(yyyymmddDate) > -1) {
			dueDate.setDate(dueDate.getDate() + 1);
			holidaySkippedAlready++;
			continue;
		} else {
			break;
		}
	}
	return dueDate;
}
var holidaySkippedAlready = 0;
var workOrderRequestedDate = contextVar.workOrderRequestedDate;
var openFlag = 'false';
var btwnFlg = 'false';
if (contextVar.getWeeklyScheduleData.length < 1 || typeof contextVar.getResolutionTime === 'undefined' || checkForNull(workOrderRequestedDate)) {
	contextVar.errorCalcSlaFlg = false;
} else {
	contextVar.errorCalcSlaFlg = true;
	var days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
	var wrkHrsInWeek = 0;
	var getWeeklyScheduleData = contextVar.getWeeklyScheduleData;
	var getHolidays = contextVar.getHolidays;
	for (var i = 0; i < getWeeklyScheduleData.length; i++) {
		wrkHrsInWeek = wrkHrsInWeek + getWeeklyScheduleData[i].hours;
	}
	var plannedDate = new Date(workOrderRequestedDate);
	var resAmount = parseInt(contextVar.getResolutionTime.slaTimeFrameResolutionTimeAmount);
	var resUnit = contextVar.getResolutionTime.slaTimeFrameResolutionTimeUnit;
	var noOfhours = 0;
	var noOfMinutes = 0;
	if (resUnit === 'hours') {
		resAmount = resAmount * 60;
	}
	if (resUnit === 'minutes') {
		resUnit = 'hours';
	}
	var dueDate = new Date(workOrderRequestedDate);
	var noOfOffDaysInWeek = 0;
	var daysOffInWeek = [];
	var wrkgDaysInWeek = [];
	var wrkngHrs = [];
	var strtTime = [];
	var endTime = [];
	for (var i = 0; i < getWeeklyScheduleData.length; i++) {
		if (getWeeklyScheduleData[i].hours === 0 || getWeeklyScheduleData[i].isOpen === false) {
			daysOffInWeek.push(getWeeklyScheduleData[i].day);
			noOfOffDaysInWeek++;
		} else {
			if (getWeeklyScheduleData[i].hours < 0) {
				contextVar.errorCalcSlaFlg = false;
			} else {
				wrkgDaysInWeek.push(getWeeklyScheduleData[i].day);
				wrkngHrs.push(getWeeklyScheduleData[i].hours);
				strtTime.push(getWeeklyScheduleData[i].weeklyScheduleOpeningTime);
				endTime.push(getWeeklyScheduleData[i].weeklyScheduleClosingTime);
			}
		}
	}
	var hlDaysCal = [];
	for (var i = 0; i < getHolidays.length; i++) {
		hlDaysCal.push(yyyymmdd(new Date(getHolidays[i].holidayDate)));
	}
	var hoursLeft = 0;
	var minLeft = 0;
	var hrLeftInDay = 0;
	var minLeftInDay = 0;
	var absoluteTime = true;
	switch (resUnit) {
		case 'hours':
			if (absoluteTime) {
				dueDate.setMinutes(dueDate.getMinutes() + resAmount);
				break;
			}
			dueDate = findNextWrkngDay(dueDate, days, daysOffInWeek, hlDaysCal);
			var dueDateTimeString = dueDate.toLocaleTimeString();
			var openingTimeString = new Date(strtTime[wrkgDaysInWeek.indexOf(days[dueDate.getDay()])]).toLocaleTimeString();
			var opTimeArr = openingTimeString.split(':', 3);
			var closingTimeString = new Date(endTime[wrkgDaysInWeek.indexOf(days[dueDate.getDay()])]).toLocaleTimeString();
			var clTimeArr = closingTimeString.split(':', 3);
			if (holidaySkippedAlready >= 1) {
				dueDate.setHours(parseInt(opTimeArr[0]));
				dueDate.setMinutes(parseInt(opTimeArr[1]));
				dueDate.setSeconds(parseInt(opTimeArr[2]));
				dueDateTimeString = dueDate.toLocaleTimeString();
			}
			if (dueDateTimeString > closingTimeString && holidaySkippedAlready < 1) {
				dueDate.setDate(dueDate.getDate() + 1);
				dueDate = findNextWrkngDay(dueDate, days, daysOffInWeek, hlDaysCal);
				openingTimeString = new Date(strtTime[wrkgDaysInWeek.indexOf(days[dueDate.getDay()])]).toLocaleTimeString();
				opTimeArr = openingTimeString.split(':', 3);
				closingTimeString = new Date(endTime[wrkgDaysInWeek.indexOf(days[dueDate.getDay()])]).toLocaleTimeString();
				clTimeArr = closingTimeString.split(':', 3);
				dueDate.setHours(parseInt(opTimeArr[0]));
				dueDate.setMinutes(parseInt(opTimeArr[1]));
				dueDate.setSeconds(parseInt(opTimeArr[2]));
				dueDateTimeString = dueDate.toLocaleTimeString();
			}
			if (dueDateTimeString <= closingTimeString && dueDateTimeString >= openingTimeString) {
				var dueClosDate = new Date();
				dueClosDate.setFullYear(dueDate.getFullYear());
				dueClosDate.setMonth(dueDate.getMonth());
				dueClosDate.setDate(dueDate.getDate());
				dueClosDate.setHours(parseInt(clTimeArr[0]));
				dueClosDate.setMinutes(parseInt(clTimeArr[1]));
				dueClosDate.setSeconds(parseInt(clTimeArr[2]));
				var timeDiff = gettimediff(dueDate, dueClosDate);
				var diffArr = timeDiff.split(':', 3);
				var diffArrInt = [];
				for (var i = 0; i < diffArr.length; i++) {
					diffArrInt.push(parseInt(diffArr[i]));
				}
				hrLeftInDay = diffArrInt[0];
				minLeftInDay = diffArrInt[1];
				if (hrLeftInDay >= resAmount) {
					btwnFlg = 'true';
					dueDate.setHours(parseInt(dueDate.getHours()) + parseInt(resAmount));
					dueDate.setMinutes(parseInt(dueDate.getMinutes()) + parseInt(noOfMinutes));
					hrLeftInDay = 0;
					minLeftInDay = 0;
				} else {
					resAmount = resAmount - hrLeftInDay;
					dueDate.setDate(parseInt(dueDate.getDate()) + 1);
					findNextWrkngDay(dueDate, days, daysOffInWeek, hlDaysCal);
					openingTimeString = new Date(strtTime[wrkgDaysInWeek.indexOf(days[dueDate.getDay()])]).toLocaleTimeString();
					opTimeArr = openingTimeString.split(':', 3);
					dueDate.setHours(parseInt(opTimeArr[0]));
					dueDate.setMinutes(parseInt(opTimeArr[1]));
					dueDate.setSeconds(parseInt(opTimeArr[2]));
					dueDateTimeString = dueDate.toLocaleTimeString();
				}
			}
			if (dueDateTimeString < openingTimeString) {
				dueDate.setHours(opTimeArr[0]);
				dueDate.setMinutes(opTimeArr[1]);
				dueDate.setSeconds(opTimeArr[2]);
			}
			var weeksCount = parseInt(resAmount / wrkHrsInWeek);
			if (btwnFlg == 'false') {
				hoursLeft = hoursLeft + parseInt(resAmount % wrkHrsInWeek);
			}
			dueDate.setDate(dueDate.getDate() + 7 * weeksCount);
			dueDate = findNextWrkngDay(dueDate, days, daysOffInWeek, hlDaysCal);
			while (hoursLeft > wrkngHrs[wrkgDaysInWeek.indexOf(days[dueDate.getDay()])] && hoursLeft > 0) {
				hrLeftInDay = 0;
				hoursLeft = hoursLeft - wrkngHrs[wrkgDaysInWeek.indexOf(days[dueDate.getDay()])];
				dueDate.setDate(dueDate.getDate() + 1);
				dueDate = findNextWrkngDay(dueDate, days, daysOffInWeek, hlDaysCal);
			}
			openFlag = 'true';
			break;
		case 'days':
			dueDate.setDate(dueDate.getDate() + resAmount);
			break;
		case 'weeks':
			dueDate.setDate(dueDate.getDate() + 7 * resAmount);
			break;
		case 'months':
			dueDate.setMonth(dueDate.getMonth() + resAmount);
			break;
		case 'years':
			dueDate.setFullYear(dueDate.getFullYear() + resAmount);
			break;
		default:
			contextVar.errorCalcSlaFlg = false;
	}
	var noOfHolidays = holidaySkippedAlready;
	if (resUnit === 'hours' && (!absoluteTime)) {
		while (true) {
			var yyyymmddDate = yyyymmdd(dueDate);
			if (daysOffInWeek.indexOf(days[dueDate.getDay()]) > -1 || hlDaysCal.indexOf(yyyymmddDate) > -1) {
				dueDate.setDate(dueDate.getDate() + 1);
				continue;
			} else {
				break;
			}
		}
		var dueDateTimeString = dueDate.toLocaleTimeString();
		var openingTimeString = new Date(strtTime[wrkgDaysInWeek.indexOf(days[dueDate.getDay()])]).toLocaleTimeString();
		var opTimeArr = openingTimeString.split(':', 3);
		var closingTimeString = new Date(endTime[wrkgDaysInWeek.indexOf(days[dueDate.getDay()])]).toLocaleTimeString();
		var clTimeArr = closingTimeString.split(':', 3);
		if (dueDateTimeString > closingTimeString && openFlag == 'false') {
			dueDate.setHours(parseInt(clTimeArr[0]));
			dueDate.setMinutes(parseInt(clTimeArr[1]));
			dueDate.setSeconds(parseInt(clTimeArr[2]));
		}
		if (dueDateTimeString < openingTimeString && openFlag == 'false') {
			dueDate.setHours(parseInt(opTimeArr[0]));
			dueDate.setMinutes(parseInt(opTimeArr[1]));
			dueDate.setSeconds(parseInt(opTimeArr[2]));
		}
		if (resUnit == 'hours' && btwnFlg == 'false') {
			dueDate.setHours(parseInt(opTimeArr[0]) + hoursLeft);
			dueDate = new Date(dueDate.setMinutes(parseInt(opTimeArr[1]) + noOfMinutes + minLeft - minLeftInDay));
		}
	}
	var localTime = dueDate.getTime() + ((contextVar.timezoneOffset) * 60000);
	contextVar.dueDateSLA = new Date(localTime).toISOString().replace('T', ' ').replace('Z', '');
}