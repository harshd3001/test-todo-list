{
 	if (Array.isArray(contextVar.entityConfigData)) {
 		for (let value of contextVar.entityConfigData) {
 			if (value.configKey === 'configurations') {
 				value.configValue = JSON.parse(value.configValue);
 				for (let key in value.configValue) {
 					contextVar[key] = value.configValue[key];
 				}
 			}
 			if (value.configKey === 'googleApiKey') {
 				contextVar.customerResponseData.googleApiKey = value.configValue;
 			}
 		}
 	}
 	contextVar.currentOrderStatus = contextVar.orderStatusData[0].statusId;
 	var zonePresent = false;
 	if (typeof contextVar.zones != 'undefined' && Object.keys(contextVar.zones).length) {
 		for (let key in contextVar.zones) {
 			let fields = contextVar.zones[key].fields;
 			for (let ele of fields) {
 				if (ele.component != 'text') {
 					zonePresent = true;
 					break;
 				}
 			}
 			break;
 		}
 	}
 	contextVar.customerResponseData.confirmAllowed = (typeof contextVar.confirmationNeededInPortal != 'undefined' && contextVar.confirmationNeededInPortal && (contextVar.currentOrderStatus == 'fscx2_0_userBookingUnconfirmed' || contextVar.currentOrderStatus == 'fscx2_0_additionalInformationSubmitted')) ? true : false;
 	if (contextVar.confirmationNeededInPortal && zonePresent) {
 		contextVar.customerResponseData.steps.splice(1, 0, {
 			'eventType': 'userAdditionalInfoSubmitted',
 			'title': 'Additional Information',
 			'isActive': false,
 			'isComplete': false
 		}, {
 			'eventType': 'userBookingConfirmed',
 			'title': 'Confirm Booking',
 			'isActive': false,
 			'isComplete': false
 		});
 	} else if (zonePresent && !contextVar.confirmationNeededInPortal) {
 		contextVar.customerResponseData.steps.splice(1, 0, {
 			'eventType': 'userAdditionalInfoSubmitted',
 			'title': 'Additional Information',
 			'isActive': false,
 			'isComplete': false
 		});
 	} else if (contextVar.confirmationNeededInPortal && !zonePresent) {
 		contextVar.customerResponseData.steps.splice(1, 0, {
 			'eventType': 'userBookingConfirmed',
 			'title': 'Confirm Booking',
 			'isActive': false,
 			'isComplete': false
 		});
 	}
 	if (typeof contextVar.workOrderTaskData !== 'undefined' && contextVar.workOrderTaskData !== '' && contextVar.workOrderTaskData.toString() !== '{}') {
 		if (contextVar.rank[contextVar.workOrderTaskData.workOrderTaskStatusId] <= 35) {
 			contextVar.customerResponseData.rescheduleAllowed = true;
 			if (contextVar.reschedulingTimeLimit) {
 				let currentDateForReschedule = new Date();
 				currentDateForReschedule.setHours(currentDateForReschedule.getHours() + Number(contextVar.reschedulingTimeLimit));
 				if (new Date(contextVar.workOrderTaskData.workOrderTaskAppointmentWindowStartDate) <= new Date(currentDateForReschedule)) {
 					contextVar.customerResponseData.rescheduleAllowed = false;
 				}
 			}
 			contextVar.customerResponseData.cancelAlowed = true;
 			if (contextVar.cancelTimeLimit) {
 				let currentDateForCancel = new Date();
 				currentDateForCancel.setHours(currentDateForCancel.getHours() + Number(contextVar.cancelTimeLimit));
 				if (new Date(contextVar.workOrderTaskData.workOrderTaskAppointmentWindowStartDate) <= new Date(currentDateForCancel)) {
 					contextVar.customerResponseData.cancelAlowed = false;
 				}
 			}
 		}
 		if (contextVar.rank[contextVar.workOrderTaskData.workOrderTaskStatusId] >= 35 && contextVar.rank[contextVar.workOrderTaskData.workOrderTaskStatusId] != 60) {
 			contextVar.customerResponseData.mapAllowed = true;
 		}
 		contextVar.customerResponseData.appointmentDetails.startTimeInUTC = contextVar.workOrderTaskData[contextVar.customerResponseData.appointmentDetails.startTimeInUTC] ? contextVar.workOrderTaskData[contextVar.customerResponseData.appointmentDetails.startTimeInUTC].replace(' ', 'T') + 'Z' : '';
 		contextVar.customerResponseData.appointmentDetails.endTimeInUTC = contextVar.workOrderTaskData[contextVar.customerResponseData.appointmentDetails.endTimeInUTC] ? contextVar.workOrderTaskData[contextVar.customerResponseData.appointmentDetails.endTimeInUTC].replace(' ', 'T') + 'Z' : '';
 		contextVar.customerResponseData.appointmentDetails.appointmentWindowId = contextVar.workOrderTaskData[contextVar.customerResponseData.appointmentDetails.appointmentWindowId];
 		let date = new String(contextVar.workOrderTaskData.workOrderTaskAppointmentWindowStartDate);
 		date = date.split(' ')[0];
 		contextVar.customerResponseData.appointmentDetails.appointmentDate = date;
 		contextVar.customerResponseData.appointmentDetails.confirmationNumber = contextVar.confirmationNumber;
 		contextVar.customerResponseData.appointmentDetails.fileNumber = contextVar.fileNumber;
 		contextVar.customerResponseData.appointmentDetails.service = contextVar.workOrderTaskData[contextVar.customerResponseData.appointmentDetails.service];
 		contextVar.customerResponseData.appointmentDetails.address = contextVar.workOrderTaskData[contextVar.customerResponseData.appointmentDetails.address];
 		contextVar.customerResponseData.mapDetails.bookingLocation.lat = contextVar.workOrderTaskData.siteLatitude;
 		contextVar.customerResponseData.mapDetails.bookingLocation.lng = contextVar.workOrderTaskData.siteLongitude;
 	}
 	if (Array.isArray(contextVar.userLocationLogData) && contextVar.userLocationLogData.length > 0) {
 		contextVar.customerResponseData.mapDetails.technicianLocation.lat = contextVar.userLocationLogData[0].latitude;
 		contextVar.customerResponseData.mapDetails.technicianLocation.lng = contextVar.userLocationLogData[0].longitude;
 	}
 	if (Array.isArray(contextVar.workOrderTaskLogData) && contextVar.workOrderTaskLogData.length > 0) {
 		let objMap = {};
 		for (let value of contextVar.workOrderTaskLogData) {
 			if (typeof objMap[value.event] === 'undefined' || objMap[value.event] === '') {
 				objMap[value.event] = value.logDate;
 			}
 		}
 		if (typeof objMap['workOrderTaskScheduled'] == 'undefined' && typeof objMap['workOrderTaskDispatched'] != 'undefined') {
 			objMap['workOrderTaskScheduled'] = objMap['workOrderTaskDispatched'];
 		}
 		if (contextVar.currentOrderStatus == 'fscx2_0_userBookingConfirmed' && contextVar.confirmationNeededInPortal) {
 			objMap['userBookingConfirmed'] = contextVar.orderStatusData[0].modifiedDate;
 		}
 		if (zonePresent) {
 			for (let key in contextVar.zones) {
 				contextVar.zones[key].isUserAdditionalInfoSubmitted = false;
 			}
 		}
 		if (zonePresent && (contextVar.currentOrderStatus == 'fscx2_0_additionalInformationSubmitted' || contextVar.currentOrderStatus == 'fscx2_0_userBookingConfirmed' || contextVar.currentOrderStatus == 'fscx2_0_userBookingUnconfirmed')) {
 			objMap['userAdditionalInfoSubmitted'] = contextVar.orderStatusData[0].modifiedDate;
 			contextVar.additionalInfoData = contextVar.orderStatusData[0].zones ? contextVar.orderStatusData[0].zones : {};
 			if (Object.keys(contextVar.additionalInfoData).length) {
 				for (let key in contextVar.additionalInfoData) {
 					contextVar.additionalInfoData[key]['isUserAdditionalInfoSubmitted'] = true;
 					contextVar.zones[key] = contextVar.additionalInfoData[key];
 				}
 			}
 		}
 		let index = 0;
 		for (const iterator of contextVar.customerResponseData.steps) {
 			if (objMap[iterator.eventType]) {
 				iterator.subTitle = objMap[iterator.eventType] ? objMap[iterator.eventType].replace(' ', 'T') + 'Z' : undefined;
 				iterator.isActive = false;
 				iterator.isComplete = true;
 				if (contextVar.customerResponseData.steps[index + 1]) {
 					contextVar.customerResponseData.steps[index + 1].isActive = true;
 					if (typeof objMap[contextVar.customerResponseData.steps[index + 1].eventType] === 'undefined') break;
 				}
 				index++;
 			}
 		}
 	}
 	if (Array.isArray(contextVar.siteData)) {
 		for (let key in contextVar.siteData[0]) {
 			contextVar[key] = contextVar.siteData[0][key];
 		}
 	}
 	if (contextVar.helpLine) {
 		contextVar.customerResponseData.helpLine = contextVar.helpLine;
 	}
 	contextVar.customerResponseData.labels = contextVar.labels ? contextVar.labels : {};
 	if (contextVar.hideService) {
 		delete contextVar.customerResponseData.appointmentDetails.service;
 	}
 	contextVar.customerResponseData.hideService = contextVar.hideService ? contextVar.hideService : false;
 	if (zonePresent) {
 		contextVar.customerResponseData.zones = contextVar.zones;
 	}
 	if (contextVar.cancelAllowedInPortal) {
 		contextVar.customerResponseData.cancelAllowedInPortal = contextVar.cancelAllowedInPortal;
 	}
 	if (contextVar.brandingParams) {
 		contextVar.customerResponseData.brandingParams = contextVar.brandingParams;
 	}
 	if (contextVar.workOrderTaskData.workOrderTaskStatusId === 'workOrderTaskCancelled') {
 		contextVar.customerResponseData.responseTitle = 'Appointment Booking Cancelled';
 		contextVar.customerResponseData.responseMessage = 'The appointment has been cancelled. Please reach out to representative for further information.'
 	} else {
 		contextVar.customerResponseData.status = true;
 		contextVar.customerResponseData.responseTitle = 'SUCCESS';
 	}
 }