{
	contextVar.jsonObj = [];
	if (typeof contextVar.workGroup !== 'undefined' && contextVar.workGroup.length > 0) {
		for (var index in contextVar.workGroup) {
			if (typeof contextVar.workGroup[index].filterValue !== 'undefined' && contextVar.workGroup[index].filterValue !== '' && contextVar.workGroup[index].filterValue.length !== 0) {
				for (var i = 0; i < contextVar.workGroup[index].filterValue.length; i++) {
					if (typeof contextVar.workGroupId !== 'undefined' && contextVar.workGroupId !== '') {
						contextVar.jsonObj.push({
							"workGroupId": contextVar.workGroupId,
							"id": "",
							"filterId": contextVar.workGroup[index].filterValue[i].value
						});
					}
				}
			}
		}
	}
}