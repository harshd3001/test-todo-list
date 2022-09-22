{
	contextVar.jsonObj = [];
	currentDate = new Date();
	var startDate, endDate, currentDate;
	for (var index in contextVar.contract) {
		jsonData = {};
		if (contextVar.subAction === "deleteContract") {
			contextVar.jsonObj = [{
				"recver": contextVar.contract[index].recver,
				"id": contextVar.contract[index].id
			}];
		} else if (contextVar.subAction === "upsertContract" || contextVar.subAction === 'deactivateContract') {
			if (contextVar.subAction === "upsertContract") {
				contextVar.contract[index].statusId = 'contractActive';
				if (typeof contextVar.contract[index].startDate !== 'undefined' && contextVar.contract[index].startDate !== '') {
					startDate = new Date(contextVar.contract[index].startDate);
					if (startDate > currentDate) {
						contextVar.contract[index].statusId = 'contractNotStarted';
					}
				}
				if (typeof contextVar.contract[index].endDate !== 'undefined' && contextVar.contract[index].endDate !== '') {
					endDate = new Date(contextVar.contract[index].endDate);
					if (endDate < currentDate) {
						contextVar.contract[index].statusId = 'contractExpired';
					}
				}
			}
			jsonData = {};
			for (var key in contextVar.contract[index]) {
				if (key === "recver") {
					continue;
				} else {
					jsonData[key] = contextVar.contract[index][key];
				}
			}
			contextVar.jsonObj.push(jsonData);
		}
	}
}