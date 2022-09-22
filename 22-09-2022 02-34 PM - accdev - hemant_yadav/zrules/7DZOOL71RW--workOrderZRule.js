{ 
	contextVar.jsonObj = [];
	for (var index in contextVar.workOrder) {
		jsonData = {};
		if (contextVar.subAction === "deleteWorkOrder") {
			contextVar.jsonObj = [{
				"recver": contextVar.workOrder[index].recver,
				"id": contextVar.workOrder[index].id
			}];
		} else if (contextVar.subAction === "upsertWorkOrder" || contextVar.subAction === 'cancelWorkOrder' || contextVar.subAction == 'duplicateWorkOrder') {
			jsonData = {};
			for (var key in contextVar.workOrder[index]) {
				if (key === "recver") {
					continue;
				} else {
					jsonData[key] = contextVar.workOrder[index][key];
				}
			}

			if (contextVar.subAction === 'cancelWorkOrder') {
				jsonData.cancellationDate = new Date().toISOString().replace(/T/, ' ').replace(/\\..+/, '').replace(/Z/, '');
				jsonData.completedDate = new Date().toISOString().replace(/T/, ' ').replace(/\\..+/, '').replace(/Z/, '');
				if(Array.isArray(contextVar.currentUserDetail) && contextVar.currentUserDetail.length>0){
				jsonData.cancelledBy = contextVar.currentUserDetail[0].userId;
				    
				}
				else {jsonData.cancelledBy = '';}
			
			}
			contextVar.jsonObj.push(jsonData);
		}
	}
}