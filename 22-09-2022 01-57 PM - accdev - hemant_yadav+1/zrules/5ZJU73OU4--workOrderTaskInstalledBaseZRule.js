{
	contextVar.jsonObj = [];
	contextVar.workOrderTaskInstalledBase.forEach((obj) => {
		if (contextVar.subAction === "upsertWorkOrderTaskInstalledBase") {
			if (typeof obj.assetList !== 'undefined' && obj.assetList !== '' && obj.assetList !== 0) {
				return (contextVar.jsonObj = contextVar.jsonObj.concat(obj.assetList.map(asset => {
					asset.workOrderTaskId = obj.workOrderTaskId;
					asset.eventType = obj.eventType;
					return asset;
				})));
			} else {
				jsonData = {};
				for (var key in obj) {
					jsonData[key] = obj[key];
				}
				contextVar.jsonObj.push(jsonData);
			}
		} else if (contextVar.subAction == "removeWorkOrderTaskInstalledBase") {
			jsonData = {};
			for (var key in obj) {
				jsonData[key] = obj[key];
			}
			contextVar.jsonObj.push(jsonData);
		}
	});
}