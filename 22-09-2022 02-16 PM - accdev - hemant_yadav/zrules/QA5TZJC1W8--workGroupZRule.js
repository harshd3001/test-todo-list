{
	contextVar.jsonObj = [];
	for (var index in contextVar.workGroup) {
		if (contextVar.subAction === "upsertWorkGroup") {
			jsonData = {};
			for (var key in contextVar.workGroup[index]) {
				if (key === "recver" || key === "filterValue") {
					continue;
				} else {
					jsonData[key] = contextVar.workGroup[index][key];
				}
			}
			contextVar.jsonObj.push(jsonData);
		}
	}
}