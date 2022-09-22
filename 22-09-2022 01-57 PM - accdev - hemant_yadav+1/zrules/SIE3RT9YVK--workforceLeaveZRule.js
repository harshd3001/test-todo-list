{
	contextVar.jsonObj = [];
	for (var index in contextVar.workforceLeave) {
		if(contextVar.subAction == "upsertWorkforceLeave") {
			jsonData = {};
			for (var key in contextVar.workforceLeave[index]) {
				if(key === "recver") {
					continue;
				} else {
					jsonData[key] = contextVar.workforceLeave[index][key];
				}
			}
			contextVar.jsonObj.push(jsonData);
		} else if(contextVar.subAction == "deleteWorkforceLeave") {
			contextVar.jsonObj = [{
				"id": contextVar.workforceLeave[index].id,
				"recver": contextVar.workforceLeave[index].recver
			}];
		}
	}
}