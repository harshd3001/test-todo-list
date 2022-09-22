function checkIfArray(a) {
    return (typeof a !== 'undefined' && Array.isArray(a));
}

function checkForData(a) {
    return (typeof a !== 'undefined' && a !== '' && a !== null);
}


{
    let openTaskData;
    if (checkForData(contextVar.schedulingAndDispatchData)) {
        openTaskData = contextVar.schedulingAndDispatchData;
    }


    if (checkIfArray(openTaskData)) {
        openTaskData.forEach((obj) => {
            /*Check to remove open tasks from the List which has Multiple Breakdown*/
            if (obj.workOrderTaskScheduleBreakdown.length <= 1) {
                let taskObj = {};
                taskObj = {
                    'taskTypeName': checkForData(obj.taskTypeName) ? obj.taskTypeName : '',
                    'statusColor': checkForData(obj.priorityColor) ? obj.priorityColor : '',
                    'name': obj.taskIdTaskTypeName,
                    'workOrderTaskId': obj.workOrderTaskId,
                    'workOrderId': obj.workOrderId,
                    'id': obj.workOrderTaskId,
                    'appointmentWindow': checkForData(obj.workOrderTaskAppointmentWindowStartDate) && checkForData(obj.workOrderTaskAppointmentWindowEndDate) ? obj.workOrderTaskAppointmentWindowStartDate + ' - <br/> ' + obj.workOrderTaskAppointmentWindowEndDate : '',
                    'priority': obj.priorityName,
                    'status': obj.statusName,
                    'deadline': checkForData(obj.workOrderDeadline) ? obj.workOrderDeadline : '',
                    'workOrderDeadline': checkForData(obj.workOrderDeadline) ? obj.workOrderDeadline : '',
                    'customer': obj.customerCompanyName,
                    'siteName': obj.siteName,
                    'scheduledStartTime': obj.workOrderTaskScheduledDate,
                    'regionId': obj.regionId,
                    'taskTypeCrewTask': obj.taskTypeCrewTask,
                    'viewTravelStatus': obj.viewTravelStatus,
                    'statusId': obj.status,
                    'customerId': obj.customerId,
                    'multiBreakdownTaskFlag': false, //setting it as false since multiple breakdown tasks will not be allowed.
                    "durationUnit": "hour",
                    'duration': checkForData(obj.workOrderTaskEstimatedDuration) ? obj.workOrderTaskEstimatedDuration : '',
                    'workOrderTaskEstimatedDuration': checkForData(obj.workOrderTaskEstimatedDuration) ? obj.workOrderTaskEstimatedDuration : '',
                    'workOrderTaskEstimatedDurationMinutes': checkForData(obj.workOrderTaskEstimatedDurationMinutes) ? obj.workOrderTaskEstimatedDurationMinutes : '',
                    'workOrderTaskAppointmentBasedFlag': checkForData(obj.workOrderTaskAppointmentBasedFlag) ? obj.workOrderTaskAppointmentBasedFlag : false,
                    'workOrderTaskAppointmentWindowId': checkForData(obj.workOrderTaskAppointmentWindowId) ? obj.workOrderTaskAppointmentWindowId : '',
                    'workOrderTaskAppointmentWindowStartDate': checkForData(obj.workOrderTaskAppointmentWindowStartDate) ? obj.workOrderTaskAppointmentWindowStartDate : '',
                    'workOrderTaskAppointmentWindowEndDate': checkForData(obj.workOrderTaskAppointmentWindowEndDate) ? obj.workOrderTaskAppointmentWindowEndDate : '',
                    'workOrderTaskAppointmentWindow': checkForData(obj.workOrderTaskAppointmentWindow) ? obj.workOrderTaskAppointmentWindow : '',
                    'initialWorkOrderTaskScheduleBreakdown': checkForData(obj.workOrderTaskScheduleBreakdown) ? obj.workOrderTaskScheduleBreakdown : ''
                };
                contextVar.openTasksList.push(taskObj);
            }

        });
    }

}