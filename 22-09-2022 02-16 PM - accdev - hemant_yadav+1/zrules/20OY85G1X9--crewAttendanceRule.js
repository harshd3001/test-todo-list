function checkIfArray(data) {
	return (typeof data !== 'undefined' && data !== '' && Array.isArray(data) && data.length > 0);
}

function dateCompare(d1, d2) {
	return (new Date(d1).getTime() > new Date(d2).getTime());
}

function fillGridValues(gridValue) {
	let obj = {
		'userId': contextVar.crewMobileAccess == 'partialAccess' ? contextVar.assignedToUserId : gridValue.workforceCrewWorkforceUserId,
		'crewMemberName': gridValue.crewMemberName,
		'checkInTime': gridValue.attendanceCheckIn ? gridValue.attendanceCheckIn : ''
	};
	if (gridValue.attendanceCheckOut && gridValue.attendanceCheckIn) {
		if (dateCompare(gridValue.attendanceCheckIn, gridValue.attendanceCheckOut)) {
			if (contextVar.submitType == 'endTask') {
				if (contextVar.submitTaskTime) {
					obj.checkOutTime = contextVar.submitTaskTime;
				}
			}
			if (contextVar.submitType == 'submitTaskProgress' || contextVar.submitType == 'checkOut') {
				if (contextVar.checkOutCheckBoxForSubmitCapturedTime) {
					obj.checkOutTime = contextVar.checkOutCheckBoxForSubmitCapturedTime;
				}
			}
		} else {
			obj.checkOutTime = gridValue.attendanceCheckOut;
		}
	} else {
		if (gridValue.attendanceCheckIn) {
			if (contextVar.submitType == 'endTask') {
				if (contextVar.submitTaskTime) {
					obj.checkOutTime = contextVar.submitTaskTime;
				}
			}
			if (contextVar.submitType == 'submitTaskProgress' || contextVar.submitType == 'checkOut') {
				if (contextVar.checkOutCheckBoxForSubmitCapturedTime) {
					obj.checkOutTime = contextVar.checkOutCheckBoxForSubmitCapturedTime;
					if (!(contextVar.crewMobileAccess == 'noAccess' && contextVar.checkOutCheckBoxForSubmit)) {
						obj.checkOutTime = '';
					}
				}
			}
		}
	}
	if (gridValue.manualCheckIn) {
		obj['manualCheckIn'] = gridValue.manualCheckIn;
	}
	if (gridValue.crewRole) {
		obj['crewRole'] = gridValue.crewRole;
	}
	if (gridValue.notes) {
		obj['notes'] = gridValue.notes;
	}
	if (gridValue.photo) {
		obj['photo'] = gridValue.photo;
	}
	if (gridValue.reason) {
		obj['reason'] = gridValue.reason;
	}
	if (contextVar.newSiteAddress && contextVar.newSiteAddress.address && contextVar.submitType == 'checkIn') {
		obj['siteChangeAddress'] = contextVar.newSiteAddress.address;
	} else {
		obj['siteChangeAddress'] = contextVar.newSiteAddressText;
	}
	if (gridValue.siteChangeLatLong) {
		obj['siteChangeLatLong'] = gridValue.siteChangeLatLong;
	}
	if (contextVar.crewMobileAccess == 'noAccess' || contextVar.crewMobileAccess == 'partialAccess') {
		if (Array.isArray(contextVar.leadDetails)) {
			obj['leadDetails'] = contextVar.leadDetails;
		}
		obj['crewLead'] = gridValue.workforceCrewWorkforceUserId === contextVar.leadUserId ? true : false;
		obj['crewId'] = (checkIfArray(contextVar.crewAttendanceDetailsDataGrid) && contextVar.crewAttendanceDetailsDataGrid[0]) ? contextVar.crewAttendanceDetailsDataGrid[0].crewId : '';
		obj['crewName'] = (checkIfArray(contextVar.crewAttendanceDetailsDataGrid) && contextVar.crewAttendanceDetailsDataGrid[0]) ? contextVar.crewAttendanceDetailsDataGrid[0].crewName : contextVar.crewName;
	} else {
		obj['crewLead'] = false;
		obj['crewName'] = '-';
	}
	return obj;
}

function findElement(el, a) {
	if (typeof a === 'undefined' || a == '' || (!Array.isArray(a))) {
		return -1;
	}
	for (let i = 0; i < a.length; i++) {
		if (el == a[i].workforceUserId) {
			return i;
		}
	}
	return -1;
}

if (checkIfArray(contextVar.fetchCrewAttendanceData) && checkIfArray(contextVar.crewAttendanceDetailsDataGrid)) {
	contextVar.crewAttendanceDetailsDataGrid.forEach((obj, i) => {
		if (obj.attendanceCheckIn || obj.attendanceCheckOut) {
			let attObj = fillGridValues(obj);
			contextVar.fetchCrewAttendanceData.some((obj1, j) => {
				if (obj1.workforceUserId == obj.workforceCrewWorkforceUserId) {
					if (checkIfArray(obj1.attendance)) {
						let lastItem = obj1.attendance[obj1.attendance.length - 1];
						if (lastItem.checkOutTime && lastItem.checkOutTime !== '-') {
							if (obj.attendanceCheckIn && obj.attendanceCheckOut) {
								if (dateCompare(obj.attendanceCheckIn, obj.attendanceCheckOut)) {
									if (obj.attendanceCheckIn == lastItem.checkInTime) {
										obj1.attendance[obj1.attendance.length - 1].checkOutTime = '';
										if (contextVar.submitType == 'endTask') {
											obj1.attendance[obj1.attendance.length - 1].checkOutTime = attObj.checkOutTime;
										}
										if (contextVar.submitType == 'submitTaskProgress' || contextVar.submitType == 'checkOut') {
											obj1.attendance[obj1.attendance.length - 1].checkOutTime = contextVar.checkOutCheckBoxForSubmitCapturedTime;
										}
									} else {
										if (contextVar.submitType == 'endTask') {
											attObj.checkOutTime = attObj.checkOutTime;
										} else if (contextVar.submitType == 'submitTaskProgress' || contextVar.submitType == 'checkOut') {
											attObj.checkOutTime = contextVar.checkOutCheckBoxForSubmitCapturedTime;
										} else {
											attObj.checkOutTime = '';
										}
										obj1.attendance.push(attObj);
									}
								} else {
									if (obj.attendanceCheckIn == lastItem.checkInTime) {
										if (dateCompare(obj.attendanceCheckIn, attObj.checkOutTime)) {
											obj1.attendance[obj1.attendance.length - 1].checkOutTime = '';
										} else {
											obj1.attendance[obj1.attendance.length - 1].checkOutTime = attObj.checkOutTime ? attObj.checkOutTime : '';
										}
									} else {
										obj1.attendance.push(attObj);
									}
								}
							} else {
								if (obj.attendanceCheckIn == lastItem.checkInTime) {
									obj1.attendance[obj1.attendance.length - 1].checkOutTime = obj.attendanceCheckOut ? obj.attendanceCheckOut : attObj.checkOutTime ? attObj.checkOutTime : '';
								} else {
									obj1.attendance.push(attObj);
								}
							}
						} else {
							obj1.attendance[obj1.attendance.length - 1].checkOutTime = attObj.checkOutTime ? attObj.checkOutTime : obj.attendanceCheckOut ? obj.attendanceCheckOut : '';
						}
					} else {
						obj1.attendance = [];
						obj1.attendance.push(attObj);
					}
					return true;
				}
			});
			if (findElement(obj.workforceCrewWorkforceUserId, contextVar.fetchCrewAttendanceData) == -1) {
				let attendanceData = [];
				attendanceData.push(attObj);
				contextVar.fetchCrewAttendanceData.push({
					'attendance': attendanceData,
					'workforceUserId': contextVar.crewMobileAccess == 'partialAccess' ? contextVar.assignedToUserId : obj.workforceCrewWorkforceUserId,
					'workOrderTaskId': obj.workOrderTaskId
				});
			}
		}
	});
} else {
	contextVar.fetchCrewAttendanceData = [];
	if (checkIfArray(contextVar.crewAttendanceDetailsDataGrid)) {
		contextVar.fetchCrewAttendanceData = [];
		contextVar.crewAttendanceDetailsDataGrid.forEach((obj) => {
			if (obj.attendanceCheckIn || obj.attendanceCheckOut) {
				let attendanceData = [];
				let attObj = fillGridValues(obj);
				attendanceData.push(attObj);
				contextVar.fetchCrewAttendanceData.push({
					'attendance': attendanceData,
					'workforceUserId': contextVar.crewMobileAccess == 'partialAccess' ? contextVar.assignedToUserId : obj.workforceCrewWorkforceUserId,
					'workOrderTaskId': obj.workOrderTaskId
				});
			}
		});
	}
}

if (contextVar.crewMobileAccess == 'noAccess') {
	let obj = {};
	if (contextVar.submitType == 'endTask') {

		obj['checkOutTime'] = contextVar.submitTaskTime ? contextVar.submitTaskTime : new Date().toISOString().replace('T', ' ').replace('Z', '');

	}
	if (contextVar.submitType == 'submitTaskProgress' || contextVar.submitType == 'checkOut') {
		obj['checkOutTime'] = contextVar.checkOutCheckBoxForSubmitCapturedTime ? contextVar.checkOutCheckBoxForSubmitCapturedTime : new Date().toISOString().replace('T', ' ').replace('Z', '');

	}
	if (contextVar.statusId == 'workOrderTaskDiscontinued') {
		obj['checkOutTime'] = contextVar.reportIssueCapturedTime ? contextVar.reportIssueCapturedTime : new Date().toISOString().replace('T', ' ').replace('Z', '');
	}

	obj['checkInTime'] = contextVar.checkInTime ? contextVar.checkInTime : contextVar.endTravelDate ? contextVar.endTravelDate : '';

	if (contextVar.endTravelLocationCoordinates) {
		obj['siteChangeLatLong'] = contextVar.endTravelLocationCoordinates;
	}
	if (contextVar.newSiteAddress && contextVar.newSiteAddress.address && contextVar.submitType == 'checkIn') {
		obj['siteChangeAddress'] = contextVar.newSiteAddress.address;
	} else {
		obj['siteChangeAddress'] = contextVar.newSiteAddressText;
	}
	if (contextVar.reasonOfwrongSite) {
		obj['reason'] = contextVar.reasonOfwrongSite;
	}
	if (contextVar.newLocationPhoto) {
		obj['photo'] = contextVar.newLocationPhoto;
	}
	if (contextVar.incorrectSiteComments) {
		obj['notes'] = contextVar.incorrectSiteComments;
	}
	if (contextVar.incorrectAddress) {
		obj['manualCheckIn'] = contextVar.incorrectAddress;
	}
	obj['crewLead'] = true;

	obj['crewName'] = (checkIfArray(contextVar.crewAttendanceDetailsDataGrid) && contextVar.crewAttendanceDetailsDataGrid[0]) ? contextVar.crewAttendanceDetailsDataGrid[0].crewName : contextVar.crewName;
	obj['crewId'] = (checkIfArray(contextVar.crewAttendanceDetailsDataGrid) && contextVar.crewAttendanceDetailsDataGrid[0]) ? contextVar.crewAttendanceDetailsDataGrid[0].crewId : contextVar.crewId;
	if (Array.isArray(contextVar.leadDetails)) {
		obj['leadDetails'] = contextVar.leadDetails;
	}
	var attendanceObj = [];
	let crewLeadId = (checkIfArray(contextVar.crewAttendanceDetailsList) && contextVar.crewAttendanceDetailsList[0]) ? contextVar.crewAttendanceDetailsList[0].leadUserId : contextVar.leadUserId ? contextVar.leadUserId : contextVar.assignedToUserId;
	var index = -1;
	index = findElement(crewLeadId, contextVar.fetchCrewAttendanceData);
	if (index !== -1) {
		attendanceObj = contextVar.fetchCrewAttendanceData[index].attendance;
		if (obj.checkInTime || obj.checkOutTime) {
			let lastItem = (Array.isArray(attendanceObj) && attendanceObj.length > 0) ? attendanceObj[attendanceObj.length - 1] : {};
			if (lastItem.checkOutTime) {
				if (lastItem.checkInTime == obj.checkInTime) {
					attendanceObj[attendanceObj.length - 1].checkOutTime = obj.checkOutTime;
				} else {
					attendanceObj.push(obj);
				}
			} else {
				if (obj.checkInTime && obj.checkOutTime) {
					if (obj.checkInTime == lastItem.checkInTime) {
						attendanceObj[attendanceObj.length - 1].checkOutTime = obj.checkOutTime;
					} else {
						attendanceObj.push(obj);
					}
				} else {
					if (obj.checkInTime == lastItem.checkInTime) {
						attendanceObj[attendanceObj.length - 1].checkOutTime = obj.checkOutTime;
					} else {
						if (lastItem.checkInTime && (typeof lastItem.checkOutTime == 'undefined' || lastItem.checkOutTime == '') && (typeof obj.checkInTime == 'undefined' || obj.checkInTime == '') && obj.checkOutTime) {
							attendanceObj[attendanceObj.length - 1].checkOutTime = obj.checkOutTime;
						} else {
							attendanceObj.push(obj);
						}
					}
				}
			}
		}
	} else {
		if (obj.checkInTime || obj.checkOutTime) {
			attendanceObj.push(obj);
		}
	}
	var crewLeadObj = {};
	crewLeadObj = {
		'workOrderTaskId': contextVar.workOrderTaskId,
		'workforceUserId': crewLeadId,
		'crewMemberName': contextVar.userName,
		'attendance': attendanceObj
	};
	if (index !== -1) {
		contextVar.fetchCrewAttendanceData[index].attendance = attendanceObj;
	} else {
		contextVar.fetchCrewAttendanceData.push(crewLeadObj);
	}
}