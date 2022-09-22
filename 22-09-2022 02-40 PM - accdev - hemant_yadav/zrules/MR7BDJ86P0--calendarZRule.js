{
	contextVar.jsonObj = [];
	if (contextVar.subAction === "insertCalendar" || contextVar.subAction === "updateCalendar") {
		jsonData = {};
		if (contextVar.subAction === "insertCalendar") {
			jsonData.totalWorkingDuration = 2400;
		}
		for (var key in contextVar.calendar) {
			if (key === "recver") {
				continue;
			} else {
				jsonData[key] = contextVar.calendar[key];
			}
		}
		contextVar.jsonObj.push(jsonData);
	} else if (contextVar.subAction === "deleteCalendar") {
		contextVar.jsonObj = [{
			"id": contextVar.calendar.id,
			"recver": contextVar.calendar.recver
		}];
	}
}