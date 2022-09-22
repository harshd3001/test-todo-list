{
	contextVar.jsonObj = [];
	for (var index in contextVar.workforceCrew) {
		if (contextVar.subAction == "upsertWorkforceCrew" || contextVar.subAction == "insertWorkforceCrew") {
			jsonData = {};
			for (var key in contextVar.workforceCrew[index]) {
				if (key === "recver" || key === "modelName") {
					continue;
				} else {
					jsonData[key] = contextVar.workforceCrew[index][key];
				}
			}
			if (contextVar.subAction == "insertWorkforceCrew") {
				jsonData.crewId = contextVar.crewId;
				jsonData.statusId = "workforceCrewOnCrew";
				jsonData.statusTargetModel = "workforceCrew";
			}
			contextVar.jsonObj.push(jsonData);
		} else if (contextVar.subAction == "deleteWorkforceCrew") {
			contextVar.jsonObj = [{
				"crewId": contextVar.workforceCrew[index].crewId,
				"workforceUserId": contextVar.workforceCrew[index].workforceUserId,
				"recver": contextVar.workforceCrew[index].recver
			}];
		} else if (contextVar.subAction === "deactivateTechnician" || contextVar.subAction === "reactivateTechnician") {
			if (typeof contextVar.workforceCrew[index].crewData !== 'undefined' && contextVar.workforceCrew[index].crewData !== '' && contextVar.workforceCrew[index].crewData.length !== 0) {
				for (var i = 0; i < contextVar.workforceCrew[index].crewData.length; i++) {
					if (contextVar.workforceCrew[index].crewData[i].crewStatusId === 'crewDeactivated') {
						continue;
					}
					contextVar.jsonObj.push({
						"workforceUserId": contextVar.workforceCrew[index].crewData[i].workforceCrewWorkforceUserId,
						"crewId": contextVar.workforceCrew[index].crewData[i].crewId,
						"statusId": contextVar.workforceCrew[index].workforceCrewUserStatusId
					});
				}
			}
		}
	}
}