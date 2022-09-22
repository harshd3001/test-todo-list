var filter = '({$workOrder.deadline} > {@deadlineDateFilter} OR {$workOrder.deadline} IS NULL) AND ({$workOrderTask.isLongDurationTask} = false OR {$workOrderTask.isLongDurationTask} IS NULL) AND ';
contextVar.deadlineDateFilter = contextVar.startDate;
if (typeof contextVar.taskScheduleBreakDownData !== 'undefined' && contextVar.taskScheduleBreakDownData.length > 0) {
	contextVar.taskScheduleBreakDownData.forEach(element => {
		if (element.taskScheduleBreakdown > 1) {
			contextVar.taskIdsToBeNeglected.push(element.id);
		}
	});
}
if ((typeof contextVar.schedulerDecision !== 'undefined' && contextVar.schedulerDecision === 'onlyAssign') && (typeof contextVar.startDate !== 'undefined' && contextVar.startDate !== '') && (typeof contextVar.endDate !== 'undefined' && contextVar.endDate !== '')) {
	dateFilter = '{$workOrderTaskScheduledDate} BETWEEN {@startDate} AND {@endDate}';
	filter = filter + dateFilter;
}

if (typeof contextVar.taskTypeFilter !== 'undefined' && (typeof contextVar.schedulerDecision !== 'undefined' && contextVar.schedulerDecision === 'onlyAssign')) {
	filter = filter + ' AND ' + '({$workOrderTaskTypeId} in {@taskTypeFilter})';
} else {
	filter = filter + '({$workOrderTaskTypeId} in {@taskTypeFilter})';
}

if (typeof contextVar.regionFilter !== 'undefined') {
	filter = filter + ' AND ' + '({$regionId} in {@regionFilter})';
}

if (typeof contextVar.schedulerDecision !== 'undefined' && contextVar.schedulerDecision === 'scheduleAndAssign') {
	if (typeof contextVar.taskStatusFilter1 !== 'undefined' && contextVar.taskStatusFilter1.length > 0) {
		contextVar.taskStatusFilter1.forEach(element => {
			contextVar.statusList.push(element.value);
		});
		filter = filter + ' AND ' + '({$workOrderTaskStatusId} in {@statusList})';
	}
} else {
	if (typeof contextVar.taskStatusFilter2 !== 'undefined' && contextVar.taskStatusFilter2.length > 0) {
		contextVar.taskStatusFilter2.forEach(element => {
			contextVar.statusList.push(element.value);
		});
		filter = filter + ' AND ' + '({$workOrderTaskStatusId} in {@statusList})';
	}
}

if (typeof contextVar.isAllFilterApplied !== 'undefined' && contextVar.isAllFilterApplied !== true) {
	if (typeof contextVar.siteIdList !== 'undefined' && contextVar.siteIdList.length > 0) {
		filter = filter + ' AND ' + '({$site.id} in {@siteIdList})';
	}
	if (typeof contextVar.workOrderIdList !== 'undefined' && contextVar.workOrderIdList.length > 0) {
		filter = filter + ' AND ' + '({$workOrder.id} in {@workOrderIdList})';
	}
}
filter = filter + ' AND ' + '({$customer.id} = {$site.customerId})';
if (contextVar.taskIdsToBeNeglected.length > 0) {
	filter = filter + ' AND ' + '({$workOrderTask.id} NOT IN {@taskIdsToBeNeglected})';
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