{
	contextVar.jsonObj = [];
	if (contextVar.subAction === "upsertStockUnit") {
		jsonData = {};
		for (var key in contextVar.stockUnit) {
			if (key === "recver") {
				continue;
			} else {
				jsonData[key] = contextVar.stockUnit[key];
			}
		}
		contextVar.jsonObj.push(jsonData);
	} else if (contextVar.subAction === "deleteStockUnit") {
		contextVar.jsonObj = [{
			"id": contextVar.stockUnit.id,
			"recver": contextVar.stockUnit.recver
		}];
	}
}