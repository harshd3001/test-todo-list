function randomGenerator(data) {
	return data[Math.floor(Math.random() * data.length)];
}

function randomTime(start, end) {
	// get the difference between the 2 dates, multiply it by 0-1, 
	// and add it to the start date to get a new date 
	var diff = end.getTime() - start.getTime();
	var new_diff = diff * Math.random();
	var date = new Date(start.getTime() + new_diff);
	return date;
}

function jsonConcat(o1, o2) {
	for (var key in o2) {
		if(typeof o2[key].siteList === 'undefined' || o2[key].siteList.length <= 0) {
			continue;
		}
		o1[key] = o2[key];
	}
	return o1;
}

function addTasks(siteId, statusId, scheduledDate, assignedToUserId, customerId) {
	workOrderTaskList['tasks'].push({
		'siteId': siteId,
		'statusId': statusId,
		'taskTypeId': contextVar.taskTypeId,
		'estimatedDuration': contextVar.estimatedDuration,
		'scheduledDate': scheduledDate.toISOString().replace('T',' ').replace('Z',''),
		'dueDate': (new Date(scheduledDate.setMinutes(scheduledDate.getMinutes() + parseInt(contextVar.estimatedDuration)))).toISOString().replace('T', ' ').replace('Z', ''),
		'statusTargetModel': 'workOrderTask',
		'notes': autoGenTxt,
		'assignedToUserId': assignedToUserId
	});
	if(typeof workOrderTaskList[customerId] == 'undefined') {
		workOrderTaskList[customerId] = 'Added';
		var contrId, calId, pri, sla;
		if(typeof combinedCustList[customerId]['slaData'] !== 'undefined') {
			contrId = combinedCustList[customerId]['contractId'];
			calId = combinedCustList[customerId]['calendarId'];
			pri = randomGenerator(combinedCustList[customerId]['slaData']).priorityPriority;
			sla = combinedCustList[customerId]['slaId'];
		} else {
			contrId = '';
			calId = randomGenerator(calendarData).calendarId;
			pri = randomGenerator(priorityList).ZPriorityPriorityId;
			sla = '';
		}
		workOrderTaskList['workOrders'].push({
			'requestedDate': scheduledDate.toISOString().replace('T', ' ').replace('Z', ''),
			'deadline': endDate.toISOString().replace('T', ' ').replace('Z', ''),
			'customerId': customerId,
			'contractId': contrId,
			'isTemplate': false,
			'statusId': workOrderOpen,
			'calendarId': calId,
			'priorityPriority': pri,
			'priorityTargetModel': 'workOrder',
			'workOrderTypeId': contextVar.workOrderTypeId,
			'statusTargetModel': 'workOrder',
			'slaId': sla,
			'notes': autoGenTxt
		});
	}
	if(siteCustomerListCounter < siteCustomerList.length - 1) {
		siteCustomerListCounter++;
	} else {
		siteCustomerListCounter = 0;
	}
	if(dailyTaskCounter < contextVar.totalCount - 1) {
		dailyTaskCounter++;
	} else {
		for (var i = 0; i < timeSlots.length; i++) {
			timeSlots[i] = new Date(timeSlots[i].setDate(timeSlots[i].getDate() + 1));
		}
		dailyTaskCounter = 0;
	}
}
var slaData = contextVar.slaData;
var regionSiteCustomerData = contextVar.regionSiteCustomerData;
var calendarData = contextVar.calendarData;
var priorityList = contextVar.priorityList;
var taskTypeData = contextVar.taskTypeData;
var workOrderTypeData = contextVar.workOrderTypeData;

var technicianData = contextVar.technicianData;
var customerListWithSla = {};
var customerListWithoutSla = {};
for (var i = 0; i < slaData.length; i++) {
	if(customerListWithSla[slaData[i]['customerId']]) {
		continue;
	}
	if(slaData[i]['slaData'].length > 0) {
		customerListWithSla[slaData[i]['customerId']] = {
			'slaData': slaData[i]['slaData'],
			'calendarId': slaData[i]['serviceWindow'][0]['id'],
			'contractId': slaData[i]['contractId'],
			'slaId': slaData[i]['slaId']
		};
	}
}


for (var i = 0; i < regionSiteCustomerData.length; i++) {
	if(customerListWithSla[regionSiteCustomerData[i]['customerId']]) {
		if(customerListWithSla[regionSiteCustomerData[i]['customerId']].siteList && customerListWithSla[regionSiteCustomerData[i]['customerId']].siteList.indexOf(regionSiteCustomerData[i]['siteId']) == -1) {
			customerListWithSla[regionSiteCustomerData[i]['customerId']].siteList.push(regionSiteCustomerData[i]['siteId']);
		} else {
			customerListWithSla[regionSiteCustomerData[i]['customerId']].siteList = [];
			customerListWithSla[regionSiteCustomerData[i]['customerId']].siteList.push(regionSiteCustomerData[i]['siteId']);
		}
	} else {
		if(typeof customerListWithoutSla[regionSiteCustomerData[i]['customerId']] == 'undefined') {
			customerListWithoutSla[regionSiteCustomerData[i]['customerId']] = {};
		}

		if(customerListWithoutSla[regionSiteCustomerData[i]['customerId']].siteList && customerListWithoutSla[regionSiteCustomerData[i]['customerId']].siteList.indexOf(regionSiteCustomerData[i]['siteId']) == -1) {
			customerListWithoutSla[regionSiteCustomerData[i]['customerId']].siteList.push(regionSiteCustomerData[i]['siteId']);
		} else {
			customerListWithoutSla[regionSiteCustomerData[i]['customerId']].siteList = [];
			customerListWithoutSla[regionSiteCustomerData[i]['customerId']].siteList.push(regionSiteCustomerData[i]['siteId']);
		}

	}
}

var combinedCustList = {};
combinedCustList = jsonConcat(combinedCustList, customerListWithSla);
combinedCustList = jsonConcat(combinedCustList, customerListWithoutSla);
var siteCustomerList = [];
for (var key in combinedCustList) {
	for (var i = 0; i < combinedCustList[key].siteList.length; i++) {
		siteCustomerList.push({
			'customerId': key,
			'siteId': combinedCustList[key].siteList[i]
		});
	}
}

var calendarIdList = [];

for (var i = 0; i < calendarData.length; i++) {
	if(calendarIdList.indexOf(calendarData[i]) == -1) {
		calendarIdList.push(calendarData[i]['calendarId']);
	}
}

var allPriorityList = [];

for (var i = 0; i < priorityList.length; i++) {
	if(calendarIdList.indexOf(priorityList[i]) == -1) {
		calendarIdList.push(priorityList[i]['ZPriorityPriorityId']);
	}
}

contextVar.taskTypeId = taskTypeData[0].id;
contextVar.workOrderTypeId = workOrderTypeData[0].id;
contextVar.estimatedDuration = parseInt(taskTypeData[0].estimatedDuration);

var openingTime, closingTime;
openingTime = contextVar.openingTime;
closingTime = contextVar.closingTime;

var openingTimeArray = openingTime.split(':');
var closingTimeArray = closingTime.split(':');


var startDate = new Date(contextVar.fromDate);
var endDate = new Date(contextVar.toDate);

var startDayStartTime = new Date(new Date(new Date(startDate).setHours(parseInt(openingTimeArray[0]))).setMinutes(parseInt(openingTimeArray[1])));
var startDayEndTime = new Date(new Date(new Date(startDate).setHours(parseInt(closingTimeArray[0]))).setMinutes(parseInt(closingTimeArray[1])));
var noOfMinutesInTheDay = Math.round(((startDayEndTime - startDayStartTime) / 1000) / 60);
var availableMin = noOfMinutesInTheDay - (contextVar.totalCount * contextVar.durationBetweenTasks);
var numberOfEqualSlots = availableMin / contextVar.estimatedDuration;
var timeSlots = [];
var timeSlotsTimeVar = new Date(startDayStartTime);
if(numberOfEqualSlots >= contextVar.totalCount) {
	for (var i = 0; i < contextVar.totalCount; i++) {
		timeSlots.push(new Date(timeSlotsTimeVar));
		timeSlotsTimeVar.setMinutes(timeSlotsTimeVar.getMinutes() + (contextVar.estimatedDuration + parseInt(contextVar.durationBetweenTasks)));
	}
} else {
	for (var i = 0; i < contextVar.totalCount; i++) {
		timeSlots.push(new Date(randomTime(startDayStartTime, startDayEndTime)));
	}
}

var count = 1;
var dayCount = 1;
var workOrderTaskList = {
	'workOrders': [],
	'tasks': []
};
var workOrderOpen = 'workOrderOpen';
var taskOpen = 'workOrderTaskOpen';
var taskSchedule = 'workOrderTaskScheduled';
var autoGenTxt = 'AutoGenerated';
var siteCustomerListCounter = 0;
var dailyTaskCounter = 0;
while (count <= contextVar.totalTasks) {
	for (var j = 0; j < contextVar.openCount; j++) {
		addTasks(siteCustomerList[siteCustomerListCounter]['siteId'], taskOpen, timeSlots[dailyTaskCounter], '', siteCustomerList[siteCustomerListCounter]['customerId']);
		continue;
	}
	for (var j = 0; j < contextVar.scheduledCount; j++) {
		addTasks(siteCustomerList[siteCustomerListCounter]['siteId'], taskSchedule, timeSlots[dailyTaskCounter], randomGenerator(technicianData).userId, siteCustomerList[siteCustomerListCounter]['customerId']);
		continue;
	}
	count = count + contextVar.totalCount;
}

contextVar.workOrderTaskList = workOrderTaskList;
contextVar.workOrderList = workOrderTaskList['workOrders'];
contextVar.taskList = workOrderTaskList['tasks'];