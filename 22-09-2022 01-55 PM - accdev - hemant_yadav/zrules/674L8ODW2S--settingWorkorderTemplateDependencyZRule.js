{
	//settingWorkOrdertemplate task dependency
	if (contextVar.workFlowName === 'workorderTemplateTaskDependencyFetchDataWF') {
		var templateTaskDependencyPrecedentTaskString = '';
		var templateTaskDependencyDependentTaskString = '';
		var templateTaskDependencyPrecedentTaskNameList = [];
		var templateTaskDependencyDependentTaskNameList = [];
		var templateTaskDependencyPrecedentTaskSingleCheck = false;
		if (typeof contextVar.templateTaskDependencyData !== 'undefined' && contextVar.templateTaskDependencyData.length > 0 && contextVar.templateTaskDependencyData !== '') {
			for (var i = 0; i < contextVar.templateTaskDependencyData.length; i++) {
				if (typeof contextVar.templateTaskDependencyData[i].templateTaskDependencyPrecedentTask !== 'undefined' && contextVar.templateTaskDependencyData[i].templateTaskDependencyPrecedentTask !== '' && contextVar.templateTaskDependencyData[i].templateTaskDependencyPrecedentTask.length > 0) {
					for (var j = 0; j < contextVar.templateTaskList.length; j++) {
						for (var k = 0; k < contextVar.templateTaskDependencyData[i].templateTaskDependencyPrecedentTask.length; k++) {
							if (contextVar.templateTaskDependencyData[i].templateTaskDependencyPrecedentTask.length === 1) {
								templateTaskDependencyPrecedentTaskSingleCheck = true;
							}
							if (contextVar.templateTaskList[j].workOrderTemplateTaskId == contextVar.templateTaskDependencyData[i].templateTaskDependencyPrecedentTask[k]) {
								if (templateTaskDependencyPrecedentTaskNameList.indexOf(contextVar.templateTaskList[j].workOrderTemplateTaskName) == -1) {
									templateTaskDependencyPrecedentTaskNameList.push(contextVar.templateTaskList[j].workOrderTemplateTaskName);
								}
							}
						}
					}
					templateTaskDependencyPrecedentTaskString = templateTaskDependencyPrecedentTaskNameList.toString();
					templateTaskDependencyPrecedentTaskNameList = [];
					delete contextVar.templateTaskDependencyData[i].templateTaskDependencyPrecedentTask;
					contextVar.templateTaskDependencyData[i].templateTaskDependencyPrecedentTask = templateTaskDependencyPrecedentTaskString;
				}
				if (typeof contextVar.templateTaskDependencyData[i].templateTaskDependencyDependentTask !== 'undefined' && contextVar.templateTaskDependencyData[i].templateTaskDependencyDependentTask !== '' && contextVar.templateTaskDependencyData[i].templateTaskDependencyDependentTask.length > 0) {
					for (var j = 0; j < contextVar.templateTaskList.length; j++) {
						for (var k = 0; k < contextVar.templateTaskDependencyData[i].templateTaskDependencyDependentTask.length; k++) {
							if (contextVar.templateTaskList[j].workOrderTemplateTaskId == contextVar.templateTaskDependencyData[i].templateTaskDependencyDependentTask[k]) {
								if (templateTaskDependencyDependentTaskNameList.indexOf(contextVar.templateTaskList[j].workOrderTemplateTaskName) == -1) {
									templateTaskDependencyDependentTaskNameList.push(contextVar.templateTaskList[j].workOrderTemplateTaskName);
								}
							}
						}
					}
					templateTaskDependencyDependentTaskString = templateTaskDependencyDependentTaskNameList.toString();
					templateTaskDependencyDependentTaskNameList = [];
					delete contextVar.templateTaskDependencyData[i].templateTaskDependencyDependentTask;
					contextVar.templateTaskDependencyData[i].templateTaskDependencyDependentTask = templateTaskDependencyDependentTaskString;
				}
				contextVar.taskDependencyStatusName.forEach(function (statusName) {
					if (statusName.zStatusId === contextVar.templateTaskDependencyData[i].templateTaskDependencyPrecedentStatusId) {
						contextVar.templateTaskDependencyData[i].templateTaskDependencyPrecedentStatusId = statusName.zStatusName;
					}
					if (statusName.zStatusId === contextVar.templateTaskDependencyData[i].templateTaskDependencyDependentStatusId) {
						contextVar.templateTaskDependencyData[i].templateTaskDependencyDependentStatusId = statusName.zStatusName;
					}
				});
				if (contextVar.templateTaskDependencyData[i].templateTaskDependencyEnforceAllDependency === false) {
					if (templateTaskDependencyPrecedentTaskSingleCheck) {
						contextVar.templateTaskDependencyData[i].templateTaskDependencyEnforceAllDependency = '-';
					} else {
						contextVar.templateTaskDependencyData[i].templateTaskDependencyEnforceAllDependency = 'Any of the tasks';
					}
				} else {
					contextVar.templateTaskDependencyData[i].templateTaskDependencyEnforceAllDependency = 'All';
				}
			}
		}
	}


	//workOrderTaskWF dependency
	if (contextVar.workFlowName === 'workorderTaskWF') {
		contextVar.mapTaskData = [];
		if (typeof contextVar.workOrderTasksData !== 'undefined' && contextVar.workOrderTasksData !== '' && contextVar.workOrderTasksData.length > 0 && typeof contextVar.data !== 'undefined' && contextVar.data !== '' && contextVar.data.length > 0) {
			for (var i = 0; i < contextVar.workOrderTasksData.length; i++) {
				contextVar.mapTaskData.push({
					templateTaskId: contextVar.workOrderTasksData[i].workOrderTemplateTaskId,
					taskId: contextVar.data[i].id
				});
			}
		}
		var taskDependencyPrecedentTaskList = [];
		var taskDependencyDependentTaskList = [];
		if (typeof contextVar.tasksDependencyData !== 'undefined' && contextVar.tasksDependencyData !== '' && contextVar.tasksDependencyData.length > 0) {
			for (var i = 0; i < contextVar.tasksDependencyData.length; i++) {
				if (typeof contextVar.tasksDependencyData[i].precedentTask !== 'undefined' && contextVar.tasksDependencyData[i].precedentTask !== '' && contextVar.tasksDependencyData[i].precedentTask.length > 0) {
					for (var j = 0; j < contextVar.mapTaskData.length; j++) {
						for (var k = 0; k < contextVar.tasksDependencyData[i].precedentTask.length; k++) {
							if (contextVar.mapTaskData[j].templateTaskId == contextVar.tasksDependencyData[i].precedentTask[k]) {
								if (taskDependencyPrecedentTaskList.indexOf(contextVar.mapTaskData[j].taskId) == -1) {
									taskDependencyPrecedentTaskList.push(contextVar.mapTaskData[j].taskId);
								}
							}
						}
					}
					if (taskDependencyPrecedentTaskList.length > 0) {
						contextVar.tasksDependencyData[i].precedentTask = taskDependencyPrecedentTaskList;
						taskDependencyPrecedentTaskList = [];
					}
				}
				if (typeof contextVar.tasksDependencyData[i].dependentTask !== 'undefined' && contextVar.tasksDependencyData[i].dependentTask !== '' && contextVar.tasksDependencyData[i].dependentTask.length > 0) {
					for (var j = 0; j < contextVar.mapTaskData.length; j++) {
						for (var k = 0; k < contextVar.tasksDependencyData[i].dependentTask.length; k++) {
							if (contextVar.mapTaskData[j].templateTaskId == contextVar.tasksDependencyData[i].dependentTask[k]) {
								if (taskDependencyDependentTaskList.indexOf(contextVar.mapTaskData[j].taskId) == -1) {
									taskDependencyDependentTaskList.push(contextVar.mapTaskData[j].taskId);
								}
							}
						}
					}
					if (taskDependencyDependentTaskList.length > 0) {
						contextVar.tasksDependencyData[i].dependentTask = taskDependencyDependentTaskList;
						taskDependencyDependentTaskList = [];
					}
				}
				contextVar.tasksDependencyData[i].workOrderId = contextVar.workOrderId;
				delete contextVar.tasksDependencyData[i].id;
				if (contextVar.tasksDependencyData[i].precedentTask.length === 1) {
					delete contextVar.tasksDependencyData[i].enforceAllDependency;
				}
			}
		}
	}


	//workOrderTemplateWF dependency
	if (contextVar.workFlowName === 'workorderTemplateWF') {
		var taskDependencyPrecedentTaskList = [];
		var taskDependencyDependentTaskList = [];
		if (typeof contextVar.tasksDependencyData !== 'undefined' && contextVar.tasksDependencyData !== '' && contextVar.tasksDependencyData.length > 0) {
			for (var i = 0; i < contextVar.tasksDependencyData.length; i++) {
				if (typeof contextVar.tasksDependencyData[i].precedentTask !== 'undefined' && contextVar.tasksDependencyData[i].precedentTask !== '' && contextVar.tasksDependencyData[i].precedentTask.length > 0) {
					for (var j = 0; j < contextVar.mapTaskData.length; j++) {
						for (var k = 0; k < contextVar.tasksDependencyData[i].precedentTask.length; k++) {
							if (contextVar.mapTaskData[j].taskId == contextVar.tasksDependencyData[i].precedentTask[k]) {
								if (taskDependencyPrecedentTaskList.indexOf(contextVar.mapTaskData[j].templateTaskId) == -1) {
									taskDependencyPrecedentTaskList.push(contextVar.mapTaskData[j].templateTaskId);
								}
							}
						}
					}
					if (taskDependencyPrecedentTaskList.length > 0) {
						contextVar.tasksDependencyData[i].precedentTask = taskDependencyPrecedentTaskList;
						taskDependencyPrecedentTaskList = [];
					}
				}
				if (typeof contextVar.tasksDependencyData[i].dependentTask !== 'undefined' && contextVar.tasksDependencyData[i].dependentTask !== '' && contextVar.tasksDependencyData[i].dependentTask.length > 0) {
					for (var j = 0; j < contextVar.mapTaskData.length; j++) {
						for (var k = 0; k < contextVar.tasksDependencyData[i].dependentTask.length; k++) {
							if (contextVar.mapTaskData[j].taskId == contextVar.tasksDependencyData[i].dependentTask[k]) {
								if (taskDependencyDependentTaskList.indexOf(contextVar.mapTaskData[j].templateTaskId) == -1) {
									taskDependencyDependentTaskList.push(contextVar.mapTaskData[j].templateTaskId);
								}
							}
						}
					}
					if (taskDependencyDependentTaskList.length > 0) {
						contextVar.tasksDependencyData[i].dependentTask = taskDependencyDependentTaskList;
						taskDependencyDependentTaskList = [];
					}
				}
				contextVar.tasksDependencyData[i].workOrderTemplateId = contextVar.workOrderTemplateId;
				delete contextVar.tasksDependencyData[i].id;
				if (contextVar.tasksDependencyData[i].precedentTask.length === 1) {
					delete contextVar.tasksDependencyData[i].enforceAllDependency;
				}
			}
		}
	}

}