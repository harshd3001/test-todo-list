{
	contextVar.jsonObj = [];
	jsonData = {};
	if(contextVar.subAction === "deleteDispatcherTech") {
		jsonData = {
			"recver": contextVar.dispatcherTech.recver,
			"loggedInUserId": contextVar.currentUserDetail[0].userId
		};
	} else if(contextVar.subAction === "upsertDispatcherTech") {

		for (var key in contextVar.dispatcherTech) {
			if(key === "recver") {
				continue;
			} else {
				jsonData[key] = contextVar.dispatcherTech[key];
			}
			jsonData.loggedInUserId = contextVar.currentUserDetail[0].userId;
		}
	}
	contextVar.jsonObj.push(jsonData);
}