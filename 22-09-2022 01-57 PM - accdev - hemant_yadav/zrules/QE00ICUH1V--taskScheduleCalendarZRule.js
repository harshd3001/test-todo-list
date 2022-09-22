function checkIfArray(a) {
	return (typeof a !== 'undefined' && Array.isArray(a));
}

function checkForData(a) {
	return (typeof a !== 'undefined' && a !== '' && a !== null);
}

function findIndexOf(ar, obj) {
	let retVal = -1;
	if (checkIfArray(ar)) {
		ar.some((o, ind) => {
			if (o.id === obj) {
				retVal = ind;
				return true;
			}
		});
	}
	return retVal;
}

function validateDate(currentDate) {
	let dateValid = false;
	let cDate = new Date(currentDate).getTime();
	let sDate = new Date(contextVar.startDate).getTime();
	let eDate = new Date(contextVar.endDate).getTime();
	if (cDate >= sDate && cDate <= eDate) {
		dateValid = true;
	}
	return dateValid;
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

var compareDates = function (date1, date2) {
	date1 = toDateString(new Date(date1));
	date2 = toDateString(new Date(date2));

	return (date1 >= date2);
};

{
	contextVar.bryntumSchedulerData = {
		'resources': [], //For all the technician information
		'events': [], //For all the tasks information, mapped to each technician
		'resourceTimeRanges': [], //For all the technician specific calendar/available information, eg holidays/leaves etc.
		'calendars': [], // For all the calendars details.
		'timeRanges': [], //For all the generic technician calendar information, eg lunch/tea-break etc.
		'status': true
	};

	let typeOfTask = {
		'workOrderTaskScheduled': 'task',
		'workOrderTaskDispatched': 'task',
		'workOrderTaskInProgress': 'task',
		'workOrderTaskDiscontinued': 'task',
		'workOrderTaskIncident': 'task',
		'workOrderTaskInTransit': 'travel',
		'workOrderTaskDelayed': 'task'
	};

	let listOfTaskStatus = [
		"workOrderTaskDraft",
		"workOrderTaskOpen",
		"workOrderTaskScheduled",
		"workOrderTaskReopened",
		"workOrderTaskDispatched",
		"workOrderTaskInTransit",
		"workOrderTaskInProgress",
		"workOrderTaskDiscontinued",
		"workOrderTaskDelayed",
		"workOrderTaskIncident",
		"workOrderTaskPendingApproval",
		"workOrderTaskPendingReview",
		"workOrderTaskApproved",
		"workOrderTaskCompleted",
		"workOrderTaskRejected",
		"workOrderTaskSiteChangeRequest",
		"workOrderTaskCancelled"
	]

	let techAndTaskData = contextVar.techAndTaskData;
	var techData, taskData;
	if (checkForData(techAndTaskData)) {
		techData = techAndTaskData.techData;
		taskData = techAndTaskData.taskData;
	}

	if (checkIfArray(techData)) {
		techData.forEach((obj) => {
			contextVar.bryntumSchedulerData.resources.push({
				'important': true,
				'image': contextVar.defaultProfilePic,
				'name': obj.techName,
				'id': obj.id,
				'icons': checkForData(obj.icon) ? [obj.icon] : [],
				'lastSeenTime': obj.userLastSeenTime,
				'timezoneOffset': obj.timezoneOffset,
				'workforceCalendarId': obj.workforceCalendarId
			});
		});
	}

	let tempTaskData = [];


	if (checkIfArray(taskData)) {

		//Comparing the tasks present in the appointmentWindowTasksList and modifying the taskData with the appointmentWindow details
		if (checkForData(contextVar.appointmentWindowTasksList)) {
			tempTaskData = [];
			taskData.forEach(taskEle => {
				if (taskEle.workOrderTaskAppointmentBasedFlag) {
					contextVar.appointmentWindowTasksList.forEach(appWEle => {
						if (taskEle.id === appWEle.workOrderTaskAppointmentWindowTaskId) {
							taskEle = {
								...taskEle,
								'workOrderTaskAppointmentWindowId': appWEle.workOrderTaskAppointmentWindowId,
								'workOrderTaskAppointmentWindowStartDate': appWEle.workOrderTaskAppointmentWindowStartDate,
								'workOrderTaskAppointmentWindowEndDate': appWEle.workOrderTaskAppointmentWindowEndDate,
								'workOrderTaskAppointmentWindow': appWEle.workOrderTaskAppointmentWindow
							};
						}
					});
				}

				tempTaskData.push(taskEle);

			});
			taskData = tempTaskData;
		}

		//Populating data into events for Bryntum
		taskData.forEach((obj) => {
			if (validateDate(obj.scheduledStartTime) === true) {
				let bryntumObj = {};
				let eventId = obj.taskBreakdownId + '-' + obj.userId;
				let eventIndex = findIndexOf(contextVar.bryntumSchedulerData.events, eventId); //For finding existing object(duplicates) and their index.
				if (eventIndex === -1) {
					bryntumObj = {
						'alloweEventOverlap': false,
						'resourceId': obj.userId,
						'crewId': obj.crewId,
						'userName': obj.userName,
						'taskTypeCrewTask': obj.taskTypeCrewTask,
						'crewTask': obj.taskTypeCrewTask,
						'workOrderTaskTypeId': obj.workOrderTaskTypeId,
						'regionId': obj.regionId,
						'scheduledStartTime': obj.scheduledStartTime,
						'scheduledEndTime': obj.scheduledEndTime,
						'actualStartTime': obj.actualStartTime,
						'actualEndTime': obj.actualEndTime,
						'startDate': checkForData(obj.taskScheduleBreakdownStartDate) ? obj.taskScheduleBreakdownStartDate : checkForData(obj.scheduledStartTime) ? obj.scheduledStartTime : '-',
						'endDate': checkForData(obj.taskScheduleBreakdownEndDate) ? obj.taskScheduleBreakdownEndDate : checkForData(obj.scheduledEndTime) ? obj.scheduledEndTime : '-',
						'statusColor': obj.statusColor,
						'eventColor': obj.statusColor,
						'name': '[' + obj.ZPriorityName + '] ' + obj.id,
						'id': obj.taskBreakdownId + '-' + obj.userId,
						'workOrderTaskId': obj.id,
						'type': obj.taskTypeName,
						'icons': (checkForData(obj.taskAtRisk) && obj.taskAtRisk === true) ? ['@iconlib.CornWarning'] : [],
						'status': obj.status,
						'statusId': obj.statusId,
						'customerCompanyName': obj.customerCompanyName,
						'siteName': obj.siteName,
						'deadline': obj.workOrderDeadline,
						'workOrderDeadline': obj.workOrderDeadline,
						'regionName': obj.regionName,
						'workOrderId': obj.workOrderId,
						'taskTypeName': obj.taskTypeName,
						'priority': obj.ZPriorityName,
						'viewTravelStatus': obj.viewTravelStatus,
						'priorityIndex': obj.priority,
						'tooltipHeader': '<b>' + obj.taskTypeName + '</b><br/>' + obj.id,
						'taskAtRisk': checkForData(obj.taskAtRisk) ? obj.taskAtRisk : '',
						'alert': checkForData(obj.alert) ? obj.alert : '',
						'resultWebPageId': checkForData(obj.resultWebPageId) ? obj.resultWebPageId : '',
						'workOrderTaskEstimatedDuration': checkForData(obj.workOrderTaskEstimatedDuration) ? obj.workOrderTaskEstimatedDuration : '',
						'workOrderTaskEstimatedDurationMinutes': checkForData(obj.workOrderTaskEstimatedDurationMinutes) ? obj.workOrderTaskEstimatedDurationMinutes : '',
						'multiBreakdownTaskFlag': checkForData(obj.multiBreakdownTask) ? obj.multiBreakdownTask : false,
						'workOrderTaskAppointmentBasedFlag': checkForData(obj.workOrderTaskAppointmentBasedFlag) ? obj.workOrderTaskAppointmentBasedFlag : false,
						'workOrderTaskAppointmentWindowId': checkForData(obj.workOrderTaskAppointmentWindowId) ? obj.workOrderTaskAppointmentWindowId : '',
						'workOrderTaskAppointmentWindowStartDate': checkForData(obj.workOrderTaskAppointmentWindowStartDate) ? obj.workOrderTaskAppointmentWindowStartDate : '',
						'workOrderTaskAppointmentWindowEndDate': checkForData(obj.workOrderTaskAppointmentWindowEndDate) ? obj.workOrderTaskAppointmentWindowEndDate : '',
						'workOrderTaskAppointmentWindow': checkForData(obj.workOrderTaskAppointmentWindow) ? obj.workOrderTaskAppointmentWindow : '',
						'subEvents': []
					};
					contextVar.bryntumSchedulerData.events.push(bryntumObj);
				}
				else {
					//For pushing subEvents for the same/existing taskEvent

					/*let subEventObj = {
						'color': obj.statusColor,
						'endDate': obj.endTime,
						'name': obj.id,
						'id': obj.taskBreakdownId + '-' + obj.userId + '_' + obj.startTime + '|' + obj.endTime,
						'startDate': obj.startTime
					};*/

					//Modifying the Start and End Dates
					/*let startDateCheck = compareDates(contextVar.bryntumSchedulerData.events[eventIndex].startDate, subEventObj.startDate);
					if (startDateCheck === true) {
						contextVar.bryntumSchedulerData.events[eventIndex].startDate = subEventObj.startDate;
					}
					
					let endDateCheck = compareDates(subEventObj.endDate, contextVar.bryntumSchedulerData.events[eventIndex].endDate);
					if (endDateCheck === true) {
						contextVar.bryntumSchedulerData.events[eventIndex].endDate = subEventObj.endDate;
					}*/
					//contextVar.bryntumSchedulerData.events[eventIndex].alloweEventOverlap = true;
					//contextVar.bryntumSchedulerData.events[eventIndex].subEvents.push(subEventObj);

				}


			}
		});

	}

}