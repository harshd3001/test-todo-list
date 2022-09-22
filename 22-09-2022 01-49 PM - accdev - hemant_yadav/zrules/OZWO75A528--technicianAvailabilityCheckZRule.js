/* polyfill to get date time in string */
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

/* polyfill to get the time */
function getTime(dateString) {
	var time = '';
	if (typeof dateString === 'string' || dateString instanceof String) {
		time = dateString.split(' ')[1];
		time = time.substring(0, time.lastIndexOf(':'));
	}
	return time;
}

/* polyfill to get the date */
function getDate(dateString) {
	var time = '';
	if (typeof dateString === 'string' || dateString instanceof String) {
		time = dateString.split(' ')[0];
	}
	return time;
}

function localization(key) {
	switch (key) {
		case 'available':
			return typeof contextVar.localizedStatus !== 'undefined' && typeof contextVar.localizedStatus.availableTS !== 'undefined' ? contextVar.localizedStatus.availableTS : 'Available';

		case 'booked':
			return typeof contextVar.localizedStatus !== 'undefined' && typeof contextVar.localizedStatus.bookedTS !== 'undefined' ? contextVar.localizedStatus.bookedTS : 'Booked';

		case 'onLeave':
			return typeof contextVar.localizedStatus !== 'undefined' && typeof contextVar.localizedStatus.onLeaveTS !== 'undefined' ? contextVar.localizedStatus.onLeaveTS : 'On Leave';

		case 'leavePlanned':
			return typeof contextVar.localizedStatus !== 'undefined' && typeof contextVar.localizedStatus.leavePlannedCrew !== 'undefined' ? contextVar.localizedStatus.leavePlannedCrew : 'Leave Planned';

		default:
			return typeof contextVar.localizedStatus !== "undefined" && typeof contextVar.localizedStatus.unavailableTS !== "undefined" ? contextVar.localizedStatus.unavailableTS : "Unavailable";
	}
}

/*  Funtion to check and calculate the necessary data
  1.check for the overtime data with weekly schedule data for different day

		-> if the technician day shift end time is same as technician overtime start time then 
		setting the end time of the day shift as overtime end date and time.

		-> if the technician day shift end time is 23:59:00.000 and technician overtime start time is 00:00:00.000 then setting shift end time as overtime end time and date.

		-> if the technician day shift start time is same as technician overtime end time then 
		setting the start time of the day shift as overtime start date and time.

		-> if the technician day shift end time is 00:00:00.000 and technician overtime start time is 23:59:00.000 then setting shift start time as overtime start time and date.

  2. Comparing whether the task falls in the shift slot or not */
function shiftComparison(shiftData, overtimeData, timezoneOffset) {
	shiftData.forEach(function (day) {
		overtimeData.forEach(function (overtime) {
			if (day.end === overtime.workforceOvertimeStartDate || (getTime(day.end) === "23:59" && getTime(timeOffsetCalculation(overtime.workforceOvertimeStartDate, timezoneOffset)) === "00:00")) {
				day.end = overtime.workforceOvertimeEndDate;
			}
			if (day.start === overtime.workforceOvertimeEndDate || (getTime(timeOffsetCalculation(overtime.workforceOvertimeEndDate, timezoneOffset)) === "23:59" && getTime(day.start) === "00:00" && datesDiff(getDate(overtime.workforceOvertimeEndDate), getDate(day.start)) === 1)) {
				day.start = overtime.workforceOvertimeStartDate;
			}
		});
	});
	/* check for whether task falls in weekly scheduled data */
	for (let day of shiftData) {
		flag = (compareDates(startDate, day.start) && compareDates(day.end, endDate));
		if (flag) break;
	}

	if (!flag) {
		contextVar.isValid = false;
		techAvailability = localization();
	}
}
/* to calculate the offset time */
function timeOffsetCalculation(date, timezoneOffset, convertingTo) {
	return (convertingTo && convertingTo === 'UTC') ? toDateString(new Date(new Date(date).getTime() + (timezoneOffset * 60000))) : toDateString(new Date(new Date(date).getTime() - (timezoneOffset * 60000)));
}

{
	/* 	reusable function to compare date */
	var compareDates = function (date1, date2) {
		date1 = new Date(date1);
		date1.setMilliseconds(0);
		date1.setSeconds(0);
		date2 = new Date(date2);
		date2.setMilliseconds(0);
		date2.setSeconds(0);

		return (date1 >= date2);
	};

	/* 	to calculate difference in date */
	var datesDiff = function (date1, date2) {
		var timeDiff = (new Date(date1)) - (new Date(date2));
		var diffDays = timeDiff / (1000 * 3600 * 24);
		return diffDays;
	};

	/* 	reusable function to set date */
	var setDates = function (date1, date2) {
		return (getDate(date1) + ' ' + date2);
	};


	var convertArrayToObject = function (objectToBeFiltered, type, userId) {
		objectToBeFiltered = JSON.parse(JSON.stringify(objectToBeFiltered));
		if (filteredData[userId] && filteredData[userId][type]) {
			if (Array.isArray(objectToBeFiltered) && objectToBeFiltered.length > 0) {
				filteredData[userId][type] = filteredData[userId][type].concat(objectToBeFiltered);
			} else {
				filteredData[userId][type].push(objectToBeFiltered);
			}
		} else if (filteredData[userId] && !filteredData[userId][type]) {
			filteredData[userId][type] = [];
			if (Array.isArray(objectToBeFiltered) && objectToBeFiltered.length > 0) {
				filteredData[userId][type] = filteredData[userId][type].concat(objectToBeFiltered);
			} else {
				filteredData[userId][type].push(objectToBeFiltered);
			}
		} else {
			filteredData[userId] = {};
			filteredData[userId][type] = [];
			if (Array.isArray(objectToBeFiltered) && objectToBeFiltered.length > 0) {
				filteredData[userId][type] = filteredData[userId][type].concat(objectToBeFiltered);
			} else {
				filteredData[userId][type].push(objectToBeFiltered);
			}
		}
	};

	/* 	This function calculates the shaded area shown in calendar view when a technician is on leave or has a holiday on his shift */
	var calculateBlockDataForCalendar = function () {
		if (typeof contextVar.schedulingAndDispatchData === 'undefined' || contextVar.schedulingAndDispatchData === '') contextVar.schedulingAndDispatchData = [];

		/* In the below block we are splitting/adjusting the holiday date according to the overtime of a technician. Eg: If a technician has an overtime for 3 hours on a public holiday, then we will split the holiday into two parts: from start date of the holiday to start time of the overtime and from end time of the overtime to the end time of the holiday so the shaded area is not shown for those 3 hours calendar view */

		if (typeof filteredData[currentWorkForceUserId].overtime !== 'undefined' && filteredData[currentWorkForceUserId].overtime.length > 0 && typeof filteredData[currentWorkForceUserId].holidays !== 'undefined' && filteredData[currentWorkForceUserId].holidays.length > 0) {
			for (var o = 0; o < filteredData[currentWorkForceUserId].overtime.length; o++) {
				for (var h = 0; h < filteredData[currentWorkForceUserId].holidays.length; h++) {
					var deleteIndex = -1,
						insertIndex = -1,
						holidayToInsert = {};
					if (compareDates(filteredData[currentWorkForceUserId].holidays[h].holidayDate, filteredData[currentWorkForceUserId].overtime[o].workforceOvertimeStartDate) && compareDates(filteredData[currentWorkForceUserId].holidays[h].holidayEndDate, filteredData[currentWorkForceUserId].overtime[o].workforceOvertimeEndDate) && compareDates(filteredData[currentWorkForceUserId].overtime[o].workforceOvertimeEndDate, filteredData[currentWorkForceUserId].holidays[h].holidayDate)) {
						filteredData[currentWorkForceUserId].holidays[h].holidayDate = filteredData[currentWorkForceUserId].overtime[o].workforceOvertimeEndDate;
					} else if (compareDates(filteredData[currentWorkForceUserId].overtime[o].workforceOvertimeStartDate, filteredData[currentWorkForceUserId].holidays[h].holidayDate) && compareDates(filteredData[currentWorkForceUserId].overtime[o].workforceOvertimeEndDate, filteredData[currentWorkForceUserId].holidays[h].holidayEndDate) && compareDates(filteredData[currentWorkForceUserId].holidays[h].holidayDate, filteredData[currentWorkForceUserId].overtime[o].workforceOvertimeEndDate)) {
						filteredData[currentWorkForceUserId].holidays[h].holidayEndDate = filteredData[currentWorkForceUserId].overtime[o].workforceOvertimeStartDate;
					} else if (compareDates(filteredData[currentWorkForceUserId].holidays[h].holidayDate, filteredData[currentWorkForceUserId].overtime[o].workforceOvertimeStartDate) && compareDates(filteredData[currentWorkForceUserId].overtime[o].workforceOvertimeEndDate, filteredData[currentWorkForceUserId].holidays[h].holidayEndDate)) {
						deleteIndex = h;
					} else if (compareDates(filteredData[currentWorkForceUserId].overtime[o].workforceOvertimeStartDate, filteredData[currentWorkForceUserId].holidays[h].holidayDate) && compareDates(filteredData[currentWorkForceUserId].holidays[h].holidayEndDate, filteredData[currentWorkForceUserId].overtime[o].workforceOvertimeEndDate)) {
						holidayToInsert = {
							'currentWorkForceUserId': currentWorkForceUserId,
							'holidayEndDate': filteredData[currentWorkForceUserId].holidays[h].holidayEndDate,
							'holidayDate': filteredData[currentWorkForceUserId].overtime[o].workforceOvertimeEndDate
						};
						insertIndex = h + 1;
						filteredData[currentWorkForceUserId].holidays[h].holidayEndDate = filteredData[currentWorkForceUserId].overtime[o].workforceOvertimeStartDate;
					} else if (compareDates(filteredData[currentWorkForceUserId].holidays[h].holidayDate, filteredData[currentWorkForceUserId].overtime[o].workforceOvertimeEndDate)) {
						break;
					}
					if (deleteIndex != -1) {
						filteredData[currentWorkForceUserId].holidays.splice(deleteIndex, 1);
					} else if (insertIndex != -1) {
						filteredData[currentWorkForceUserId].holidays.splice(insertIndex, 0, holidayToInsert);
					}
				}
			}
		}
		var obj = {};
		/* 	 Here we are inserting all the leaves in the schedulingAndDispatchData with type unAvailable so that shaded area is shown for leaves of the technician */
		if (filteredData[currentWorkForceUserId].leaves) {
			filteredData[currentWorkForceUserId].leaves.forEach(function (leave) {
				obj = {
					'startTime': leave.workforceLeaveStartDate,
					'endTime': leave.workforceLeaveEndDate,
					'userId': currentWorkForceUserId,
					'type': 'unAvailable'
				};
				contextVar.schedulingAndDispatchData.push(obj);
			});
		}
		/*  Here we are inserting all the holidays in the schedulingAndDispatchData with type unAvailable so that shaded area is shown for holidays of the technician */
		if (filteredData[currentWorkForceUserId].holidays) {
			filteredData[currentWorkForceUserId].holidays.forEach(function (holiday) {
				obj = {
					'startTime': holiday.holidayDate,
					'endTime': holiday.holidayEndDate,
					'userId': currentWorkForceUserId,
					'type': 'unAvailable'
				};
				contextVar.schedulingAndDispatchData.push(obj);
			});
		}
	};

	/*  This function will return date in string after considering the timezoneOffset i.e. the local time instead of UTC time */
	var addMinutes = function (date) {
		return toDateString(new Date(date.getTime() - (contextVar.timezoneOffset * 60000)));
	};

	/* In the below function we are calculating the shiftTime  for a technician for a given task. In case of split shifts, we show the shift nearest to the task's start time*/
	var setShiftTimeForViewAllTechnicians = function () {

		var shift;
		if (filteredData[currentWorkForceUserId] && filteredData[currentWorkForceUserId].shifts) {
			shift = filteredData[currentWorkForceUserId].shifts.filter(function (element) {
				return element.weeklyScheduleDisplayOrder == contextVar.startDayDisplayOrder;
			})[0];
		}

		let selectedShift = {};
		if (shift && shift.weeklyScheduleSchedule && shift.weeklyScheduleSchedule.length == 2) {
			var newDate = toDateString(new Date()).split(' ')[0];
			var newStartDate = (new Date(newDate + ' ' + startDate.split(' ')[1])).getTime();
			var shift1 = (new Date(newDate + ' ' + shift.weeklyScheduleSchedule[0].start)).getTime();
			var shift2 = (new Date(newDate + ' ' + shift.weeklyScheduleSchedule[1].start)).getTime();

			/* selectedShift will be the shift nearest to the start time of the task */
			selectedShift = (Math.abs(newStartDate - shift1) > Math.abs(newStartDate - shift2)) ? shift.weeklyScheduleSchedule[1] : shift.weeklyScheduleSchedule[0];
		} else if (shift && shift.weeklyScheduleSchedule && shift.weeklyScheduleSchedule.length === 1) {
			selectedShift = shift.weeklyScheduleSchedule[0];
		}

		if (selectedShift && selectedShift.start && selectedShift.end) {
			contextVar.techniciansData[i].shiftTime = [Object.assign({}, selectedShift)];
		} else {
			contextVar.techniciansData[i].shiftTime = '-';
		}
	};

	var startDate, endDate;

	/* setting the start date & time of the task and end date & time of the task. */
	startDate = contextVar.startDate;
	endDate = contextVar.endDate;

	/* Mapping the leaves, overtime, holidays, shifts, tasks to their respective userIds in a single object with keys as the userIds */
	var typeOfFilters = ['leaves', 'overtime', 'holidays', 'tasks'];
	var listToFilterArray = ['technicianLeaveData', 'technicianOvertimeData', 'technicianHolidayData', 'technicianTaskData'];
	var filteredData = {};
	for (var i in typeOfFilters) {
		for (var j in contextVar[listToFilterArray[i]]) {
			convertArrayToObject(contextVar[listToFilterArray[i]][j], typeOfFilters[i], contextVar[listToFilterArray[i]][j].workforceUserId);
		}
	}
	if (Array.isArray(contextVar.technicianShiftData) && contextVar.technicianShiftData.length > 0) {
		/* To create Shift Object */
		var shiftObj = {};
		/* forEach loop for technician shift data */
		contextVar.technicianShiftData.forEach(function (ele) {
			if (typeof shiftObj[ele.weeklyScheduleCalendarId] === "undefined") {
				shiftObj[ele.weeklyScheduleCalendarId] = [];
			}
			shiftObj[ele.weeklyScheduleCalendarId].push(Object.assign(ele));
		});
		/* For Technician Shift Data */
		contextVar.techniciansData.forEach(function (element) {
			convertArrayToObject(shiftObj[element.workforceCalendarId], "shifts", element.workforceUserId);
		});
	}
	/* looping through all the technicians to get the availability or their validity status according to their overtime, shifts, leaves, holidays */
	var currentWorkForceUserId, schedulingAndDispatchData = [];
	for (var i = 0; i < contextVar.techniciansData.length; i++) {
		contextVar.isValid = true;
		var shiftStartDay = [],
			shiftEndDay = [],
			multiDayObj = {},
			multiDay = [],
			flag = false;
		currentWorkForceUserId = contextVar.techniciansData[i].workforceUserId;
		var timezoneOffset = contextVar.techniciansData[i].timezoneOffset;

		/* making the technicians unavailable who are part of the crew */
		if (Array.isArray(contextVar.unavailableTechs) && contextVar.unavailableTechs.length > 0 && contextVar.unavailableTechs.indexOf(currentWorkForceUserId) !== -1) {
			contextVar.techniciansData[i].availability = localization();
			contextVar.techniciansData[i].isAvailable = false;
		} else {
			contextVar.techniciansData[i].availability = localization('available');
			contextVar.techniciansData[i].isAvailable = true;
		}

		if (filteredData[currentWorkForceUserId] && contextVar.workflowCall === 'fetchCalendarViewdata') {
			calculateBlockDataForCalendar();
			continue;
		} else {
			setShiftTimeForViewAllTechnicians();
		}

		if (contextVar.isValid && typeof filteredData[currentWorkForceUserId] !== 'undefined' && typeof filteredData[currentWorkForceUserId].tasks !== 'undefined') {

			/* check for whether the technician already have a task at that time slot */
			filteredData[currentWorkForceUserId].tasks.forEach(function (technicianTask) {

				/* check for whether start date and time or end date and time of new task falls between existing task */
				if ((compareDates(startDate, technicianTask.startTime) && compareDates(technicianTask.endTime, startDate)) || (compareDates(endDate, technicianTask.startTime) && compareDates(technicianTask.endTime, endDate) || (compareDates(technicianTask.startTime, startDate) && compareDates(endDate, technicianTask.endTime)))) {

					/* making technician not available for the task */
					contextVar.isValid = false;
					contextVar.techniciansData[i].availability = localization('booked');
					contextVar.techniciansData[i].isAvailable = false;

				}
			});
		}

		if (contextVar.isValid && typeof filteredData[currentWorkForceUserId] !== 'undefined') {

			/* check whether task falls in overtime of technician */
			if (contextVar.workflowCall !== 'crew') {
				contextVar.isOvertime = false;
				if (typeof filteredData[currentWorkForceUserId].overtime !== 'undefined') {
					filteredData[currentWorkForceUserId].overtime.forEach(function (element) {
						if (((compareDates(startDate, element.workforceOvertimeStartDate) && compareDates(element.workforceOvertimeEndDate, endDate)))) {
							contextVar.isValid = false;
							contextVar.techniciansData[i].availability = localization('available');
							contextVar.techniciansData[i].isAvailable = true;
						}
					});
				}
				/* check whether the technician has a holiday at the time of the task */
				if (contextVar.isValid && filteredData[currentWorkForceUserId].holidays) {
					var holiday = filteredData[currentWorkForceUserId].holidays.filter(function (holiday) {
						return ((compareDates(startDate, holiday.holidayDate) && compareDates(holiday.holidayEndDate, startDate)) || (compareDates(holiday.holidayEndDate, endDate) && compareDates(endDate, holiday.holidayDate)) || (compareDates(holiday.holidayDate, startDate) && compareDates(endDate, holiday.holidayDate)) || (compareDates(endDate, holiday.holidayEndDate) && compareDates(holiday.holidayEndDate, startDate)));
					});
					if (holiday.length) {
						contextVar.techniciansData[i].availability = localization('unavailable');
						contextVar.isValid = false;
						contextVar.techniciansData[i].isAvailable = false;
					}
				}
			}

			/* check whether technician is on leave at the time of the task */
			if (contextVar.isValid && typeof filteredData[currentWorkForceUserId].leaves !== 'undefined' && filteredData[currentWorkForceUserId].leaves.length > 0) {
				for (var j = 0; j < filteredData[currentWorkForceUserId].leaves.length; j++) {
					if ((compareDates(startDate, filteredData[currentWorkForceUserId].leaves[j].workforceLeaveStartDate) && compareDates(filteredData[currentWorkForceUserId].leaves[j].workforceLeaveEndDate, startDate)) || (compareDates(endDate, filteredData[currentWorkForceUserId].leaves[j].workforceLeaveStartDate) && compareDates(filteredData[currentWorkForceUserId].leaves[j].workforceLeaveEndDate, endDate)) || (compareDates(filteredData[currentWorkForceUserId].leaves[j].workforceLeaveStartDate, startDate) && compareDates(endDate, filteredData[currentWorkForceUserId].leaves[j].workforceLeaveEndDate))) {
						contextVar.techniciansData[i].availability = (contextVar.workflowCall && contextVar.workflowCall === 'crew') ? localization('leavePlanned') : localization('onLeave');
						contextVar.techniciansData[i].isAvailable = false;
						contextVar.isValid = false;
					}
				}
			}
		}
		if (contextVar.isValid && typeof filteredData[currentWorkForceUserId] !== 'undefined' && contextVar.workflowCall !== 'crew') {

			/* check for whether the task falls under weekly schedule of the technician task which has scheduled start date and end date on same day */
			if (contextVar.endDayDisplayOrder === contextVar.startDayDisplayOrder) {
				isAllDay = false;
				filteredData[currentWorkForceUserId].shifts.forEach(function (weekly, index, shifts) {
					if (weekly.weeklyScheduleSchedule.length > 0 && typeof weekly.weeklyScheduleSchedule[0].start !== 'undefined' && typeof weekly.weeklyScheduleSchedule[0].end !== 'undefined' && parseInt(weekly.weeklyScheduleDisplayOrder) === contextVar.startDayDisplayOrder) {
						isAllDay = weekly.weeklyScheduleIsAllDay;
						if (isAllDay) return;
						if (getTime(timeOffsetCalculation(startDate, timezoneOffset)) >= weekly.weeklyScheduleSchedule[0].start) {
							shiftStartDay = weekly.weeklyScheduleSchedule;
						} else {
							/*  Doing the next line so that if the displayOrder is 0, we need the data of weeklySchedule with display order 6, which will always come as the last record of the array 'shifts' */
							var previousIndex = weekly.weeklyScheduleDisplayOrder !== '0' ? index - 1 : shifts.length - 1;
							shiftStartDay = shifts[previousIndex].weeklyScheduleSchedule;
						}
						/* if there is no shift data then making technician unavailable */
						if (shiftStartDay.length === 0) {
							contextVar.isValid = false;
							contextVar.techniciansData[i].availability = localization();
							contextVar.techniciansData[i].isAvailable = false;
						}
						if (contextVar.isValid) {
							shiftStartDay.forEach(function (day) {
								day.start = timeOffsetCalculation(setDates(startDate, day.start), timezoneOffset, 'UTC');
								day.end = timeOffsetCalculation(setDates(startDate, day.end), timezoneOffset, 'UTC');
							});
						}
					}
				});
				if (!isAllDay) {
					if (filteredData[currentWorkForceUserId].overtime) {
						shiftComparison(shiftStartDay, filteredData[currentWorkForceUserId].overtime, timezoneOffset);
					}

					/* check for whether task falls in weekly scheduled data */
					shiftStartDay.forEach(function (day) {
						if (((compareDates(startDate, day.start) && compareDates(day.end, endDate)))) {
							flag = true;
						}
					});
					/* setting the technician to unavailable if flag is set as false */
					if (!flag) {
						contextVar.isValid = false;
						contextVar.techniciansData[i].isAvailable = false;
						contextVar.techniciansData[i].availability = localization();
					}
				}
			} else {
				/* task which has scheduled start date and end date on different day */
				isAllDayStart = false;
				isAllDayEnd = false;
				filteredData[currentWorkForceUserId].shifts.forEach(function (weekly) {

					/* setting weekly shift data of that particular day of task scheduled day in shiftStartDay */
					if (weekly.weeklyScheduleSchedule.length > 0 && typeof weekly.weeklyScheduleSchedule[0].start !== 'undefined' && typeof weekly.weeklyScheduleSchedule[0].end !== 'undefined' && parseInt(weekly.weeklyScheduleDisplayOrder) === contextVar.startDayDisplayOrder) {
						shiftStartDay = weekly.weeklyScheduleSchedule;
						isAllDayStart = weekly.weeklyScheduleIsAllDay;
					}

					/* setting weekly shift data of that particular day of task end day in shiftEndDay */
					if (weekly.weeklyScheduleSchedule.length > 0 && typeof weekly.weeklyScheduleSchedule[0].start !== 'undefined' && typeof weekly.weeklyScheduleSchedule[0].end !== 'undefined' && parseInt(weekly.weeklyScheduleDisplayOrder) === contextVar.endDayDisplayOrder) {
						shiftEndDay = weekly.weeklyScheduleSchedule;
						isAllDayEnd = weekly.weeklyScheduleIsAllDay;
					}
				});

				if (!(isAllDayStart && isAllDayEnd)) {
					/* if there is no shift data then making technician unavailable */
					if (shiftStartDay.length === 0 || shiftEndDay.length === 0) {
						contextVar.isValid = false;
						contextVar.techniciansData[i].availability = localization();
						contextVar.techniciansData[i].isAvailable = false;
					}
					if (contextVar.isValid) {
						shiftStartDay.forEach(function (shiftStart) {
							shiftEndDay.forEach(function (shiftEnd) {
								/* checking if first day end time is 23:59:00.000 and next day start time is 00:00:00.000, if so then setting startTime as startDate with time of weekly schedule shiftStart start time and endTime as endDate with time of weekly schedule shiftEnd end time */
								if (getTime(timeOffsetCalculation(shiftStart.end, timezoneOffset, 'UTC')) === '23:59' && getTime(timeOffsetCalculation(shiftEnd.start, timezoneOffset, 'UTC')) === '00:00') {
									multiDayObj = {
										'startTime': timeOffsetCalculation(setDates(startDate, shiftStart.start), timezoneOffset, 'UTC'),
										'endTime': (getTime(shiftEnd.end) <= getTime(shiftStart.start)) ? timeOffsetCalculation(setDates(endDate, shiftEnd.end), timezoneOffset, 'UTC') : timeOffsetCalculation(setDates(startDate, shiftEnd.end), timezoneOffset, 'UTC')
									};
									multiDay.push(multiDayObj);
								}
							});
						});
						/* setting date as startDate for weekly schedule time */
						shiftStartDay.forEach(function (shiftStart) {
							if (getTime(timeOffsetCalculation(shiftStart.end, timezoneOffset, 'UTC')) === '23:59') {
								return;
							} else {
								multiDayObj = {
									'startTime': timeOffsetCalculation(setDates(startDate, shiftStart.start), timezoneOffset, 'UTC'),
									'endTime': timeOffsetCalculation(setDates(startDate, shiftStart.end), timezoneOffset, 'UTC')
								};
								multiDay.push(multiDayObj);
							}
						});
						/* setting date as endDate for weekly schedule time */
						shiftEndDay.forEach(function (shiftEnd) {
							if (getTime(timeOffsetCalculation(shiftEnd.start, timezoneOffset, 'UTC')) === '00:00') {
								return;
							} else {
								multiDayObj = {
									'startTime': timeOffsetCalculation(setDates(endDate, shiftEnd.start), timezoneOffset, 'UTC'),
									'endTime': timeOffsetCalculation(setDates(endDate, shiftEnd.end), timezoneOffset, 'UTC')
								};
								multiDay.push(multiDayObj);
							}
						});
						if (filteredData[currentWorkForceUserId].overtime) {
							shiftComparison(multiDay, filteredData[currentWorkForceUserId].overtime);
						}
					}

					/* check for whether task falls in weekly scheduled data */
					multiDay.forEach(function (day) {
						if (((compareDates(startDate, day.start) && compareDates(day.end, endDate)))) {
							flag = true;
						}
					});
					/* setting the technician to unavailable if flag is set as false */
					if (!flag) {
						contextVar.isValid = false;
						contextVar.techniciansData[i].isAvailable = false;
						contextVar.techniciansData[i].availability = localization();
					}
				}
			}
		}
	}
}