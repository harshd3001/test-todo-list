{
	contextVar.jsonObj = [];
	if (contextVar.subAction === "insertCalendar") {
		contextVar.calId = contextVar.data[0].id;
		var daysArray = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
		for (var i in daysArray) {
			jsonData = {
				"day": daysArray[i],
				"schedule": (i > 0 && i < 6) ? [{
					"start": "09:00:00.000",
					"end": "17:00:00.000"
				}] : [],
				"displayOrder": i.toString(),
				"isOpen": (i > 0 && i < 6) ? true : false,
				"isAllDay": false,
				"calendarId": contextVar.calId
			};
			contextVar.jsonObj.push(jsonData);
		}
	} else if (contextVar.subAction === "upsertWeeklySchedule") {
		jsonData = {};
		for (var key in contextVar.weeklySchedule) {
			if (key === "recver") {
				continue;
			} else {
				jsonData[key] = contextVar.weeklySchedule[key];
			}
		}
		contextVar.jsonObj.push(jsonData);
	} else if (contextVar.subAction === "deleteWeeklySchedule") {
		contextVar.jsonObj = [{
			"id": contextVar.weeklySchedule.id,
			"recver": contextVar.weeklySchedule.recver
		}];
	}
}