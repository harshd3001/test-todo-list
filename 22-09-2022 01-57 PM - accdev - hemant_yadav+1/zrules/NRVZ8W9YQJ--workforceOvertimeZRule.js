{
	contextVar.jsonObj = [];
	for (var index in contextVar.workforceOvertime) {
		if(contextVar.subAction == "upsertWorkforceOvertime") {
			jsonData = {};
			for (var key in contextVar.workforceOvertime[index]) {
				if(key === "recver") {
					continue;
				} else {
					jsonData[key] = contextVar.workforceOvertime[index][key];
				}
			}
			contextVar.jsonObj.push(jsonData);
		} else if(contextVar.subAction == "deleteWorkforceOvertime") {
			contextVar.jsonObj = [{
				"id": contextVar.workforceOvertime[index].id,
				"recver": contextVar.workforceOvertime[index].recver
			}];
		}
	}
}