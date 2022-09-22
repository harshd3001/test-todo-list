contextVar.jsonArrayToUpsert = [];
contextVar.jsonArrayToDelete = [];
if (typeof contextVar.workOrderInventory !== 'undefined' && contextVar.workOrderInventory.length > 0) {
	contextVar.workOrderInventory.forEach((element) => {
		var flag = true;
		if (element.workOrderTaskId === '-') {
			element.workOrderTaskId = '';
		}
		if (typeof contextVar.partsMaterialsDataOfTask !== 'undefined' && contextVar.partsMaterialsDataOfTask.length > 0) {

			contextVar.partsMaterialsDataOfTask.some(function (val) {
				if (((typeof element.workOrderTaskId !== 'undefined' && typeof val.workOrderTaskId !== 'undefined' && element.workOrderTaskId == val.workOrderTaskId) || ((typeof element.workOrderTaskId === 'undefined' || element.workOrderTaskId === '') && (typeof val.workOrderTaskId === 'undefined' || val.workOrderTaskId === ''))) && val.catalogId == element.catalogId && val.unitPrice == element.unitPrice && val.customerPrice == element.customerPrice) {

					var actualQty1 = (typeof element.actualQty !== 'undefined' && element.actualQty !== '') ? element.actualQty : 0;

					var actualQty2 = (typeof val.actualQty !== 'undefined' && val.actualQty !== '') ? val.actualQty : 0;

					if (typeof element.id !== 'undefined' && element.id !== val.id) {
						val.actualQty = Number(actualQty1) + Number(actualQty2);
						val.estimatedQty = Number(element.estimatedQty) + Number(val.estimatedQty);
					} else {
						val.actualQty = Number(actualQty1);
						val.estimatedQty = Number(element.estimatedQty);
					}
					contextVar.jsonArrayToUpsert.push(val);

					if (typeof val.id !== 'undefined' && val.id !== '' && typeof element.id !== 'undefined' && element.id !== '' && element.id !== val.id) {
						contextVar.jsonArrayToDelete.push(element);
					}
					flag = false;
					return true;
				}
			});
			if (flag) {
				contextVar.jsonArrayToUpsert.push(element);
			}
		} else {
			contextVar.jsonArrayToUpsert = contextVar.workOrderInventory;
		}
	});
}