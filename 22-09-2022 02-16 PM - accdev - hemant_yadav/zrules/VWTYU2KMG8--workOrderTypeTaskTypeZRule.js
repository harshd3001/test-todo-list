{
    contextVar.jsonObjInsert = [];
    contextVar.jsonObjDelete = [];
    if (typeof contextVar.workOrderTypeTaskType[0].taskTypeList !== 'undefined' && contextVar.workOrderTypeTaskType[0].taskTypeList !== '' && contextVar.workOrderTypeTaskType[0].taskTypeList.length !== 0) {
        for (var i in contextVar.workOrderTypeTaskType[0].taskTypeList) {
            contextVar.jsonObjInsert.push({
                "workOrderTypeId": contextVar.workOrderTypeTaskType[0].workOrderTypeId,
                "taskTypeId": contextVar.workOrderTypeTaskType[0].taskTypeList[i].taskTypeId
            });
        }
    }
    if (typeof contextVar.workOrderTypeTaskType[0].removeTaskTypeList !== 'undefined' && contextVar.workOrderTypeTaskType[0].removeTaskTypeList !== '' && contextVar.workOrderTypeTaskType[0].removeTaskTypeList.length !== 0) {
        for (var i = 0; i < contextVar.workOrderTypeTaskType[0].removeTaskTypeList.length; i++) {
            contextVar.jsonObjDelete.push({
                "workOrderTypeId": contextVar.workOrderTypeTaskType[0].removeTaskTypeList[i].workOrderTypeId,
                "taskTypeId": contextVar.workOrderTypeTaskType[0].removeTaskTypeList[i].workOrderTypeTaskTypeId,
                "recver": contextVar.workOrderTypeTaskType[0].removeTaskTypeList[i].workOrderTypeTaskTypeRecver
            });
        }
    }
}