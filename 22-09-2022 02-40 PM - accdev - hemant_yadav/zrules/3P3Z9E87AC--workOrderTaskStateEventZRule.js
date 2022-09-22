{
	/* Work Order Status Update Requirement

	Open:
	No Tasks within the WO have been scheduled (Task = Open or Draft status)
	WO transitions to Scheduled once at least one task transitions to Scheduled

	Scheduled:
	At least one task in the WO is in Scheduled or Dispatched status
	ifthe one task that is Scheduled / Dispatched returns back to Open, the WO should also transition back to Open status.

	In Progress:
	At least one task in the WO is In Progress or Pending Review
	ifthere is only one Task and it is rejected, Task Status = Reopened, then WO goes back to Open status

	Completed:
	All tasks in the WO are Completed or Rejected or Cancelled(they have been approved).
	
	Cancelled:
	All tasks in the WO are Cancelled or Rejected or Cancelled(they have been approved).

	ZProcessInstance requirements for each task status:

	Draft:
	No change ZProcessInstance

	Open:
	Clear existing entries in ZProcessInstance
	No new entry in ZProcessInstance

	Reopened:
	No change ZProcessInstance

	Scheduled:
	Clear existing entries in ZProcessInstance
	No new entry in ZProcessInstance

	Dispatched:
	Clear existing entries in ZProcessInstance
	New entry in ZProcessInstance
	
	In Progress:
	No change ZProcessInstance

	Pending Review:
	No change ZProcessInstance

	Completed:
	No change ZProcessInstance

	Rejected:
	No change ZProcessInstance
	
	Cancelled:
	Clear existing entries in ZProcessInstance
	*/

	contextVar.workOrder = contextVar.workOrderData[0];
	contextVar.autoCheckoutReqd = false;
	contextVar.setAllSendFurtherRecommendationToTrue = false;
	contextVar.updateReqd = false;
	contextVar.jsonObj = [];
	contextVar.jsonObj.push({
		"id": contextVar.data.workOrderId,
		"statusId": ""
	});
	contextVar.deleteZProcessInstanceReqd = false;
	contextVar.createZProcessInstanceReqd = false;
	if (contextVar.workOrderTaskStatusId === contextVar.workOrderTaskDraft) {
		contextVar.updateReqd = false;
		contextVar.deleteZProcessInstanceReqd = false;
		contextVar.createZProcessInstanceReqd = false;
	} else if (contextVar.workOrderTaskStatusId === contextVar.workOrderTaskOpen) {
		contextVar.deleteZProcessInstanceReqd = true;
		contextVar.createZProcessInstanceReqd = false;
		if (contextVar.workOrder.statusId != contextVar.workOrderOpen) {
			var activeTasks = contextVar.workOrderTaskData.filter(function (task) {
				return (task.statusId != contextVar.workOrderTaskDraft && task.statusId != contextVar.workOrderTaskOpen);
			});
			if (activeTasks.length > 0) {
				contextVar.updateReqd = false;
			} else {
				contextVar.updateReqd = true;
				contextVar.jsonObj[0].statusId = contextVar.workOrderOpen;
			}
		} else {
			contextVar.updateReqd = false;
		}
	} else if (contextVar.workOrderTaskStatusId === contextVar.workOrderTaskScheduled || contextVar.workOrderTaskStatusId === contextVar.workOrderTaskDispatched) {
		contextVar.setAllSendFurtherRecommendationToTrue = true;
		if (contextVar.workOrderTaskStatusId === contextVar.workOrderTaskScheduled) {
			contextVar.autoCheckoutReqd = true;
			contextVar.deleteZProcessInstanceReqd = true;
			contextVar.createZProcessInstanceReqd = false;
		} else if (contextVar.workOrderTaskStatusId === contextVar.workOrderTaskDispatched) {
			contextVar.deleteZProcessInstanceReqd = true;
			contextVar.createZProcessInstanceReqd = true;
		}
		if (contextVar.workOrder.statusId === contextVar.workOrderOpen) {
			contextVar.updateReqd = true;
			contextVar.jsonObj[0].statusId = contextVar.workOrderScheduled;
		} else if (contextVar.workOrder.statusId != contextVar.workOrderScheduled) {
			var activeTasks = contextVar.workOrderTaskData.filter(function (task) {
				return (task.statusId != contextVar.workOrderTaskDraft && task.statusId != contextVar.workOrderTaskOpen && task.statusId != contextVar.workOrderTaskScheduled && task.statusId != contextVar.workOrderTaskDispatched);
			});
			if (activeTasks.length > 0) {
				contextVar.updateReqd = false;
			} else {
				contextVar.updateReqd = true;
				contextVar.jsonObj[0].statusId = contextVar.workOrderScheduled;
			}
		} else {
			contextVar.updateReqd = false;
		}
	} else if (contextVar.workOrderTaskStatusId === contextVar.workOrderTaskInProgress || contextVar.workOrderTaskStatusId === contextVar.workOrderTaskPendingReview || contextVar.workOrderTaskStatusId === contextVar.workOrderTaskInTransit || contextVar.workOrderTaskStatusId === contextVar.workOrderTaskIncident || contextVar.workOrderTaskStatusId === contextVar.workOrderTaskDelayed || contextVar.workOrderTaskStatusId === contextVar.workOrderTaskDiscontinued) {
		contextVar.deleteZProcessInstanceReqd = false;
		contextVar.createZProcessInstanceReqd = false;
		if (contextVar.workOrderTaskStatusId === contextVar.workOrderTaskDiscontinued) {
			contextVar.autoCheckoutReqd = true;
			contextVar.deleteZProcessInstanceReqd = true;
		} else if (contextVar.workOrderTaskStatusId === contextVar.workOrderTaskPendingReview) {
			contextVar.deleteZProcessInstanceReqd = true;
		}
		if (contextVar.workOrder.statusId === contextVar.workOrderOpen || contextVar.workOrder.statusId === contextVar.workOrderScheduled) {
			contextVar.updateReqd = true;
			contextVar.jsonObj[0].statusId = contextVar.workOrderInProgress;
		} else {
			contextVar.updateReqd = false;
		}
	} else if (contextVar.workOrderTaskStatusId === contextVar.workOrderTaskCompleted || contextVar.workOrderTaskStatusId === contextVar.workOrderTaskRejected) {
		contextVar.deleteZProcessInstanceReqd = false;
		contextVar.createZProcessInstanceReqd = false;
		var activeTasks = contextVar.workOrderTaskData.filter(function (task) {
			return (task.statusId != contextVar.workOrderTaskCompleted && task.statusId != contextVar.workOrderTaskRejected && task.statusId != contextVar.workOrderTaskCancelled);
		});
		if (activeTasks.length > 0) {
			contextVar.updateReqd = false;
		} else {
			contextVar.jsonObj[0].completedDate = new Date().toISOString().replace(/T/, ' ').replace(/\\..+/, '').replace(/Z/, '');
			contextVar.updateReqd = true;
			contextVar.jsonObj[0].statusId = contextVar.workOrderCompleted;
		}
	} else if (contextVar.workOrderTaskStatusId === contextVar.workOrderTaskReopened) {
		contextVar.deleteZProcessInstanceReqd = false;
		contextVar.createZProcessInstanceReqd = false;
		var activeTasks = contextVar.workOrderTaskData.filter(function (task) {
			return (task.statusId != contextVar.workOrderTaskDraft && task.statusId != contextVar.workOrderTaskOpen && task.statusId != contextVar.workOrderTaskReopened);
		});
		if (activeTasks.length > 0) {
			contextVar.updateReqd = false;
		} else {
			contextVar.updateReqd = true;
			contextVar.jsonObj[0].statusId = contextVar.workOrderOpen;
		}
	} else if (contextVar.workOrderTaskStatusId === contextVar.workOrderTaskCancelled) {
		contextVar.deleteZProcessInstanceReqd = true;
		contextVar.createZProcessInstanceReqd = false;
		if (contextVar.workOrder.statusId !== contextVar.workOrderCancelled) {
			var activeTasks = contextVar.workOrderTaskData.filter(function (task) {
				return (task.statusId != contextVar.workOrderTaskRejected && task.statusId != contextVar.workOrderTaskCancelled);
			});
			if (activeTasks.length > 0) {
				workOrderStatus(activeTasks);
			} else {
				contextVar.updateReqd = true;
				var today = new Date().toISOString().replace(/T/, ' ').replace(/\\..+/, '').replace(/Z/, '');
				contextVar.jsonObj[0].cancellationDate = today;
				contextVar.jsonObj[0].statusId = contextVar.workOrderCancelled;
				if(Array.isArray(contextVar.currentUserDetail) && contextVar.currentUserDetail.length>0){
				contextVar.jsonObj[0].cancelledBy = contextVar.currentUserDetail[0].userId;
				    
				}
				else {contextVar.jsonObj[0].cancelledBy = '';}
				contextVar.jsonObj[0].cancellationReason = contextVar.workOrderTaskCancellationReason;
				contextVar.jsonObj[0].cancellationNotes = contextVar.workOrderTaskCancellationNotes;
				contextVar.jsonObj[0].completedDate = today;
			}
		}
	}

}

function workOrderStatus(activeTasks) {
	var statuses = {};
	activeTasks.forEach(function (task) {
		if (typeof statuses[task.statusId] !== 'undefined') {
			statuses[task.statusId] = 1;
		} else {
			statuses[task.statusId] = ++statuses[task.statusId];
		}
	});
	if (typeof statuses[contextVar.workOrderTaskPendingReview] !== 'undefined' || typeof statuses[contextVar.workOrderTaskInProgress] !== 'undefined' || typeof statuses[contextVar.workOrderTaskInTransit] !== 'undefined' || typeof statuses[contextVar.workOrderTaskIncident] !== 'undefined' || typeof statuses[contextVar.workOrderTaskDelayed] !== 'undefined' || typeof statuses[contextVar.workOrderTaskDiscontinued] !== 'undefined') {
		if (contextVar.workOrder.statusId != contextVar.workOrderInProgress) {
			contextVar.updateReqd = true;
			contextVar.jsonObj[0].statusId = contextVar.workOrderInProgress;
		}
	} else if (typeof statuses[contextVar.workOrderTaskScheduled] !== 'undefined' || typeof statuses[contextVar.workOrderTaskDispatched] !== 'undefined') {
		if (contextVar.workOrder.statusId != contextVar.workOrderScheduled) {
			contextVar.updateReqd = true;
			contextVar.jsonObj[0].statusId = contextVar.workOrderScheduled;
		}
	} else if (typeof statuses[contextVar.workOrderTaskOpen] !== 'undefined' || typeof statuses[contextVar.workOrderTaskDraft] !== 'undefined') {
		if (contextVar.workOrder.statusId != contextVar.workOrderOpen) {
			contextVar.updateReqd = true;
			contextVar.jsonObj[0].statusId = contextVar.workOrderOpen;
		}
	} else if (typeof statuses[contextVar.workOrderTaskCompleted] !== 'undefined') {
		contextVar.updateReqd = true;
		contextVar.jsonObj[0].completedDate = new Date().toISOString().replace(/T/, ' ').replace(/\\..+/, '').replace(/Z/, '');
		contextVar.jsonObj[0].statusId = contextVar.workOrderCompleted;
	} else {
		if (contextVar.workOrder.statusId != contextVar.workOrderOpen) {
			contextVar.updateReqd = true;
			contextVar.jsonObj[0].statusId = contextVar.workOrderOpen;
		}
	}
}