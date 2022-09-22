//workforceWorkgroup
if (contextVar.subAction === 'insertWorkforceWorkGroup') {
	contextVar.jsonObjInsert = [];
	contextVar.jsonObjDelete = [];
	if (typeof contextVar.workforceWorkGroup !== 'undefined' && contextVar.workforceWorkGroup.length > 0) {
		for (var index in contextVar.workforceWorkGroup) {
			if (typeof contextVar.workforceWorkGroup[index].workforceWorkGroupUserList !== 'undefined' && contextVar
				.workforceWorkGroup[index].workforceWorkGroupUserList !== '' && contextVar.workforceWorkGroup[index]
				.workforceWorkGroupUserList.length !== 0) {
				for (var i = 0; i < contextVar.workforceWorkGroup[index].workforceWorkGroupUserList.length; i++) {
					contextVar.jsonObjInsert.push({
						"workGroupId": contextVar.workforceWorkGroup[index].workGroupId,
						"workforceUserId": contextVar.workforceWorkGroup[index].workforceWorkGroupUserList[i].workforceUserId
					});
				}
			} else if (typeof contextVar.workforceWorkGroup[index].workGroupId !== 'undefined' && contextVar
				.workforceWorkGroup[index].workGroupId !== '' && contextVar.workforceWorkGroup[index].workGroupId.length !== 0
			) {
				for (var i = 0; i < contextVar.workforceWorkGroup[index].workGroupId.length; i++) {
					contextVar.jsonObjInsert.push({
						"workGroupId": contextVar.workforceWorkGroup[index].workGroupId[i].value,
						"workforceUserId": contextVar.workforceWorkGroup[index].workforceUserId
					});
				}
			}
			if (typeof contextVar.workforceWorkGroup[index].removeWorkforceWorkGroupUserList !== 'undefined' && contextVar
				.workforceWorkGroup[index].removeWorkforceWorkGroupUserList !== '' && contextVar.workforceWorkGroup[index]
				.removeWorkforceWorkGroupUserList.length !== 0) {
				for (var i = 0; i < contextVar.workforceWorkGroup[index].removeWorkforceWorkGroupUserList.length; i++) {
					contextVar.jsonObjDelete.push({
						"workGroupId": contextVar.workforceWorkGroup[index].workGroupId,
						"workforceUserId": contextVar.workforceWorkGroup[index].removeWorkforceWorkGroupUserList[i]
							.workforceUserId,
						"recver": contextVar.workforceWorkGroup[index].removeWorkforceWorkGroupUserList[i]
							.workforceWorkGroupRecver
					});
				}
			}
		}
	}
}

//crewWorkgroup
if (contextVar.subAction === 'insertCrewWorkGroup') {
	contextVar.jsonObjInsert = [];
	contextVar.jsonObjDelete = [];
	if (typeof contextVar.crewWorkGroup !== 'undefined' && contextVar.crewWorkGroup.length > 0) {
		for (var index in contextVar.crewWorkGroup) {
			if (typeof contextVar.crewWorkGroup[index].workGroupCrewList !== 'undefined' && contextVar
				.crewWorkGroup[index].workGroupCrewList !== '' && contextVar.crewWorkGroup[index]
				.workGroupCrewList.length !== 0) {
				for (var i = 0; i < contextVar.crewWorkGroup[index].workGroupCrewList.length; i++) {
					contextVar.jsonObjInsert.push({
						"workGroupId": contextVar.crewWorkGroup[index].workGroupId,
						"crewId": contextVar.crewWorkGroup[index].workGroupCrewList[i].crewId
					});
				}
			} else if (typeof contextVar.crewWorkGroup[index].workGroupId !== 'undefined' && contextVar
				.crewWorkGroup[index].workGroupId !== '' && contextVar.crewWorkGroup[index].workGroupId.length !== 0
			) {
				for (var i = 0; i < contextVar.crewWorkGroup[index].workGroupId.length; i++) {
					contextVar.jsonObjInsert.push({
						"workGroupId": contextVar.crewWorkGroup[index].workGroupId[i].value,
						"crewId": contextVar.crewWorkGroup[index].crewId
					});
				}
			}
			if (typeof contextVar.crewWorkGroup[index].removeWorkGroupCrewList !== 'undefined' && contextVar
				.crewWorkGroup[index].removeWorkGroupCrewList !== '' && contextVar.crewWorkGroup[index]
				.removeWorkGroupCrewList.length !== 0) {
				for (var i = 0; i < contextVar.crewWorkGroup[index].removeWorkGroupCrewList.length; i++) {
					contextVar.jsonObjDelete.push({
						"workGroupId": contextVar.crewWorkGroup[index].workGroupId,
						"crewId": contextVar.crewWorkGroup[index].removeWorkGroupCrewList[i]
							.crewId,
						"recver": contextVar.crewWorkGroup[index].removeWorkGroupCrewList[i]
							.crewWorkGroupRecver
					});
				}
			}
		}
	}
}