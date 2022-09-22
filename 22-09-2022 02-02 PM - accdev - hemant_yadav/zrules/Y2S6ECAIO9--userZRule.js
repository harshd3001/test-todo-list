{
	contextVar.jsonObj = [];
	for (var index in contextVar.User) {
		if(contextVar.subAction === 'upsertWorkforce') {
			jsonData = {};
			for (var key in contextVar.User[index]) {
				if(key === "recver") {
					continue;
				} else {
					jsonData[key] = contextVar.User[index][key];
				}
			}
			contextVar.jsonObj.push(jsonData);
		}
	}
}