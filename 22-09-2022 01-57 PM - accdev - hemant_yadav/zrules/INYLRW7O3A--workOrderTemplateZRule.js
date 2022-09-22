{ 
	contextVar.jsonObj = [];
	for (var index in contextVar.workOrderTemplate) {
		jsonData = {};
		if (contextVar.templateSubAction === 'deleteTemplate') {
			contextVar.jsonObj = [{
				"recver": contextVar.workOrderTemplate[index].recver,
				"id": contextVar.workOrderTemplate[index].id
			}];
		} else if (contextVar.templateSubAction === 'upsertTemplate') {
			jsonData = {};
			for (var key in contextVar.workOrderTemplate[index]) {
				if (key === "recver") {
					continue;
				} else {
					jsonData[key] = contextVar.workOrderTemplate[index][key];
				}
			}
			contextVar.jsonObj.push(jsonData);
		}
	}
}