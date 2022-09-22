{
	contextVar.jsonObjInsert = [];
	if (typeof contextVar.crewWorkGroup !== 'undefined' && contextVar.crewWorkGroup.length > 0) {
		for (var index in contextVar.crewWorkGroup) {
			if (typeof contextVar.crewWorkGroup[index].workGroupId !== 'undefined' && contextVar.crewWorkGroup[index].workGroupId.length > 0) {
				for (var i = 0; i < contextVar.crewWorkGroup[index].workGroupId.length; i++) {
					contextVar.jsonObjInsert.push({
						"workGroupId": contextVar.crewWorkGroup[index].workGroupId[i].value,
						"crewId": contextVar.crewId
					});
				}
			}
		}
	}
}