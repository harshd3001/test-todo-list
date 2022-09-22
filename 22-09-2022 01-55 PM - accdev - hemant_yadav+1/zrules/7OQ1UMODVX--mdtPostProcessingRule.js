function arrayCheck(a) {
	return (typeof a !== 'undefined' && Array.isArray(a) && a.length > 0);
}

function findTheIndex(ar, o) {
	if (arrayCheck(ar)) {
		for (let i = 0; i < ar.length; i++) {
			if (ar[i].workforceUserId === o) {
				return i;
			}
		}
	}
	return -1;
}

function checkForData(a) {
	return (typeof a !== 'undefined' && a !== '');
}

contextVar.updateResult = false;
contextVar.updateStatus = false;
contextVar.recreateInstances = false;
contextVar.updateAttendance = true;

contextVar.recreateUserList = [];

var crewAttendanceDetailsList;
let crewMobileAccess = contextVar.crewMobileAccess;
let assignedToUserId = contextVar.assignedToUserId || contextVar['__sys__loggedIn_UserId'];
let isCrewTask = contextVar.isCrewTask;
let taskDetails = contextVar.existingTaskDetails;
let leaduserId = taskDetails[0].taskUserId;
let leaduserName = taskDetails[0].userName;
var currStatus = taskDetails[0].currStatus;
if (['workOrderTaskCompleted', 'workOrderTaskPendingReview'].indexOf(currStatus) !== -1) {
	contextVar.updateAttendance = false;
}
var submitType = contextVar.submitType;
contextVar.result = arrayCheck(taskDetails[0].result) ? taskDetails[0].result : [];
var memberCheckout = true;

var attendanceData = (contextVar.exisitingAttendanceData !== '' && Array.isArray(contextVar.exisitingAttendanceData) && contextVar.exisitingAttendanceData.length > 0) ? contextVar.exisitingAttendanceData : [];

var leadDetails;
var checkInTime = contextVar.endTravelDate || contextVar.checkInTime;
var checkOutTime;
var endTask = false;
if (submitType === 'endTask' || submitType === 'endTaskMember' || submitType === 'endTaskCrewMember') {
	checkOutTime = contextVar.submitTaskTime;
	contextVar.updateResult = true;
	contextVar.updateStatus = true;
	endTask = true;
}

if (submitType == 'submitTaskProgress' || submitType == 'checkOut') {
	checkOutTime = contextVar.checkOutCheckBoxForSubmitCapturedTime;
	if (typeof contextVar.checkOutCheckBoxForSubmit === 'undefined' || contextVar.checkOutCheckBoxForSubmit === '' || contextVar.checkOutCheckBoxForSubmit === 'false') {
		memberCheckout = false;
	}
	contextVar.updateResult = true;
	contextVar.recreateInstances = true;
}

if (contextVar.reportIssueType == 'unableToContinue') {
	contextVar.statusId = 'workOrderTaskDiscontinued';
}
if (contextVar.statusId == 'workOrderTaskDiscontinued') {
	contextVar.recreateUserList = [];
	contextVar.updateResult = true;
	checkOutTime = contextVar.reportIssueCapturedTime ? contextVar.reportIssueCapturedTime : new Date().toISOString().replace('T', ' ').replace('Z', '');
}

var taskId = contextVar.workOrderTaskId;
var siteAddressChangeObj = {};

if (submitType == 'checkIn') {
	if (contextVar.endTravelLocationCoordinates) {
		siteAddressChangeObj.siteChangeLatLong = contextVar.endTravelLocationCoordinates;
	}
	if (contextVar.newSiteAddress && contextVar.newSiteAddress.address && submitType == 'checkIn') {
		siteAddressChangeObj.siteChangeAddress = contextVar.newSiteAddress.address;
	} else {
		siteAddressChangeObj.siteChangeAddress = contextVar.newSiteAddressText;
	}
	if (contextVar.reasonOfwrongSite) {
		siteAddressChangeObj.reason = contextVar.reasonOfwrongSite;
	}
	if (contextVar.newLocationPhoto) {
		siteAddressChangeObj.photo = contextVar.newLocationPhoto;
	}
	if (contextVar.incorrectSiteComments) {
		siteAddressChangeObj.notes = contextVar.incorrectSiteComments;
	}
	if (contextVar.incorrectAddress) {
		siteAddressChangeObj.manualCheckIn = contextVar.incorrectAddress;
	}
}

// Attendance Details
function checkIfSiteChangeDataToBeAppended() {
	let flag = true;
	if (isCrewTask) {
		if (crewMobileAccess == 'noAccess') {
			if (leaduserId !== assignedToUserId) {
				flag = false;
			}
		}
	}
	return (contextVar.incorrectAddress === 'true' && flag);
}

function updateCheckInOutTimes(index, lastAttObj, obj, details) {
	let cIn = checkForData(obj.attendanceCheckIn) ? obj.attendanceCheckIn : '',
		cOut = checkForData(obj.attendanceCheckOut) ? obj.attendanceCheckOut : '',
		lastCheckIn = checkForData(lastAttObj.checkInTime) ? lastAttObj.checkInTime : '',
		lastCheckOut = checkForData(lastAttObj.checkOutTime) ? lastAttObj.checkOutTime : '';
	if (cIn > cOut) {
		cOut = checkOutTime;
	}
	if (checkForData(lastCheckOut)) {
		if (lastCheckIn === cIn) {
			attendanceData[index].attendance[attendanceData[index].attendance.length - 1].checkOutTime = cOut;
		} else {
			attendanceData[index].attendance.push({
				...details,
				'checkInTime': cIn,
				'checkOutTime': cOut,
				...(checkIfSiteChangeDataToBeAppended() ? siteAddressChangeObj : {})
			});
		}
	} else {
		if (lastCheckIn === cIn) {
			attendanceData[index].attendance[attendanceData[index].attendance.length - 1].checkOutTime = cOut;
		} else {
			attendanceData[index].attendance.push({
				...details,
				'checkInTime': cIn,
				'checkOutTime': cOut,
				...(checkIfSiteChangeDataToBeAppended() ? siteAddressChangeObj : {})
			});
		}
	}
}

function modifyCurrentAttendanceObj(obj, techDetails) {
	let index = findTheIndex(attendanceData, obj.workforceCrewWorkforceUserId);
	if (index === -1) {
		attendanceData.push({
			'workforceUserId': obj.workforceCrewWorkforceUserId,
			'workOrderTaskId': taskId,
			'attendance': [{
				...techDetails[obj.workforceCrewWorkforceUserId],
				'checkInTime': obj.attendanceCheckIn,
				'checkOutTime': obj.attendanceCheckOut,
				...(checkIfSiteChangeDataToBeAppended() ? siteAddressChangeObj : {})
			}]
		});
	} else {
		if (arrayCheck(attendanceData[index].attendance)) {
			let lastAttObj = attendanceData[index].attendance[attendanceData[index].attendance.length - 1];
			updateCheckInOutTimes(index, lastAttObj, obj, techDetails[obj.workforceCrewWorkforceUserId]);
		} else {
			attendanceData[index].attendance = [{
				...techDetails[obj.workforceCrewWorkforceUserId],
				'checkInTime': obj.attendanceCheckIn,
				'checkOutTime': obj.attendanceCheckOut,
				...(checkIfSiteChangeDataToBeAppended() ? siteAddressChangeObj : {})
			}];
		}
	}
}
let crewAttendanceDetailsDataGrid = [];
var crewMembersDetails = {};
if (contextVar.updateAttendance) {
	if (isCrewTask) {
		crewAttendanceDetailsList = contextVar.crewAttendanceDetailsDataGrid;
		leadDetails = arrayCheck(contextVar.leadDetails) ? contextVar.leadDetails : [{
			'leadName': leaduserName,
			'leadUserId': leaduserId
		}];;

		let crewLeadDetails = {
			[leaduserId]: {
				'crewMemberName': leadDetails[0].leadName,
				'crewLead': true,
				'crewName': arrayCheck(crewAttendanceDetailsList) ? crewAttendanceDetailsList[0].crewName : '-',
				'leadDetails': leadDetails,
				'userId': leaduserId,
				'crewRole': 'Lead',
				'workforceUserId': leaduserId,
				'crewId': contextVar.assignedToCrewId
			}
		};
		if (arrayCheck(crewAttendanceDetailsList)) {
			crewAttendanceDetailsList.forEach((obj) => {
				crewMembersDetails[obj.workforceCrewWorkforceUserId] = {
					'crewMemberName': obj.crewMemberName,
					'crewLead': false,
					'crewName': obj.crewName,
					'leadDetails': leadDetails,
					'userId': obj.workforceCrewWorkforceUserId,
					'crewRole': 'Member',
					'endTask': endTask,
					'workforceUserId': obj.workforceCrewWorkforceUserId,
					'crewId': contextVar.assignedToCrewId
				};
			});
		}
		// Attendance for no-access
		if (crewMobileAccess == 'noAccess') {
			contextVar.recreateUserList.push(leaduserId);
			let crewAttendanceDetailsDataGrid = arrayCheck(contextVar.crewAttendanceDetailsDataGrid) ? contextVar.crewAttendanceDetailsDataGrid : [];
			crewAttendanceDetailsDataGrid.forEach((obj) => {
				if (checkForData(obj.attendanceCheckIn) || checkForData(obj.attendanceCheckOut)) {
					modifyCurrentAttendanceObj(obj, crewMembersDetails);
				}
			});
			//Capture the latest checkin/checkout and send it back
			crewAttendanceDetailsDataGrid.forEach((obj, ind) => {
				let index = findTheIndex(attendanceData, obj.workforceCrewWorkforceUserId);
				if (index !== -1) {
					let att = attendanceData[index].attendance;
					if (arrayCheck(att)) {
						contextVar.crewAttendanceDetailsDataGrid[ind].attendanceCheckOut = att[att.length - 1].checkOutTime;
					}
				}
			});
			// Lead Attendance
			if (checkForData(checkInTime) || checkForData(checkOutTime)) {
				modifyCurrentAttendanceObj({
					'workforceCrewWorkforceUserId': leaduserId,
					'attendanceCheckIn': checkInTime,
					'attendanceCheckOut': checkOutTime
				}, crewLeadDetails);
			}
		}

		// Attendance for partial-access
		if (crewMobileAccess == 'partialAccess') {
			if (leaduserId === assignedToUserId) {
				contextVar.recreateUserList.push(leaduserId);
				// For lead attendance
				modifyCurrentAttendanceObj({
					'workforceCrewWorkforceUserId': assignedToUserId,
					'attendanceCheckIn': checkInTime,
					'attendanceCheckOut': checkOutTime
				}, crewLeadDetails);
				// For Member Attendance
				if (memberCheckout) {
					attendanceData.forEach((obj, ind) => {
						let att = obj.attendance;
						if (arrayCheck(att)) {
							if (!checkForData(att[att.length - 1].checkOutTime)) {
								attendanceData[ind].attendance[att.length - 1].checkOutTime = checkOutTime;
								contextVar.recreateUserList.push(obj.workforceUserId);
							}
						}
					});
				}
			} else {
				contextVar.recreateUserList.push(assignedToUserId);
				modifyCurrentAttendanceObj({
					'workforceCrewWorkforceUserId': assignedToUserId,
					'attendanceCheckIn': checkInTime,
					'attendanceCheckOut': checkOutTime
				}, crewMembersDetails);
			}
		}
	} else {
		// Single Tech Attendance
		contextVar.recreateUserList.push(leaduserId);
		if (checkForData(checkInTime) || checkForData(checkOutTime)) {
			modifyCurrentAttendanceObj({
				'workforceCrewWorkforceUserId': assignedToUserId,
				'attendanceCheckIn': checkInTime,
				'attendanceCheckOut': checkOutTime
			}, {
				[assignedToUserId]: {
					'crewMemberName': leaduserName,
					'crewLead': '',
					'crewName': '',
					'userId': assignedToUserId,
					'workforceUserId': assignedToUserId
				}
			});
		}
	}
	contextVar.attendanceInfo = attendanceData;
}

var workOrderTaskObj = {};
let servModeDateVarMapping = {
	'assetInstallation': 'addInstallServicesTime',
	'assetReplacement': 'addReplaceServicesTime',
	'assetRemoval': 'addRemoveServicesTime',
	'assetServicing': 'addServiceServicesTime',
	'assetOthers': 'addOthersServicesTime'
};
let servModeUpdateDateVarMapping = {
	'assetInstallation': 'updateInstallServicesTime',
	'assetReplacement': 'updateReplaceServicesTime',
	'assetRemoval': 'updateRemoveServicesTime',
	'assetServicing': 'updateServiceServicesTime',
	'assetOthers': 'updateOthersServicesTime'
};
if (contextVar.updateResult) {
	contextVar.workOrderTask = [];
	let obj = {};
	if (contextVar.initialEvidenceDataGrid) {
		obj['initialEvidenceDataGrid'] = contextVar.initialEvidenceDataGrid;
	}
	if (contextVar.initialComments) {
		obj['initialComments'] = contextVar.initialComments;
	}
	let currentUser = [{
		'userName': contextVar.userName,
		'userId': contextVar.assignedToUserId,
		'crew': {
			'leadDetails': arrayCheck(contextVar.leadDetails) ? contextVar.leadDetails : [],
			'crewId': contextVar.workOrderTaskAssignedToCrewId,
			'crewName': contextVar.newCrewName
		},
		'userEmail': contextVar.userEmail,
		'userContact': contextVar.userPhoneNumber
	}];


	if (contextVar.servicesDataGrid) {
		let serviceGrid = JSON.parse(JSON.stringify(contextVar.servicesDataGrid));

		let serviceGridWrapper = [];
		if (Array.isArray(serviceGrid)) {
			//Previous instance of serviceGridWrapper from workOrderTaskResult
			let oldServObj = arrayCheck(contextVar.result) && arrayCheck(contextVar.result[0].serviceGridWrapper) ? JSON.parse(JSON.stringify(contextVar.result[contextVar.result.length - 1].serviceGridWrapper)) : [];
			let oldNewServMapping = {};
			//Comparing old serviceGridWrapper with the new serviceGrid
			oldServObj.forEach((oldObj, i) => {
				serviceGrid.some((newObj, j) => {
					if (arrayCheck(newObj.selectedServiceType) && checkForData(oldObj.serviceMode)) {
						let newServType = newObj.selectedServiceType[0].listOptionAnswerId;
						let newServAddedTime = newObj[servModeDateVarMapping[newServType]];
						let newServUpdatedTime = newObj[servModeUpdateDateVarMapping[newServType]];
						//Comparing existing service based on serviceActionTpe and serviceActionTime, with new serviceGrid
						if (oldObj.serviceMode === newServType && oldObj.addedOn === newServAddedTime) {
							oldNewServMapping[j] = i;
							//check for updated/modifed time
							if (checkForData(newServUpdatedTime)) {
								if (oldObj.modifiedOn === newServUpdatedTime) {
									if (arrayCheck(serviceGrid[j].addServicePhotosDataGrid)) {
										serviceGrid[j].addServicePhotosDataGrid.forEach((o, ind) => {
											serviceGrid[j].addServicePhotosDataGrid[ind].capturedBy = oldObj.addedBy;
										});
									}
								} else {
									if (arrayCheck(serviceGrid[j].addServicePhotosDataGrid)) {
										serviceGrid[j].addServicePhotosDataGrid.forEach((o, ind) => {
											serviceGrid[j].addServicePhotosDataGrid[ind].capturedBy = currentUser[0].userName;
										});
									}
								}
							} else {
								if (arrayCheck(serviceGrid[j].addServicePhotosDataGrid)) {
									serviceGrid[j].addServicePhotosDataGrid.forEach((o, ind) => {
										serviceGrid[j].addServicePhotosDataGrid[ind].capturedBy = oldObj.addedBy;
									});
								}
							}

							return true;
						}
					}
				});
			});

			serviceGrid.some((sObj, i) => {
				let serviceMode, serviceTypeId, serviceName, serviceId;
				if (arrayCheck(sObj.selectedServiceType)) {
					serviceMode = sObj.selectedServiceType[0].listOptionAnswerId;
					serviceTypeId = sObj.selectedService[0].serviceTypeId;
					serviceName = sObj.selectedService[0].serviceName;
					serviceId = sObj.selectedService[0].serviceId;
				}
				if (serviceMode === '') {
					return false;
				}
				let indObj = {
					'serviceMode': serviceMode,
					'addedBy': currentUser[0].userName,
					'addedByUserId': currentUser[0].userId,
					'userEmail': currentUser[0].userEmail,
					'userContact': currentUser[0].userContact,
					'selectedService': {
						'serviceTypeId': serviceTypeId,
						'serviceName': serviceName,
						'serviceId': serviceId
					}
				};

				if (checkForData(oldNewServMapping[i])) {
					let newServType = sObj.selectedServiceType[0].listOptionAnswerId;
					let newServUpdatedTime = sObj[servModeUpdateDateVarMapping[newServType]];
					if (checkForData(newServUpdatedTime)) {
						if (oldServObj[oldNewServMapping[i]].modifiedOn === newServUpdatedTime) {
							indObj = {
								...indObj,
								'addedBy': oldServObj[oldNewServMapping[i]].addedBy,
								'addedByUserId': oldServObj[oldNewServMapping[i]].addedByUserId,
								'userEmail': oldServObj[oldNewServMapping[i]].userEmail,
								'userContact': oldServObj[oldNewServMapping[i]].userContact
							};
						}
					} else {
						indObj = {
							...indObj,
							'addedBy': oldServObj[oldNewServMapping[i]].addedBy,
							'addedByUserId': oldServObj[oldNewServMapping[i]].addedByUserId,
							'userEmail': oldServObj[oldNewServMapping[i]].userEmail,
							'userContact': oldServObj[oldNewServMapping[i]].userContact
						};
					}

				}

				if (arrayCheck(serviceGrid[i].addServicePhotosDataGrid)) {
					serviceGrid[i].addServicePhotosDataGrid.forEach((o, ind) => {
						serviceGrid[i].addServicePhotosDataGrid[ind].capturedBy = checkForData(o.capturedBy) ? o.capturedBy : currentUser[0].userName;
					});
				}
				let selectItemInst, selectItemRem, selectItemServ, selectItemOthr;
				switch (serviceMode) {
					case 'assetInstallation':
						selectItemInst = sObj.selectedAssetToInstall;
						serviceGrid[i].assets = [{
							'catalogName': selectItemInst[0].catalogName,
							'installedBaseSiteId': contextVar.siteId,
							'installedBaseCatalogId': selectItemInst[0].installedBaseId
						}];
						serviceGrid[i].addServicesTime = sObj.addInstallServicesTime;
						serviceGrid[i].modifiedServicesTime = sObj.updateInstallServicesTime;
						indObj = {
							...indObj,
							'addedOn': sObj.addInstallServicesTime,
							'updatedOn': {
								'time': sObj.addInstallServicesTime,
								'notes': sObj.servicesNotes
							},
							'modifiedOn': sObj.updateInstallServicesTime,
							[serviceMode]: {
								'installed': {
									'assetId': selectItemInst[0].installedBaseId,
									'assetName': selectItemInst[0].catalogName,
									'assetNameToDisplay': selectItemInst[0].catalogName + ' - ' + selectItemInst[0].manufacturerName,
									'catalogId': selectItemInst[0].catalogId,
									'modelName': selectItemInst[0].catalogName,
									'modelNumber': selectItemInst[0].catalogModelNumber,
									'manufacturer': selectItemInst[0].manufacturerName,
									'category': selectItemInst[0].assetCategory,
									'categoryId': selectItemInst[0].assetCategoryId,
									'manualUrl': selectItemInst[0].fileUrl,
									'serialNumber': sObj.barcode,
									'photoOfSerialNum': sObj.photoSerialNumber,
									'installedTime': sObj.addInstallServicesTime,
									'customerPrice': checkForData(selectItemInst[0].catalogCustomerPrice) ? selectItemInst[0].catalogCustomerPrice.toString() : '',
									'estimatedQuantity': checkForData(selectItemInst[0].estimatedQuantity) ? selectItemInst[0].estimatedQuantity.toString() : '',
									'unitPrice': checkForData(selectItemInst[0].catalogUnitPrice) ? selectItemInst[0].catalogUnitPrice.toString() : '',
									'workOrderInventoryId': checkForData(selectItemInst[0].workOrderInventoryId) ? selectItemInst[0].workOrderInventoryId : ''
								},
								'optionalPhotoPlusNotes': {
									'capturedPhoto': arrayCheck(sObj.addServicePhotosDataGrid) ? sObj.addServicePhotosDataGrid : [],
									'serviceOptionalNotes': sObj.servicesNotes
								}
							}
						};
						break;
					case 'assetReplacement':
						selectItemInst = sObj.selectedAssetToInstall;
						selectItemRem = sObj.selectedAssetToRemove;
						serviceGrid[i].assets = [{
							'catalogName': selectItemInst[0].catalogName,
							'installedBaseSiteId': contextVar.siteId,
							'installedBaseCatalogId': selectItemInst[0].installedBaseId
						}];
						serviceGrid[i].addServicesTime = sObj.addReplaceServicesTime;
						serviceGrid[i].modifiedServicesTime = sObj.updateReplaceServicesTime;
						indObj = {
							...indObj,
							'addedOn': sObj.addReplaceServicesTime,
							'updatedOn': {
								'time': sObj.addReplaceServicesTime,
								'notes': sObj.servicesNotes
							},
							'modifiedOn': sObj.updateReplaceServicesTime,
							[serviceMode]: {
								'installed': {
									'assetId': selectItemInst[0].installedBaseId,
									'assetName': selectItemInst[0].catalogName,
									'assetNameToDisplay': selectItemInst[0].catalogName + ' - ' + selectItemInst[0].manufacturerName,
									'catalogId': selectItemInst[0].catalogId,
									'modelName': selectItemInst[0].catalogName,
									'modelNumber': selectItemInst[0].catalogModelNumber,
									'manufacturer': selectItemInst[0].manufacturerName,
									'category': selectItemInst[0].assetCategory,
									'categoryId': selectItemInst[0].assetCategoryId,
									'manualUrl': selectItemInst[0].fileUrl,
									'serialNumber': sObj.barcode,
									'photoOfSerialNum': sObj.photoSerialNumber,
									'installedTime': sObj.selectedAssetToInstallCapturedTime,
									'customerPrice': checkForData(selectItemInst[0].catalogCustomerPrice) ? selectItemInst[0].catalogCustomerPrice.toString() : '',
									'estimatedQuantity': checkForData(selectItemInst[0].estimatedQuantity) ? selectItemInst[0].estimatedQuantity.toString() : '',
									'unitPrice': checkForData(selectItemInst[0].catalogUnitPrice) ? selectItemInst[0].catalogUnitPrice.toString() : '',
									'workOrderInventoryId': checkForData(selectItemInst[0].workOrderInventoryId) ? selectItemInst[0].workOrderInventoryId : ''
								},
								'removed': {
									'assetId': selectItemRem[0].installedBaseId,
									'assetName': selectItemRem[0].catalogName,
									'assetNameToDisplay': selectItemRem[0].catalogName + ' - ' + selectItemRem[0].manufacturerName,
									'catalogId': selectItemRem[0].catalogId,
									'modelName': selectItemRem[0].catalogName,
									'modelNumber': selectItemRem[0].catalogModelNumber,
									'manufacturer': selectItemRem[0].manufacturerName,
									'category': selectItemRem[0].assetCategory,
									'categoryId': selectItemRem[0].assetCategoryId,
									'manualUrl': selectItemRem[0].fileUrl,
									'serialNumber': selectItemRem[0].serialNumber,
									'photoOfSerialNum': sObj.photoSerialNumber,
									'installedTime': sObj.selectedAssetToRemoveCapturedTime,
									'removalReason': sObj.assetRemovalReason,
									'removedTime': sObj.selectedAssetToRemoveCapturedTime
								},
								'optionalPhotoPlusNotes': {
									'capturedPhoto': arrayCheck(sObj.addServicePhotosDataGrid) ? sObj.addServicePhotosDataGrid : [],
									'serviceOptionalNotes': sObj.servicesNotes
								}
							}
						};
						break;
					case 'assetRemoval':
						selectItemRem = sObj.selectedAssetToRemove;
						serviceGrid[i].assets = [{
							'catalogName': selectItemRem[0].catalogName,
							'installedBaseSiteId': contextVar.siteId,
							'installedBaseCatalogId': selectItemRem[0].installedBaseId
						}];
						serviceGrid[i].addServicesTime = sObj.addRemoveServicesTime;
						serviceGrid[i].modifiedServicesTime = sObj.updateRemoveServicesTime;
						indObj = {
							...indObj,
							'addedOn': sObj.addRemoveServicesTime,
							'updatedOn': {
								'time': sObj.addRemoveServicesTime,
								'notes': sObj.servicesNotes
							},
							'modifiedOn': sObj.updateRemoveServicesTime,
							[serviceMode]: {
								'removed': {
									'assetId': selectItemRem[0].installedBaseId,
									'assetName': selectItemRem[0].catalogName,
									'assetNameToDisplay': selectItemRem[0].catalogName + ' - ' + selectItemRem[0].manufacturerName,
									'catalogId': selectItemRem[0].catalogId,
									'modelName': selectItemRem[0].catalogName,
									'modelNumber': selectItemRem[0].catalogModelNumber,
									'manufacturer': selectItemRem[0].manufacturerName,
									'category': selectItemRem[0].assetCategory,
									'categoryId': selectItemRem[0].assetCategoryId,
									'manualUrl': selectItemRem[0].fileUrl,
									'serialNumber': selectItemRem[0].serialNumber,
									'photoOfSerialNum': sObj.photoSerialNumber,
									'installedTime': sObj.addRemoveServicesTime,
									'removalReason': sObj.assetRemovalReason,
									'removedTime': sObj.addRemoveServicesTime
								},
								'optionalPhotoPlusNotes': {
									'capturedPhoto': arrayCheck(sObj.addServicePhotosDataGrid) ? sObj.addServicePhotosDataGrid : [],
									'serviceOptionalNotes': sObj.servicesNotes
								}
							}
						};
						break;
					case 'assetServicing':
						selectItemServ = sObj.selectedAssetToService;
						serviceGrid[i].assets = [{
							'catalogName': selectItemServ[0].catalogName,
							'installedBaseSiteId': contextVar.siteId,
							'installedBaseCatalogId': selectItemServ[0].installedBaseId
						}];
						serviceGrid[i].addServicesTime = sObj.addServiceServicesTime;
						serviceGrid[i].modifiedServicesTime = sObj.updateServiceServicesTime;
						indObj = {
							...indObj,
							'addedOn': sObj.addServiceServicesTime,
							'updatedOn': {
								'time': sObj.addServiceServicesTime,
								'notes': sObj.servicesNotes
							},
							'modifiedOn': sObj.updateServiceServicesTime,
							[serviceMode]: {
								'serviced': {
									'assetId': selectItemServ[0].installedBaseId,
									'assetName': selectItemServ[0].catalogName,
									'assetNameToDisplay': selectItemServ[0].catalogName + ' - ' + selectItemServ[0].manufacturerName,
									'catalogId': selectItemServ[0].catalogId,
									'modelName': selectItemServ[0].catalogName,
									'modelNumber': selectItemServ[0].catalogModelNumber,
									'manufacturer': selectItemServ[0].manufacturerName,
									'category': selectItemServ[0].assetCategory,
									'categoryId': selectItemServ[0].assetCategoryId,
									'manualUrl': selectItemServ[0].fileUrl,
									'serialNumber': selectItemServ[0].serialNumber,
									'photoOfSerialNum': sObj.photoSerialNumber,
									'installedTime': sObj.addServiceServicesTime
								},
								'optionalPhotoPlusNotes': {
									'capturedPhoto': arrayCheck(sObj.addServicePhotosDataGrid) ? sObj.addServicePhotosDataGrid : [],
									'serviceOptionalNotes': sObj.servicesNotes
								}
							}
						};
						break;
					case 'assetOthers':
						selectItemOthr = sObj.selectAssetOthers;
						serviceGrid[i].assets = arrayCheck(selectItemOthr) ? [{
							'catalogName': selectItemOthr[0].catalogName,
							'installedBaseSiteId': contextVar.siteId,
							'installedBaseCatalogId': selectItemOthr[0].installedBaseId
						}] : [];
						serviceGrid[i].addServicesTime = sObj.addOthersServicesTime;
						serviceGrid[i].modifiedServicesTime = sObj.updateOthersServicesTime;
						indObj = {
							...indObj,
							'addedOn': sObj.addOthersServicesTime,
							'updatedOn': {
								'time': sObj.addOthersServicesTime,
								'notes': sObj.servicesNotes
							},
							'modifiedOn': sObj.updateOthersServicesTime,
							[serviceMode]: {
								'others': {
									'details': sObj.otherDetails,
									'photoOfSerialNum': sObj.photoSerialNumber,
									'installedTime': sObj.selectAssetOthersCapturedTime,

								},
								'optionalPhotoPlusNotes': {
									'capturedPhoto': arrayCheck(sObj.addServicePhotosDataGrid) ? sObj.addServicePhotosDataGrid : [],
									'serviceOptionalNotes': sObj.servicesNotes
								}
							}
						};
						if (arrayCheck(selectItemOthr)) {
							indObj[serviceMode].others = {
								...indObj[serviceMode].others,
								'serialNumber': selectItemOthr[0].serialNumber,
								'assetId': selectItemOthr[0].installedBaseId,
								'assetName': selectItemOthr[0].catalogName,
								'assetNameToDisplay': selectItemOthr[0].catalogName + ' - ' + selectItemOthr[0].manufacturerName,
								'catalogId': selectItemOthr[0].catalogId,
								'modelName': selectItemOthr[0].catalogName,
								'modelNumber': selectItemOthr[0].catalogModelNumber,
								'manufacturer': selectItemOthr[0].manufacturerName,
								'category': selectItemOthr[0].assetCategory,
								'categoryId': selectItemOthr[0].assetCategoryId,
								'manualUrl': selectItemOthr[0].fileUrl
							};
						}
						break;
				}
				serviceGridWrapper.push(indObj);
			});
		}
		obj['servicesDataGrid'] = serviceGrid;
		obj['serviceGridWrapper'] = serviceGridWrapper;
	}

	if (contextVar.fetchSuggestedMaterials) {
		let suggestedMaterialsGrid = JSON.parse(JSON.stringify(contextVar.fetchSuggestedMaterials));

		if (Array.isArray(suggestedMaterialsGrid)) {
			//Previous instance of suggestedMaterialsGrid from workOrderTaskResult
			let oldSugMatObj = arrayCheck(contextVar.result) && arrayCheck(contextVar.result[0].suggestedMaterials) ? JSON.parse(JSON.stringify(contextVar.result[contextVar.result.length - 1].suggestedMaterials)) : [];
			let oldNewSugMatMapping = {};

			//Comparing old suggestedMaterials with the new fetchSuggestedMaterials (suggestedMaterials)
			oldSugMatObj.forEach((oldObj, i) => {
				suggestedMaterialsGrid.some((newObj, j) => {
					//Comparing the same material in old and new objects
					if (oldObj.catalogId === newObj.catalogId) {
						//Checking for suggestedMaterial capture time
						if (checkForData(newObj.suggestedMaterialCapturedTime) && checkForData(oldObj.suggestedMaterialCapturedTime)) {
							let oldObjUpdatedTime = oldObj.suggestedMaterialCapturedTime;
							let newObjUpdatedTime = newObj.suggestedMaterialCapturedTime;
							//Comparing existing suggestedMaterialsGrid based on updatedTime with new fetchSuggestedMaterials (suggestedMaterials)
							if (oldObjUpdatedTime === newObjUpdatedTime) {
								oldNewSugMatMapping[j] = i;
								if (arrayCheck(suggestedMaterialsGrid[j].suggestedMaterialsPhotosDataGrid)) {
									suggestedMaterialsGrid[j].suggestedMaterialsPhotosDataGrid.forEach((o, ind) => {
										suggestedMaterialsGrid[j].suggestedMaterialsPhotosDataGrid[ind].capturedBy = oldObj.addedBy;
									});
								}
							} else {
								if (arrayCheck(suggestedMaterialsGrid[j].suggestedMaterialsPhotosDataGrid)) {
									suggestedMaterialsGrid[j].suggestedMaterialsPhotosDataGrid.forEach((o, ind) => {
										suggestedMaterialsGrid[j].suggestedMaterialsPhotosDataGrid[ind].capturedBy = currentUser[0].userName;
									});
								}
							}

						}
					}
				});
			});



			suggestedMaterialsGrid.some((sObj, i) => {

				let newObjUpdatedTime = sObj.suggestedMaterialCapturedTime;
				if (checkForData(newObjUpdatedTime)) {
					if (checkForData(oldNewSugMatMapping[i])) {
						if (oldSugMatObj[oldNewSugMatMapping[i]].suggestedMaterialCapturedTime === newObjUpdatedTime) {
							suggestedMaterialsGrid[i].addedBy = oldSugMatObj[oldNewSugMatMapping[i]].addedBy;
							suggestedMaterialsGrid[i].addedByUserId = oldSugMatObj[oldNewSugMatMapping[i]].addedByUserId;
							suggestedMaterialsGrid[i].userEmail = oldSugMatObj[oldNewSugMatMapping[i]].userEmail;
							suggestedMaterialsGrid[i].userContact = oldSugMatObj[oldNewSugMatMapping[i]].userContact;

						} else {
							suggestedMaterialsGrid[i].addedBy = currentUser[0].userName;
							suggestedMaterialsGrid[i].addedByUserId = currentUser[0].userId;
							suggestedMaterialsGrid[i].userEmail = currentUser[0].userEmail;
							suggestedMaterialsGrid[i].userContact = currentUser[0].userContact;
						}
					} else {
						suggestedMaterialsGrid[i].addedBy = currentUser[0].userName;
						suggestedMaterialsGrid[i].addedByUserId = currentUser[0].userId;
						suggestedMaterialsGrid[i].userEmail = currentUser[0].userEmail;
						suggestedMaterialsGrid[i].userContact = currentUser[0].userContact;
					}

					if (arrayCheck(suggestedMaterialsGrid[i].suggestedMaterialsPhotosDataGrid)) {
						suggestedMaterialsGrid[i].suggestedMaterialsPhotosDataGrid.forEach((o, ind) => {
							suggestedMaterialsGrid[i].suggestedMaterialsPhotosDataGrid[ind].capturedBy = checkForData(o.capturedBy) ? o.capturedBy : currentUser[0].userName;
						});
					}
				}


			});

		}

		contextVar.fetchSuggestedMaterials = suggestedMaterialsGrid;


	}

	if (contextVar.additionalMaterialsDataGrid) {
		let additionalMaterialsGrid = JSON.parse(JSON.stringify(contextVar.additionalMaterialsDataGrid));

		if (Array.isArray(additionalMaterialsGrid)) {
			//Previous instance of additionalMaterials from workOrderTaskResult
			let oldAddMatObj = arrayCheck(contextVar.result) && arrayCheck(contextVar.result[0].additionalMaterials) ? JSON.parse(JSON.stringify(contextVar.result[contextVar.result.length - 1].additionalMaterials)) : [];
			let oldNewAddMatMapping = {};

			//Comparing old additionalMaterials with the new additionalMaterialsDataGrid
			oldAddMatObj.forEach((oldObj, i) => {
				additionalMaterialsGrid.some((newObj, j) => {
					if (arrayCheck(oldObj.material) && arrayCheck(newObj.material)) {
						let newAddTime = newObj.addedMaterialCapturedTime;
						let oldAddTime = oldObj.addedMaterialCapturedTime;
						let oldUpdateTime = oldObj.updateMaterialCapturedTime;
						let newUpdateTime = newObj.updateMaterialCapturedTime;
						//Comparing the same material in old and new objects additionalMaterial 
						if (newAddTime === oldAddTime && oldObj.material[0].catalogId === newObj.material[0].catalogId) {
							oldNewAddMatMapping[j] = i;
							if (checkForData(newUpdateTime)) {
								//Comparing existing additionalMaterial based on updatedTime with new additionalMaterialsDataGrid
								if (oldUpdateTime === newUpdateTime) {
									if (arrayCheck(additionalMaterialsGrid[j].addMaterialsPhotosDataGrid)) {
										additionalMaterialsGrid[j].addMaterialsPhotosDataGrid.forEach((o, ind) => {
											additionalMaterialsGrid[j].addMaterialsPhotosDataGrid[ind].capturedBy = oldObj.addedBy;
										});
									}
								} else {
									if (arrayCheck(additionalMaterialsGrid[j].addMaterialsPhotosDataGrid)) {
										additionalMaterialsGrid[j].addMaterialsPhotosDataGrid.forEach((o, ind) => {
											additionalMaterialsGrid[j].addMaterialsPhotosDataGrid[ind].capturedBy = currentUser[0].userName;
										});
									}

								}
							} else {
								if (arrayCheck(additionalMaterialsGrid[j].addMaterialsPhotosDataGrid)) {
									additionalMaterialsGrid[j].addMaterialsPhotosDataGrid.forEach((o, ind) => {
										additionalMaterialsGrid[j].addMaterialsPhotosDataGrid[ind].capturedBy = oldObj.addedBy;
									});
								}

							}

						}
					}
				});
			});

			additionalMaterialsGrid.some((sObj, i) => {

				additionalMaterialsGrid[i].addedBy = currentUser[0].userName;
				additionalMaterialsGrid[i].addedByUserId = currentUser[0].userId;
				additionalMaterialsGrid[i].userEmail = currentUser[0].userEmail;
				additionalMaterialsGrid[i].userContact = currentUser[0].userContact;

				if (checkForData(oldNewAddMatMapping[i])) {
					let newUpdateTime = sObj.updateMaterialCapturedTime;
					if (checkForData(newUpdateTime)) {
						if (oldAddMatObj[oldNewAddMatMapping[i]].updateMaterialCapturedTime === newUpdateTime) {
							additionalMaterialsGrid[i].addedBy = oldAddMatObj[oldNewAddMatMapping[i]].addedBy;
							additionalMaterialsGrid[i].addedByUserId = oldAddMatObj[oldNewAddMatMapping[i]].addedByUserId;
							additionalMaterialsGrid[i].userEmail = oldAddMatObj[oldNewAddMatMapping[i]].userEmail;
							additionalMaterialsGrid[i].userContact = oldAddMatObj[oldNewAddMatMapping[i]].userContact;
						}
					} else {
						additionalMaterialsGrid[i].addedBy = oldAddMatObj[oldNewAddMatMapping[i]].addedBy;
						additionalMaterialsGrid[i].addedByUserId = oldAddMatObj[oldNewAddMatMapping[i]].addedByUserId;
						additionalMaterialsGrid[i].userEmail = oldAddMatObj[oldNewAddMatMapping[i]].userEmail;
						additionalMaterialsGrid[i].userContact = oldAddMatObj[oldNewAddMatMapping[i]].userContact;
					}
				}

				if (arrayCheck(additionalMaterialsGrid[i].addMaterialsPhotosDataGrid)) {
					additionalMaterialsGrid[i].addMaterialsPhotosDataGrid.forEach((o, ind) => {
						additionalMaterialsGrid[i].addMaterialsPhotosDataGrid[ind].capturedBy = checkForData(o.capturedBy) ? o.capturedBy : currentUser[0].userName;
					});
				}
			});

		}

		contextVar.additionalMaterialsDataGrid = additionalMaterialsGrid;

	}

	obj['suggestedMaterials'] = contextVar.fetchSuggestedMaterials;
	obj['additionalMaterials'] = contextVar.additionalMaterialsDataGrid;

	if (contextVar.customerSignature) {
		obj['customerSignature'] = contextVar.customerSignature;
	}
	if (contextVar.checkOutCheckBoxForSubmitCapturedTime) {
		obj['SubmittedDate'] = contextVar.checkOutCheckBoxForSubmitCapturedTime;
	} else if (contextVar.submitTaskTime) {
		obj['SubmittedDate'] = contextVar.submitTaskTime;
	} else if (contextVar.reportIssueCapturedTime) {
		obj['SubmittedDate'] = contextVar.reportIssueCapturedTime;
	}
	if (contextVar.checkOutCheckBoxForSubmitLocationCoordinates) {
		obj['checkOutSubmitLocationCoordinates'] = contextVar.checkOutCheckBoxForSubmitLocationCoordinates;
	}
	if (contextVar.submitProgressEvidenceDataGrid) {
		obj['submitProgressEvidenceDataGrid'] = contextVar.submitProgressEvidenceDataGrid;
	}
	if (contextVar.submitProgressComments) {
		obj['submitProgressComments'] = contextVar.submitProgressComments;
	}
	if (contextVar.recordInitialEvidenceTime) {
		obj['recordInitialEvidenceTime'] = contextVar.recordInitialEvidenceTime;
	}
	if (contextVar.recordInitialEvidenceLocationCoordinates) {
		obj['recordInitialEvidenceLocationCoordinates'] = contextVar.recordInitialEvidenceLocationCoordinates;
	}
	if (contextVar.recordSubmitServicesTime) {
		obj['recordSubmitServicesTime'] = contextVar.recordSubmitServicesTime;
	}
	if (contextVar.submitServicesLocationCoordinates) {
		obj['submitServicesLocationCoordinates'] = contextVar.submitServicesLocationCoordinates;
	}
	if (contextVar.newSiteAddress && contextVar.newSiteAddress.address) {
		obj['siteChangeAddress'] = contextVar.newSiteAddress.address;
	} else {
		obj['siteChangeAddress'] = contextVar.newSiteAddressText;
	}
	if (contextVar.submitTaskLocationCoordinates) {
		obj['submitTaskLocationCoordinates'] = contextVar.submitTaskLocationCoordinates;
	}
	if (contextVar.finalEvidenceDataGrid) {
		obj['finalEvidenceDataGrid'] = contextVar.finalEvidenceDataGrid;
	}
	if (contextVar.finalComments) {
		obj['finalComments'] = contextVar.finalComments;
	}
	if (contextVar.incorrectAddress) {
		obj['incorrectAddress'] = contextVar.incorrectAddress;
	}
	if (contextVar.endTravelLocationCoordinates) {
		obj['endTravelLocationCoordinates'] = contextVar.endTravelLocationCoordinates;
	}
	if (contextVar.endTravelDate) {
		obj['endTravelDate'] = contextVar.endTravelDate;
	}
	if (contextVar.crewAttendanceDetailsDataGrid) {
		obj['crewAttendanceDetailsDataGrid'] = contextVar.crewAttendanceDetailsDataGrid;
		if (contextVar.crewAttendanceDetailsDataGrid[0].workforceCrewCrewId) {
			obj['crewId'] = contextVar.crewAttendanceDetailsDataGrid[0].workforceCrewCrewId;
		}
		if (contextVar.crewAttendanceDetailsDataGrid[0].crewLeadUserId) {
			obj['crewLeadId'] = contextVar.crewAttendanceDetailsDataGrid[0].crewLeadUserId;
		}
	}
	if (contextVar.crewMobileAccess == 'noAccess' || contextVar.crewMobileAccess == 'partialAccess') {
		if (contextVar.assignedToUserId == contextVar.leadUserId || contextVar['__sys__loggedIn_UserId'] == contextVar.leadUserId) {
			if (contextVar.leadDetails && Array.isArray(contextVar.leadDetails) && contextVar.leadDetails.length > 0) {
				obj['userEmail'] = contextVar.leadDetails[0].leadEmailId;
				obj['userPhoneNumber'] = contextVar.leadDetails[0].leadPhoneNumber;
				obj['userName'] = contextVar.leadDetails[0].leadName;
			}
		}
	} else {
		obj['userName'] = contextVar.userName;
		obj['userEmail'] = contextVar.userEmail;
		obj['userPhoneNumber'] = contextVar.userPhoneNumber;
	}
	if (submitType) {
		obj['submitType'] = submitType;
	}
	if (contextVar.approvedBy) {
		obj['approvedBy'] = contextVar.approvedBy;
	}

	contextVar.result.push(obj);
	workOrderTaskObj['result'] = contextVar.result;
}


if (assignedToUserId == leaduserId) {
	workOrderTaskObj['statusId'] = contextVar.statusId;
}

//No Access Task
if (submitType == 'checkIn' && contextVar.crewMobileAccess == 'noAccess') {
	let leadAttendanceInfo = contextVar.attendanceInfo.find(x => x.workforceUserId === leaduserId);
	let leadAttendance = checkForData(leadAttendanceInfo) && arrayCheck(leadAttendanceInfo.attendance) ? leadAttendanceInfo.attendance : [];
	if (arrayCheck(leadAttendance) && checkForData(leadAttendance[0].checkInTime)) {
		workOrderTaskObj['statusId'] = 'workOrderTaskInProgress';
		contextVar.updateStatus = true;
	} else {
		workOrderTaskObj['statusId'] = currStatus;
		contextVar.updateStatus = true;
	}
}

//Partial Access Task
if (submitType == 'checkIn' && contextVar.crewMobileAccess == 'partialAccess' && leaduserId === assignedToUserId) {
	workOrderTaskObj['statusId'] = 'workOrderTaskInProgress';
	contextVar.updateStatus = true;
}

//Single Technician Task
if (submitType == 'checkIn' && (contextVar.crewMobileAccess === '' && contextVar.crewMobileAccess != 'partialAccess' && contextVar.crewMobileAccess != 'noAccess')) {
	workOrderTaskObj['statusId'] = 'workOrderTaskInProgress';
	contextVar.updateStatus = true;
}

/*
if (submitType == 'checkIn') {
	workOrderTaskObj['statusId'] = 'workOrderTaskInProgress';
	contextVar.updateStatus = true;
}*/

if (submitType == 'endTask') {
	workOrderTaskObj['statusId'] = contextVar.reportIssueType === 'unableToContinue' ? 'workOrderTaskDiscontinued' : 'workOrderTaskPendingReview';
	workOrderTaskObj['eventType'] = 'workOrderTaskSubmittedForReview';
}

if (currStatus === 'workOrderTaskInProgress' && contextVar.statusId === 'workOrderTaskInTransit') {
	workOrderTaskObj['statusId'] = 'workOrderTaskInProgress';
}

workOrderTaskObj['id'] = taskId;
if (contextVar.customerSignature) {
	workOrderTaskObj['customerSignature'] = contextVar.customerSignature;
}
if (!checkForData(taskDetails[0].actualStartTime)) {
	workOrderTaskObj['actualStartTime'] = contextVar.checkInTime;
}
if (submitType === 'endTask') {
	workOrderTaskObj['completedDate'] = checkOutTime;
}
if (contextVar.incidentDetails) {
	workOrderTaskObj['incidentDetails'] = contextVar.incidentDetails;
}
if (submitType == 'submitTaskProgress') {
	workOrderTaskObj['eventType'] = 'workOrderTaskSubmitProgress';
}
if (!checkForData(workOrderTaskObj['eventType'])) {
	workOrderTaskObj['eventType'] = workOrderTaskObj['statusId'];
}
workOrderTaskObj['recver'] = taskDetails[0].recver || 0;
contextVar.workOrderTask = [workOrderTaskObj];
contextVar.subAction = 'upsertWorkOrderTask';
if (submitType === 'endTask') {
	contextVar.recreateUserList = [];
}