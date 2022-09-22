{
	contextVar.jsonObj = [];
	for (var index in contextVar.taskDependency) {
		if (typeof contextVar.taskDependency !== 'undefined' && contextVar.taskDependency !== '' && contextVar.taskDependency.length !== 0) {
			jsonData = {};
			if (contextVar.subAction === "upsertTaskDependency") {
				jsonData = {};
				for (var key in contextVar.taskDependency[index]) {
					if (key === "recver") {
						continue;
					} else {
						jsonData[key] = contextVar.taskDependency[index][key];
					}
				}
				contextVar.jsonObj.push(jsonData);
			} else if (contextVar.subAction == "deleteTaskDependency") {
				contextVar.jsonObj.push({
					"id": contextVar.taskDependency[index].taskDependencyId,
					"recver": contextVar.taskDependency[index].taskDependencyRecver
				});
			}
		}
	}
}