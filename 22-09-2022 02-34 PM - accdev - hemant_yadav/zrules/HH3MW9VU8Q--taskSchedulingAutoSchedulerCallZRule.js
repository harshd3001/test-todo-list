function insertData() {
	contextVar.schedulerLog.push({
		...contextVar.commonSchedulerLogData,
		initiatedByUserId: contextVar.currentUserId,
		context: {
			sites: JSON.parse(JSON.stringify(sites)),
			jobs: JSON.parse(JSON.stringify(jobs)),
			taskIdList: Array.from(new Set(taskIdList)),
			taskTypeIdList: Array.from(new Set(taskTypeIdList)),
			regionIdList: Array.from(new Set(regionIdList)),
			workOrderTypeIdList: Array.from(new Set(workOrderTypeIdList)),
			customerIdList: Array.from(new Set(customerIdList)),
			startDate: startDateLimit,
			endDate: greatestEndDate,
			schedulerTriggerContext: {
				sites: JSON.parse(JSON.stringify(sites)),
				jobs: JSON.parse(JSON.stringify(jobs)),
				startDate: startDateLimit,
				endDate: greatestEndDate,
			}
		}
	});
}
var taskIdList = [],
	taskTypeIdList = [],
	regionIdList = [],
	workOrderTypeIdList = [],
	customerIdList = [],
	jobs = [],
	sites = {},
	startDateLimit = contextVar.jobs[0].plannedDate,
	endDateLimit = contextVar.jobs[0].plannedDate.split(' ')[0] + ' 23:59:59.999',
	greatestEndDate;

greatestEndDate = contextVar.jobs[0].dueDate;

contextVar.jobs.forEach(job => {

	//If the current task's planned date is greater than the last task's end of day i.e. 23:59:59 of that day, then insert the existing data in the schedulerLog model and empty all the data for the next new scheduler log record
	if (job.plannedDate > endDateLimit) {
		insertData();
		taskIdList = [], taskTypeIdList = [], regionIdList = [], workOrderTypeIdList = [], customerIdList = [];
		jobs = [];
		sites = {};
		startDateLimit = job.plannedDate;
		endDateLimit = job.plannedDate.split(' ')[0] + ' 23:59:59.999';
		greatestEndDate = job.dueDate;
	}

	jobs.push(job);
	if (!sites[job.siteId]) sites[job.siteId] = contextVar.sites[job.siteId];
	if (job.dueDate > greatestEndDate) greatestEndDate = job.dueDate;
	taskIdList.push(job.id);
	taskTypeIdList.push(job.taskTypeId);
	regionIdList.push(job.regionId);
	workOrderTypeIdList.push(job.workOrderTypeId);
	customerIdList.push(job.customerId);

});

//Insert the last prepared log's data
insertData();