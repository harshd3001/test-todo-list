contextVar.schedulerLog = [];
var startDate = new Date();
startDate.setSeconds(0, 0);
startDate = startDate.toISOString().replace('T', ' ').replace('Z', '');
var endDate = new Date();
endDate.setDate(endDate.getDate() + contextVar.noOfDaysSchedulerWillSearch);
endDate.setSeconds(0, 0);
endDate = endDate.toISOString().replace('T', ' ').replace('Z', '');

let taskTypeIdList = [],
	regionIdList = [],
	taskIdList = [],
	workOrderTypeIdList = [],
	customerIdList = [];

contextVar.workOrderTaskDataToAutoSchedule.forEach(function (element) {
	taskIdList.push(element.workOrderTaskId);
	taskTypeIdList.push(element.workOrderTaskTypeId);
	regionIdList.push(element.workOrderTaskRegionId);
	workOrderTypeIdList.push(element.workOrderTaskWorkOrderTypeId);
	customerIdList.push(element.workOrderTaskCustomerId);
});

let jsonData = {
	'context': {
		'currentDate': contextVar.currentDate,
		'statusIds': contextVar.statusIds,
		'startDate': startDate,
		'endDate': endDate,
		'taskIdList': taskIdList,
		'taskTypeIdList': Array.from(new Set(taskTypeIdList)),
		'regionIdList': Array.from(new Set(regionIdList)),
		'workOrderTypeIdList': Array.from(new Set(workOrderTypeIdList)),
		'customerIdList': Array.from(new Set(customerIdList)),
		'filter': contextVar.filter,
		'bumpedTaskToCriticalTaskMap': contextVar.bumpedTaskToCriticalTaskMap
	},
	'schedulerId': contextVar.schedulerId,
	'schedulerType': contextVar.schedulerType,
	'status': contextVar.status,
	'modelName': contextVar.modelName,
	'statusTargetModel': contextVar.statusTargetModel
};
contextVar.schedulerLog.push(jsonData);