{
	/* Tech Calendar and ZProcessInstance requirements for each task status:

	Draft:
	No change to techCalendar

	Open:
	Clear existing entries in techCalendar
	No new entry in techCalendar

	Reopened:
	No change to techCalendar

	Scheduled:
	Clear existing entries in techCalendar
	New entry in techCalendar

	Dispatched:
	Clear existing entries in techCalendar
	New entry in techCalendar
	Update entry in ZProcessInstance
	
	In Progress:
	No change to techCalendar

	Pending Review:
	No change to techCalendar

	Completed:
	No change to techCalendar

	Rejected:
	No change to techCalendar
	
	Cancelled:
	Clear existing entries in techCalendar
	*/

	contextVar.deleteTechCalendarReqd = false;
	contextVar.createTechCalendarReqd = false;
	if (!contextVar.webTask) {
		if (contextVar.workOrderTaskStatusId === contextVar.workOrderTaskScheduled || contextVar.workOrderTaskStatusId === contextVar.workOrderTaskDispatched) {
			contextVar.deleteTechCalendarReqd = true;
			contextVar.createTechCalendarReqd = true;
		} else if (contextVar.workOrderTaskStatusId === contextVar.workOrderTaskPendingReview || contextVar.workOrderTaskStatusId === contextVar.workOrderTaskCancelled || contextVar.workOrderTaskStatusId === contextVar.workOrderTaskDiscontinued || contextVar.workOrderTaskStatusId === contextVar.workOrderTaskOpen) {
			contextVar.deleteTechCalendarReqd = true;
			contextVar.createTechCalendarReqd = false;
		}
	}
}