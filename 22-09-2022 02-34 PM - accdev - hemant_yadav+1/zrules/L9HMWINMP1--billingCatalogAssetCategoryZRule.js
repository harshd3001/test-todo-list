{
	contextVar.jsonObj = [];
	for (var index in contextVar.assetCategory) {
		if (contextVar.subAction === "upsertAssetCategory") {
			jsonData = {};
			for (var key in contextVar.assetCategory[index]) {
				if (key === "recver") {
					continue;
				} else {
					jsonData[key] = contextVar.assetCategory[index][key];
				}
			}
			contextVar.jsonObj.push(jsonData);
		}
	}
}