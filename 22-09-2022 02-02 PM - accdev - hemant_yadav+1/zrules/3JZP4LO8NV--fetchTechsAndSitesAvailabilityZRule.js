/* Array Validation function */
function arrayCheck(array) {
	return Array.isArray(array) && array.length > 0;
}

/* function to create a hash map for all data */
function constructObject(array, key) {
	var hashObj = {};
	if (arrayCheck(array)) {
		array.forEach(obj => {
			if (typeof hashObj[obj[key]] === 'undefined' || hashObj[obj[key]] === '') {
				hashObj[obj[key]] = [];
			}
			hashObj[obj[key]].push(obj);
		});
	}
	return hashObj;
}

function createDateString(time) {
	var dateTime;
	var today = new Date().toISOString().replace('T', ' ').replace('Z', '').split(' ')[0];
	dateTime = today + ' ' + time;
	return dateTime;

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

function convertToUTC(shiftTime, timezoneOffset) {
	var calculatedTime;
	var localTime = new Date(shiftTime).getTime() + (timezoneOffset * 60 * 1000);
	calculatedTime = toDateString(new Date(localTime));
	return calculatedTime;
}

var addMinutes = function (date, offset) {
	return (new Date(date.getTime() + (offset * 60000))).toISOString().replace('T', ' ').replace('Z', '');
};

function positiveTimezoneOffset(availability, zeroHour, lastHour, cutoffTime, currentDate) {
	let saturdaysDataToPush = [];

	//looping it from back because if we push a slot to next day and then loop over it again, that slot will be pushed to next day and so on
	for (let i = 6; i >= 0; i--) {
		let newSlots = [];
		availability[dayMap[i]].forEach(function (slot) {
			if (slot.openingTime.split(' ')[1] < cutoffTime && slot.closingTime.split(' ')[1] <= cutoffTime) {
				i !== 6 ? availability[dayMap[i + 1]].push(slot) : saturdaysDataToPush.push(slot);
			} else if (slot.openingTime.split(' ')[1] >= cutoffTime && slot.closingTime.split(' ')[1] < cutoffTime) {
				newSlots.push({
					"openingTime": currentDate + slot.openingTime.split(" ")[1],
					"closingTime": currentDate + lastHour
				});
				let nextDaySlots = {
					"openingTime": currentDate + zeroHour,
					"closingTime": currentDate + slot.closingTime.split(" ")[1]
				};
				i !== 6 ? availability[dayMap[i + 1]].push(nextDaySlots) : saturdaysDataToPush.push(nextDaySlots);
			} else {
				newSlots.push(slot);
			}
		});
		availability[dayMap[i]] = JSON.parse(JSON.stringify(newSlots));
	}
	//Doing this at the end because if we had pushed this data beforehand, it would have been picked up when sunday was getting looped and then if any data was pushed by saturday to sunday, it would have gotten pushed to monday
	availability[dayMap[0]].push(...saturdaysDataToPush);
	return availability;
}

function negativeTimezoneOffset(availability, zeroHour, lastHour, cutoffTime, currentDate) {
	let sundaysDataToPush = [];
	for (let i = 0; i < 7; i++) {
		let newSlots = [];
		availability[dayMap[i]].forEach(function (slot) {
			if (slot.openingTime.split(' ')[1] >= cutoffTime && slot.closingTime.split(' ')[1] > cutoffTime) {
				i !== 0 ? availability[dayMap[i - 1]].push(slot) : sundaysDataToPush.push(slot);
			} else if ((slot.openingTime.split(' ')[1] >= cutoffTime && slot.closingTime.split(' ')[1] < cutoffTime)) {
				newSlots.push({
					"openingTime": currentDate + zeroHour,
					"closingTime": currentDate + slot.closingTime.split(" ")[1]
				});
				let prevDaySlots = {
					"openingTime": currentDate + slot.openingTime.split(" ")[1],
					"closingTime": currentDate + lastHour
				};
				i !== 0 ? availability[dayMap[i - 1]].push(prevDaySlots) : sundaysDataToPush.push(prevDaySlots);
			} else {
				newSlots.push(slot);
			}
		});
		availability[dayMap[i]] = JSON.parse(JSON.stringify(newSlots));
	}

	//Doing this at the end because if we had pushed this data beforehand, it would have been picked up when saturday was getting looped and then if any data was pushed by sunday to saturday, it would have gotten pushed to friday
	availability[dayMap[6]].push(...sundaysDataToPush);
	return availability;

}

function negativeTimezoneOffsetForLunchBreak(lunchTime, zeroHour, lastHour, cutoffTime, currentDate) {
	let sundaysDataToPush = [];
	for (let i = 0; i < 7; i++) {
		let newSlots = [];
		lunchTime[dayMap[i]].forEach(function (slot) {
			if (slot.lunchStart.split(' ')[1] >= cutoffTime && slot.lunchEnd.split(' ')[1] > cutoffTime) {
				i !== 0 ? lunchTime[dayMap[i - 1]].push(slot) : sundaysDataToPush.push(slot);
			} else if ((slot.lunchStart.split(' ')[1] >= cutoffTime && slot.lunchEnd.split(' ')[1] < cutoffTime)) {
				newSlots.push({
					"lunchStart": currentDate + zeroHour,
					"lunchEnd": currentDate + slot.lunchEnd.split(" ")[1],
					"lunchTime": slot.lunchTime
				});
				let prevDaySlots = {
					"lunchStart": currentDate + slot.lunchStart.split(" ")[1],
					"lunchEnd": currentDate + lastHour,
					"lunchTime": slot.lunchTime
				};
				i !== 0 ? lunchTime[dayMap[i - 1]].push(prevDaySlots) : sundaysDataToPush.push(prevDaySlots);
			} else {
				newSlots.push(slot);
			}
		});
		lunchTime[dayMap[i]] = JSON.parse(JSON.stringify(newSlots));
	}

	//Doing this at the end because if we had pushed this data beforehand, it would have been picked up when saturday was getting looped and then if any data was pushed by sunday to saturday, it would have gotten pushed to friday
	lunchTime[dayMap[6]].push(...sundaysDataToPush);
	return lunchTime;

}

function positiveTimezoneOffsetForLunchBreak(lunchTime, zeroHour, lastHour, cutoffTime, currentDate) {
	let saturdaysDataToPush = [];

	//looping it from back because if we push a slot to next day and then loop over it again, that slot will be pushed to next day and so on
	for (let i = 6; i >= 0; i--) {
		let newSlots = [];
		lunchTime[dayMap[i]].forEach(function (slot) {
			if (slot.lunchStart.split(' ')[1] < cutoffTime && slot.lunchEnd.split(' ')[1] <= cutoffTime) {
				i !== 6 ? lunchTime[dayMap[i + 1]].push(slot) : saturdaysDataToPush.push(slot);
			} else if (slot.lunchStart.split(' ')[1] >= cutoffTime && slot.lunchEnd.split(' ')[1] < cutoffTime) {
				newSlots.push({
					"lunchStart": currentDate + slot.lunchStart.split(" ")[1],
					"lunchEnd": currentDate + lastHour,
					"lunchTime": slot.lunchTime
				});
				let nextDaySlots = {
					"lunchStart": currentDate + zeroHour,
					"lunchEnd": currentDate + slot.lunchEnd.split(" ")[1],
					"lunchTime": slot.lunchTime
				};
				i !== 6 ? lunchTime[dayMap[i + 1]].push(nextDaySlots) : saturdaysDataToPush.push(nextDaySlots);
			} else {
				newSlots.push(slot);
			}
		});
		lunchTime[dayMap[i]] = JSON.parse(JSON.stringify(newSlots));
	}
	//Doing this at the end because if we had pushed this data beforehand, it would have been picked up when sunday was getting looped and then if any data was pushed by saturday to sunday, it would have gotten pushed to monday
	lunchTime[dayMap[0]].push(...saturdaysDataToPush);
	return lunchTime;
}

function calculateAvailabilityWithTimezone(availability, offset) {
	var currentDateTime = new Date();
	var currentDate = currentDateTime.toISOString().replace('T', ' ').replace('Z', '').split(' ')[0] + " ";
	var zeroHour = "00:00:00.000";
	var lastHour = "23:59:00.000";
	currentDateTime.setHours(0, 0, 0, 0);
	var cutoffTime = addMinutes(currentDateTime, offset).split(' ')[1];
	if (offset > 0)
		return positiveTimezoneOffset(availability, zeroHour, lastHour, cutoffTime, currentDate);
	else if (offset < 0)
		return negativeTimezoneOffset(availability, zeroHour, lastHour, cutoffTime, currentDate);
	return availability;
}

function calculateLunchBreakWithTimezone(lunchTime, offset) {
	var currentDateTime = new Date();
	var currentDate = currentDateTime.toISOString().replace('T', ' ').replace('Z', '').split(' ')[0] + " ";
	var zeroHour = "00:00:00.000";
	var lastHour = "23:59:00.000";
	currentDateTime.setHours(0, 0, 0, 0);
	var cutoffTime = addMinutes(currentDateTime, offset).split(' ')[1];
	if (offset > 0)
		return positiveTimezoneOffsetForLunchBreak(lunchTime, zeroHour, lastHour, cutoffTime, currentDate);
	else if (offset < 0)
		return negativeTimezoneOffsetForLunchBreak(lunchTime, zeroHour, lastHour, cutoffTime, currentDate);
	return lunchTime;
}

{
	var dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var shiftData = {},
		lunchBreakData = {},
		calendarMapData = {},
		holidayData = {};

	holidayData = constructObject(contextVar.techHolidayData, 'calendarId');
	var isTechnicians = false,
		baseData;
	if (typeof contextVar.technicians !== 'undefined' && contextVar.technicians.length > 0) {
		isTechnicians = true;
		baseData = contextVar.technicians;
	} else if (typeof contextVar.jobs !== 'undefined' && contextVar.jobs.length > 0) {
		baseData = contextVar.jobs;
		isTechnicians = false;
	}

	/* constructing shift hashmap */
	if (arrayCheck(contextVar.shiftData)) {
		var shiftWithTimezoneHashMap = {};
		var lunchBreakWithTimezoneHashMap = {};
		contextVar.shiftData.forEach(obj => {
			if (typeof shiftData[obj.calendarId] === 'undefined' || shiftData[obj.calendarId] === '') {
				shiftData[obj.calendarId] = {};
			}
			var shiftDataArray = [];
			if (arrayCheck(obj.schedule)) {
				obj.schedule.forEach(function (object) {
					shiftDataArray.push({
						'openingTime': createDateString(object.start),
						'closingTime': createDateString(object.end)
					});
				});
			}
			shiftData[obj.calendarId][dayMap[obj.displayOrder]] = JSON.parse(JSON.stringify(shiftDataArray));

			if (typeof lunchBreakData[obj.calendarId] === 'undefined' || lunchBreakData[obj.calendarId] === '') {
				lunchBreakData[obj.calendarId] = {};
			}
			var lunchBreakDataArray = [];
			if (arrayCheck(obj.lunchBreakSchedule)) {
				obj.lunchBreakSchedule.forEach(function (object) {
					lunchBreakDataArray.push({
						'lunchStart': createDateString(object.start),
						'lunchEnd': createDateString(object.end),
						'lunchTime': Number(object.minimumBreakDuration)
					});
				});
			}
			lunchBreakData[obj.calendarId][dayMap[obj.displayOrder]] = JSON.parse(JSON.stringify(lunchBreakDataArray));
		});

		baseData.forEach(element => {
			if (typeof shiftWithTimezoneHashMap[element.calendarId + '|' + element.timezoneOffset] === 'undefined') {
				var shift = JSON.parse(JSON.stringify(shiftData[element.calendarId]));
				for (var key in shift) {
					if (shift[key].length) {
						shift[key][0].openingTime = convertToUTC(shift[key][0].openingTime, element.timezoneOffset);
						shift[key][0].closingTime = convertToUTC(shift[key][0].closingTime, element.timezoneOffset);
					}
				}
				shiftWithTimezoneHashMap[element.calendarId + '|' + element.timezoneOffset] = JSON.parse(JSON.stringify(calculateAvailabilityWithTimezone(shift, element.timezoneOffset)));
			}
		});

		baseData.forEach(element => {
			if (typeof lunchBreakWithTimezoneHashMap[element.calendarId + '|' + element.timezoneOffset] === 'undefined') {
				var lunchBreak = JSON.parse(JSON.stringify(lunchBreakData[element.calendarId]));
				for (var key in lunchBreak) {
					if (lunchBreak[key].length) {
						lunchBreak[key][0].lunchStart = convertToUTC(lunchBreak[key][0].lunchStart, element.timezoneOffset);
						lunchBreak[key][0].lunchEnd = convertToUTC(lunchBreak[key][0].lunchEnd, element.timezoneOffset);
						lunchBreak[key][0].lunchTime = lunchBreak[key][0].lunchTime;
					}
				}
				lunchBreakWithTimezoneHashMap[element.calendarId + '|' + element.timezoneOffset] = JSON.parse(JSON.stringify(calculateLunchBreakWithTimezone(lunchBreak, element.timezoneOffset)));
			}
		});
	}

	/* replacing calendarMap, availability and availability with overTime with respective hashmap */
	if (arrayCheck(baseData)) {
		if (isTechnicians) {
			baseData.forEach(element => {
				element.availability = shiftWithTimezoneHashMap[element.calendarId + '|' + element.timezoneOffset] || [];
				element.calendarMap = (element.calendarMap || []).concat(holidayData[element.calendarId] || []);
				element.lunchTime = lunchBreakWithTimezoneHashMap[element.calendarId + '|' + element.timezoneOffset] || [];
			});
		} else {
			contextVar.sites = {};
			baseData.forEach(element => {
				if (typeof contextVar.sites[element.siteId] === 'undefined') {
					contextVar.sites[element.siteId] = {};
					contextVar.sites[element.siteId].availability = shiftWithTimezoneHashMap[element.calendarId + '|' + element.timezoneOffset];
					contextVar.sites[element.siteId]["non-availability"] = holidayData[element.calendarId] || [];
				}
			});
		}
	}
}