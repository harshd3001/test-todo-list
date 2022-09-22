{
	contextVar.jsonObj = [];
	if (Array.isArray(contextVar.crewJsonObj) && contextVar.crewJsonObj.length > 0) {
		contextVar.jsonObj = [...contextVar.crewJsonObj];
	} else {
		for (var index in contextVar.crew) {
			if (contextVar.subAction == "upsertCrew") {
				jsonData = {};
				for (var key in contextVar.crew[index]) {
					if (key === "recver") {
						continue;
					} else {
						jsonData[key] = contextVar.crew[index][key];
					}
				}
				var currentDate = new Date();
				var startDate, endDate;
				startDate = new Date(contextVar.crew[index].startDate);
				endDate = new Date(contextVar.crew[index].endDate);
				if (typeof contextVar.crew[index].statusId !== 'undefined' && contextVar.crew[index].statusId !== '' && (contextVar.crew[index].statusId === 'crewActive' || contextVar.crew[index].statusId === 'crewNotStarted')) {
					if (startDate < currentDate && endDate > currentDate) {
						contextVar.crew[index].statusId = 'crewActive';
					}
					if (endDate < currentDate) {
						contextVar.crew[index].statusId = 'crewDeactivated';
					}
					if (startDate > currentDate) {
						contextVar.crew[index].statusId = 'crewNotStarted';
					}
				}
				contextVar.jsonObj.push(contextVar.crew[index]);

			}
		}
	}

}