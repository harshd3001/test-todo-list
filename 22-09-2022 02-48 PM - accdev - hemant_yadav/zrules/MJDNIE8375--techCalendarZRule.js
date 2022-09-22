{
	contextVar.techCalendar = [];
	if (!contextVar.crewTask) {
		contextVar.techCalendar = contextVar.taskScheduleBreakdownData.map(function (element) {
			return {
				workOrderTaskId: element.workOrderTaskId,
				startTime: element.startDate,
				endTime: element.endDate,
				userId: contextVar.workOrderTaskAssignedToUserId
			};
		});
	} else {
		contextVar.workforceCrewData.forEach(function (user) {
			var userId = user.userId;
			var techCalendarMap = contextVar.taskScheduleBreakdownData.map(function (element) {
				return {
					workOrderTaskId: element.workOrderTaskId,
					startTime: element.startDate,
					endTime: element.endDate,
					userId: userId
				};
			});
			contextVar.techCalendar = contextVar.techCalendar.concat(techCalendarMap);
		});
	}
}