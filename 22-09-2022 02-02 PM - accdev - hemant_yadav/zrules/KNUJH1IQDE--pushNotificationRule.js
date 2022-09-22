function findLocalizedString(statusObj, defaultTxt, txt) {
    let type = txt.slice();
    let text = defaultTxt;
    txt = 'localized' + txt;
    contextVar.localizedStrings[type] = statusObj[txt] ? txt.slice() : type;
    if (statusObj[txt]) {
        if (notificationResourceData[locale][statusObj[txt]]) {
            text = notificationResourceData[locale][statusObj[txt]];
        }
    }
    if (Array.isArray(statusObj.replaceStr) && statusObj.replaceStr.length > 0) {
        statusObj.replaceStr.forEach((el) => {
            let parsedData = el.replace(/^{@/, '').replace(/}$/, '');
            text = text.replace(el, contextVar[parsedData]);
        });
    }
    return text;
}

function findPreviousStatus(currStatus, taskLog) {
    let returnStatus = 'N.A';
    contextVar.currUser = '';
    let dontLoopFlag = true;
    taskLog.some((obj, index) => {
        var logObj = obj.log[0];
        if (Array.isArray(obj.log) && obj.log.length > 0) {
            logObj = obj.log[0];
        } else {
            return false;
        }
        if (currStatus === logObj.statusId && dontLoopFlag) {
            if (isCrewTask) {
                contextVar.currUser = logObj.assignedToCrewId;
            } else {
                contextVar.currUser = logObj.assignedToUserId;
            }
            return false;
        }
        if (contextVar.landingStatuses[currStatus][logObj.statusId] && dontLoopFlag) {
            contextVar.shortText = findLocalizedString(contextVar.landingStatuses[currStatus][logObj.statusId], contextVar.landingStatuses[currStatus][logObj.statusId].shortText, 'shortText');
            contextVar.longText = findLocalizedString(contextVar.landingStatuses[currStatus][logObj.statusId], contextVar.landingStatuses[currStatus][logObj.statusId].longText, 'longText');
            if (contextVar.shortText && contextVar.longText) {
                returnStatus = logObj.statusId;
            }
            if (isCrewTask) {
                contextVar.currUser = contextVar.currUser ? contextVar.currUser : logObj.assignedToCrewId;
            } else {
                contextVar.currUser = contextVar.currUser ? contextVar.currUser : logObj.assignedToUserId;
            }
            if (typeof contextVar.currUser === 'undefined' || contextVar.currUser === '' || contextVar.landingStatuses[currStatus][logObj.statusId].sendToPreviousAssignee) {
                dontLoopFlag === false;
            }
        }
        if (dontLoopFlag === false) {
            if (isCrewTask) {
                contextVar.currUser = contextVar.currUser ? contextVar.currUser : logObj.assignedToCrewId;
            } else {
                contextVar.currUser = contextVar.currUser ? contextVar.currUser : logObj.assignedToUserId;
            }
            if (typeof contextVar.currUser === 'undefined' || contextVar.currUser === '') {
                return false;
            } else {
                if (contextVar.landingStatuses[currStatus][logObj.statusId].sendToPreviousAssignee) {
                    if ((!isCrewTask && contextVar.currUser !== taskLog[index - 1].assignedToUserId) || (isCrewTask && contextVar.currUser !== taskLog[index - 1].assignedToCrewId)) {
                        dontLoopFlag = true;
                        return true;
                    } else {
                        return false;
                    }
                }
                dontLoopFlag = true;
                return true;
            }
        }
        return true;
    });
    return returnStatus;
}

let taskLogData = contextVar.taskLogData;
if (typeof taskLogData === 'undefined' || !(Array.isArray(taskLogData))) {
    taskLogData = [];
}
let taskData = contextVar.taskData;
let reviewLog = contextVar.taskReviewLogData;
let logData = [];
logData.push({
    'statusId': contextVar.workOrderTaskStatusId,
    'assignedToUserId': contextVar.workOrderTaskAssignedToUserId,
    'assignedToCrewId': contextVar.workOrderTaskAssignedToCrewId,
    'id': contextVar.workOrderTaskId,
    'reopenCount': contextVar.workOrderTaskReOpenCount
});
let prevLogData = {
    'id': 'Temp',
    'taskId': contextVar.workOrderTaskId,
    'log': logData,
    'eventType': contextVar.workOrderTaskStatusId
};
taskLogData.unshift(prevLogData);
contextVar.sendNotification = false;
contextVar.localizedStrings = {};
var isCrewTask;
var notificationResourceData = contextVar.responseData;
var locale = 'en-us';
if (Array.isArray(taskData) && taskData.length > 0 && Array.isArray(taskLogData) && taskLogData.length > 0) {
    contextVar.taskType = taskData[0].taskType;
    contextVar.taskCancellationReason = taskData[0].cancellationNotes ? taskData[0].cancellationNotes : '';
    contextVar.modifiedUser = (Array.isArray(contextVar.modifiedUserData) && contextVar.modifiedUserData.length > 0 && (typeof contextVar.modifiedUserData[0].name !== 'undefined' && contextVar.modifiedUserData[0].name !== '')) ? contextVar.modifiedUserData[0].name : taskData[0].modifiedByUser;
    contextVar.siteName = taskData[0].siteName;
    contextVar.customerName = taskData[0].customerName;
    isCrewTask = contextVar.crewTask;
    let landingStatus = contextVar.workOrderTaskStatusId;
    let prevStatus = findPreviousStatus(landingStatus, taskLogData);
    if (prevStatus !== 'N.A') {
        contextVar.sendNotification = true;
        contextVar.foundInStatus = prevStatus;
    }
}