{
	var startDate = new Date();
	var endDate = new Date();
	var dateFilter = '';
	var filter = '';

	if (typeof contextVar.timeFrameFilter !== 'undefined' && contextVar.timeFrameFilter !== '') {
		if (contextVar.timeFrameFilter === 'tomorrow') {
			startDate.setDate(startDate.getDate() + 1);
			startDate.setHours(0, 0, 0, 0);
			startDate.setMinutes(startDate.getMinutes() + contextVar.timezoneOffset);
			endDate.setDate(endDate.getDate() + 1);
		} else if (contextVar.timeFrameFilter === 'next3Days') {
			endDate.setDate(endDate.getDate() + 2);
		} else if (contextVar.timeFrameFilter === 'next7Days') {
			endDate.setDate(endDate.getDate() + 6);
		}
		endDate.setHours(23, 59, 0, 0);
		endDate.setMinutes(endDate.getMinutes() + contextVar.timezoneOffset);
	}
	contextVar.startDate = startDate.toISOString().replace('T', ' ').replace('Z', '');
	contextVar.endDate = endDate.toISOString().replace('T', ' ').replace('Z', '');
	dateFilter = '({$workOrderTaskScheduledDate} BETWEEN {@startDate} AND {@endDate})';
	filter = dateFilter;
}

filter = filter + ' AND ' + "({$workOrderTaskStatusId} = 'workOrderTaskScheduled')";

if (typeof contextVar.isAllFilterApplied !== 'undefined' && contextVar.isAllFilterApplied !== true) {
	if (typeof contextVar.siteIdList !== 'undefined' && contextVar.siteIdList.length > 0) {
		filter = filter + ' AND ' + '({$site.id} in {@siteIdList})';
	}
	if (typeof contextVar.workOrderIdList !== 'undefined' && contextVar.workOrderIdList.length > 0) {
		filter = filter + ' AND ' + '({$workOrder.id} in {@workOrderIdList})';
	}
	if (typeof contextVar.taskTypeIdList !== 'undefined' && contextVar.taskTypeIdList.length > 0) {
		filter = filter + ' AND ' + '({$workOrderTaskTypeId} in {@taskTypeIdList})';
	}
}
if (typeof contextVar === 'undefined' || typeof contextVar.filter === 'undefined' || contextVar.filter === '') {
	contextVar.filter = filter;
} else {
	contextVar.filter = contextVar.filter + ' AND ' + filter;
}
if (typeof contextVar === 'undefined' || typeof contextVar.orderBy === 'undefined' || contextVar.orderBy === '') {
	contextVar.orderBy = 'workOrderDeadline ASC, workOrderTaskScheduledDate ASC';
} else {
	contextVar.orderBy = contextVar.orderBy;
}