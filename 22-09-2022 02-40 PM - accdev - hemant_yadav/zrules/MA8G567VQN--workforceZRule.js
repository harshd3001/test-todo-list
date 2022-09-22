{
	contextVar.jsonObj = [];
	for (var index in contextVar.workforce) {
		if (contextVar.subAction === "upsertWorkforce") {
			jsonData = {};
			for (var key in contextVar.workforce[index]) {
				if (key === "recver") {
					continue;
				} else {
					jsonData[key] = contextVar.workforce[index][key];
				}
			}
			contextVar.jsonObj.push(jsonData);
		} else if (contextVar.subAction === "deactivateTechnician" || contextVar.subAction === "reactivateTechnician") {
			contextVar.jsonObj.push({
				"userId": contextVar.workforce[index].userId,
				"statusId": contextVar.workforce[index].statusId
			});
		}
	}
}