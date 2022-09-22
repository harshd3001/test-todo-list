contextVar.workOrderTaskJsonObj = [];
contextVar.requiredStatus = false;
if (Array.isArray(contextVar.workOrderTask)) {
	for (var i = 0; i < contextVar.workOrderTask.length; i++) {
		createJson(contextVar.workOrderTask[i]);
	}
} else {
	createJson(contextVar.workOrderTask);
}

function createJson(workOrderTask) {
	var jsonData = {};
	if (contextVar.subAction === "deleteWorkOrderTask") {
		jsonData = {
			"recver": workOrderTask.recver,
			"id": workOrderTask.id
		};
	} else if (contextVar.subAction === "upsertWorkOrderTask") {
		for (var key in workOrderTask) {
			if (key === "recver") {
				continue;
			} else {
				jsonData[key] = workOrderTask[key];
			}
		}
		if ((typeof jsonData.scheduledDate !== "undefined" && jsonData.scheduledDate !== '') && (typeof jsonData.estimatedDuration !== "undefined" && jsonData.estimatedDuration !== '') && (typeof jsonData.dueDate === "undefined" || jsonData.dueDate === '')) {
			var dueDate = new Date(jsonData.scheduledDate);
			var estimatedDuration = Number(jsonData.estimatedDuration);
			// dueDate.setDate(dueDate.getDate() + estimatedDuration / (24 * 60));
			// dueDate.setHours(dueDate.getHours() + estimatedDuration / 60);
			// dueDate.setMinutes(dueDate.getMinutes() + estimatedDuration % 60);

			//setting the due date ahead from the scheduled date by adding the estimated duration to the scheduled date
			dueDate.setSeconds(estimatedDuration * 60);
			jsonData.dueDate = dueDate.toISOString().replace('T', ' ').replace('Z', '');
		}
		if (jsonData.statusId === 'workOrderTaskCompleted' || jsonData.statusId === 'workOrderTaskRejected' || jsonData.statusId === 'workOrderTaskCancelled') {
			var completedDate = new Date();
			jsonData.completedDate = completedDate.toISOString().replace('T', ' ').replace('Z', '');
			if (jsonData.statusId === 'workOrderTaskCancelled') {
				jsonData.cancelledDate = completedDate.toISOString().replace('T', ' ').replace('Z', '');
				if (Array.isArray(contextVar.currentUserDetail) && contextVar.currentUserDetail.length > 0) {
					jsonData.cancelledBy = contextVar.currentUserDetail[0].userId;

				} else {
					jsonData.cancelledBy = '';
				}
				if(Array.isArray(contextVar.cancellationData) && contextVar.cancellationData.length > 0){
					jsonData.cancellationReason = contextVar.cancellationData[0].listOptionAnswerOptionText; 
				}

			}
		}
	}
	if (jsonData.statusId === 'workOrderTaskScheduled' || jsonData.statusId === 'workOrderTaskDispatched') {
		contextVar.requiredStatus = true;
		contextVar.workOrderTaskId = jsonData.id;
	}
	contextVar.workOrderTaskJsonObj.push(jsonData);
}