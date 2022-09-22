{
	contextVar.jsonObj = [];
	for (var index in contextVar.taskType) {
		if (contextVar.subAction === "upsertTaskType" || contextVar.subAction === 'insertAllServices') {
			jsonData = {};
			for (var key in contextVar.taskType[index]) {
				if (key === "recver") {
					continue;
				} else {
					jsonData[key] = contextVar.taskType[index][key];
				}
			}
			contextVar.jsonObj.push(jsonData);
		} else if (contextVar.subAction === "reactivateTaskType" || contextVar.subAction === "deactivateTaskType") {
			contextVar.jsonObj = [{
				'statusId': contextVar.taskType[index].statusId,
				'id': contextVar.taskType[index].id
			}];
		}
	}
}