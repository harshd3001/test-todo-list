{
	if (contextVar.subAction === 'upsertInstalledBaseLog') {
		contextVar.jsonObj = [];
		for (var index in contextVar.installedBaseLog) {
			jsonData = {};
			for (var key in contextVar.installedBaseLog[index]) {
				if (key === "recver") {
					continue;
				} else {
					jsonData[key] = contextVar.installedBaseLog[index][key];
				}
			}
			contextVar.jsonObj.push(jsonData);
		}
	}
}