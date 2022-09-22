{
	var workOrderInventory = [];
	var installedParts = [];

	if (typeof contextVar.workOrderTaskResult !== 'undefined' && contextVar.workOrderTaskResult !== '' && Array.isArray(contextVar.workOrderTaskResult)) {
		var result = contextVar.workOrderTaskResult[contextVar.workOrderTaskResult.length - 1];
		if (typeof result.additionalMaterials !== 'undefined' && result.additionalMaterials !== '' && Array.isArray(result.additionalMaterials) && result.additionalMaterials.length > 0) {
			result.additionalMaterials.forEach(additionalMaterialsData => {
				workOrderInventory.push({
					'workOrderId': contextVar.workOrderId,
					'workOrderTaskId': contextVar.workOrderTaskId,
					'customerPrice': parseFloat(additionalMaterialsData.material[0].catalogCustomerPrice),
					'modelNumber': additionalMaterialsData.material[0].catalogModelNumber,
					'modelName': additionalMaterialsData.material[0].catalogName,
					'manufacturerName': additionalMaterialsData.material[0].manufacturerName,
					'unitPrice': parseFloat(additionalMaterialsData.material[0].catalogUnitPrice),
					'catalogType': additionalMaterialsData.material[0].catalogTypeId,
					"catalogTypeId": additionalMaterialsData.material[0].catalogTypeId,
					'catalogId': additionalMaterialsData.material[0].catalogId,
					'estimatedQty': 0,
					'actualQty': (typeof additionalMaterialsData.quantity !== 'undefined' && additionalMaterialsData.quantity !== "") ? Number(additionalMaterialsData.quantity) : 0,
					"stockUnitName": additionalMaterialsData.material[0].stockUnitName,
					"technicianNotes": additionalMaterialsData.materialNotes,
					"photoEvidence": typeof additionalMaterialsData.addMaterialsPhotosDataGrid !== 'undefined' ? additionalMaterialsData.addMaterialsPhotosDataGrid.map(photoEvidence => {
						return {
							"fileType": "JPG",
							"capturedOn": photoEvidence.materialsPhotosCapturedTime,
							"photoReview": photoEvidence.materialsPhotos.media,
							"capturedBy": photoEvidence.capturedBy,
							"notes": photoEvidence.materialsPhotos.comment
						}
					}) : []
				});
			});
		}

		if (typeof result.suggestedMaterials !== 'undefined' && result.suggestedMaterials !== '' && Array.isArray(result.suggestedMaterials) && result.suggestedMaterials.length > 0) {
			result.suggestedMaterials.forEach(suggestedMaterialsData => {
				workOrderInventory.push({
					'workOrderId': contextVar.workOrderId,
					'workOrderTaskId': contextVar.workOrderTaskId,
					'customerPrice': parseFloat(suggestedMaterialsData.customerPrice),
					'modelNumber': suggestedMaterialsData.catalogModelNumber,
					'modelName': suggestedMaterialsData.catalogName,
					'manufacturerName': suggestedMaterialsData.manufacturerName,
					'unitPrice': parseFloat(suggestedMaterialsData.catalogUnitPrice),
					'catalogType': suggestedMaterialsData.catalogTypeId,
					"catalogTypeId": suggestedMaterialsData.catalogTypeId,
					'catalogId': suggestedMaterialsData.catalogId,
					'id': suggestedMaterialsData.workOrderInventoryId,
					'estimatedQty': (typeof suggestedMaterialsData.estimatedQuantity !== 'undefined' && suggestedMaterialsData.estimatedQuantity !== "") ? Number(suggestedMaterialsData.estimatedQuantity) : 0,
					'actualQty': (typeof suggestedMaterialsData.actualQuantity !== 'undefined' && suggestedMaterialsData.actualQuantity !== "") ? Number(suggestedMaterialsData.actualQuantity) : 0,
					"stockUnitName": suggestedMaterialsData.stockUnitName,
					"technicianNotes": suggestedMaterialsData.materialNotes,
					"photoEvidence": typeof suggestedMaterialsData.suggestedMaterialsPhotosDataGrid !== 'undefined' ? suggestedMaterialsData.suggestedMaterialsPhotosDataGrid.map(photoEvidence => {
						return {
							"fileType": "JPG",
							"capturedOn": photoEvidence.materialsPhotosCapturedTime,
							"photoReview": photoEvidence.materialsPhotos.media,
							"capturedBy": photoEvidence.capturedBy,
							"notes": photoEvidence.materialsPhotos.comment
						}
					}) : []
				});
			});
		}

		if (typeof result.serviceGridWrapper !== 'undefined' && result.serviceGridWrapper !== '') {
			result.serviceGridWrapper.forEach(installedPart => {
				for (var action in installedPart) {
					if (contextVar.eventType.indexOf(action) > -1) {
						for (var key in installedPart[action]) {
							if (key === 'installed') {
								var partDetails = installedPart[action][key];
								partDetails.unitPrice = (partDetails.unitPrice !== '' && typeof partDetails.unitPrice !== 'undefined') ? parseFloat(partDetails.unitPrice) : 0;
								partDetails.customerPrice = (partDetails.customerPrice !== '' && typeof partDetails.customerPrice !== 'undefined') ? parseFloat(partDetails.customerPrice) : 0;
								var obj = {};
								var count = 1;
								installedParts.some(parts => {
									if ((parts.id === partDetails.workOrderInventoryId) || (parts.catalogId === partDetails.catalogId && parts.customerPrice === partDetails.customerPrice && parts.customerPrice === partDetails.customerPrice)) {
										count = parts.actualQty;
										obj = parts;
										return true;
									}
								});

								if (Object.keys(obj).length === 0) {
									obj['workOrderId'] = contextVar.workOrderId;
									obj['workOrderTaskId'] = contextVar.workOrderTaskId;
									if (partDetails.workOrderInventoryId !== '' && typeof partDetails.workOrderInventoryId !== 'undefined') {
										obj['id'] = partDetails.workOrderInventoryId;
									}
									obj['estimatedQty'] = partDetails.estimatedQuantity === '' ? 0 : Number(partDetails.estimatedQuantity);
									obj['customerPrice'] = partDetails.customerPrice;
									obj['unitPrice'] = partDetails.unitPrice;
									obj['actualQty'] = count;
									obj['catalogId'] = partDetails.catalogId;
									obj['manufacturerName'] = partDetails.manufacturer;
									obj['modelNumber'] = partDetails.modelNumber;
									obj['modelName'] = partDetails.modelName;
									obj['catalogType'] = 'part';
									obj['catalogTypeId'] = 'partAndAsset';
									obj['technicianNotes'] = typeof installedPart.updatedOn !== 'undefined' ? installedPart.updatedOn.notes : '';


									var partDetail = {
										"id": partDetails.serialNumber,
										"serialNumber": partDetails.serialNumber,
										"serviceName": installedPart.selectedService.serviceName,
										"serviceId": installedPart.selectedService.serviceId,
										"action": action,
										"timeOfService": installedPart.updatedOn.time,
										"notes": installedPart.updatedOn.notes,
										"photoOfSerialNum": partDetails.photoOfSerialNum
									};

									obj['partDetail'] = (typeof partDetails.optionalPhotoPlusNotes !== 'undefined' && typeof partDetails.optionalPhotoPlusNotes.capturedPhoto !== 'undefined' && Array.isArray(partDetails.optionalPhotoPlusNotes.capturedPhoto) && partDetails.optionalPhotoPlusNotes.capturedPhoto.length > 0) ? [{
											...partDetail,
											"photoEvidence": partDetails.optionalPhotoPlusNotes.capturedPhoto.map(photoEvidence => {
												return {
													"fileType": "JPG",
													"capturedOn": photoEvidence.servicePhotosCapturedTime,
													"photoReview": photoEvidence.servicePhotos.media,
													"capturedBy": result.userName,
													"notes": photoEvidence.servicePhotos.comment
												}
											})
										}] :
										[{
											...partDetail
										}]

									installedParts.push(obj);
								} else {
									obj['actualQty'] = ++count;
									var partDetail = {
										"id": partDetails.serialNumber,
										"serialNumber": partDetails.serialNumber,
										"serviceName": installedPart.selectedService.serviceName,
										"serviceId": installedPart.selectedService.serviceId,
										"action": action,
										"timeOfService": installedPart.updatedOn.time,
										"notes": installedPart.updatedOn.notes,
										"photoOfSerialNum": partDetails.photoOfSerialNum
									};

									if (typeof partDetails.optionalPhotoPlusNotes !== 'undefined' && typeof partDetails.optionalPhotoPlusNotes.capturedPhoto !== 'undefined' && Array.isArray(partDetails.optionalPhotoPlusNotes.capturedPhoto) && partDetails.optionalPhotoPlusNotes.capturedPhoto.length > 0) {
										obj['partDetail'].push({
											...partDetail,
											"photoEvidence": partDetails.optionalPhotoPlusNotes.capturedPhoto.map(photoEvidence => {
												return {
													"fileType": "JPG",
													"capturedOn": photoEvidence.servicePhotosCapturedTime,
													"photoReview": photoEvidence.servicePhotos.media,
													"capturedBy": result.userName,
													"notes": photoEvidence.servicePhotos.comment
												}
											})
										})
									} else {
										obj['partDetail'].push(partDetail);
									}
								}
							}
						}
					}
				}
			});
		}
	}

	contextVar.workOrderInventory = workOrderInventory.concat(installedParts);
	contextVar.workOrderInventorySubAction = 'add';
}