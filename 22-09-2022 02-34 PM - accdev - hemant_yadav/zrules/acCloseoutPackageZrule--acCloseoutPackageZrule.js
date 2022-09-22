function formatDate(date) {
	if (date) {
		var d = new Date(new Date(date).getTime() - contextVar.workOrderData[0].siteTimeZone * 60 * 1000);
		return (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + '-' + (parseInt(d.getMonth() + 1) < 10 ? '0' + parseInt(d.getMonth() + 1) : parseInt(d.getMonth() + 1)) + '-' + d.getFullYear() + ' ' + (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + ':' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + ':00.000';
		d = new Date(new Date(d + ' UTC').toLocaleString('en-us', {
			timeZone: contextVar.timeZone
		})), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
		var hours = d.getHours().toString();
		var minutes = d.getMinutes().toString();
		var seconds = d.getSeconds().toString();
		var timeZone = new Date().toString().split(' ')[5];
		if (minutes.length < 2) minutes = '0' + minutes;
		if (hours.length < 2) hours = '0' + hours;
		if (seconds.length < 2) seconds = '0' + seconds;
		time = hours + ':' + minutes + ':' + seconds;
		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;
		date = ([day, month, year].join('-') + ' ' + time);
	} else {
		return '-';
	}
}


function formatDateString(date) {
	if (date) {
		const weekDayFormat = { weekday: 'long' };
		const dayFormat = { day: 'numeric' };
		const monthFormat = { month: 'short' };
		const yearFormat = { year: 'numeric' };
		let locale = 'en-us';
		var today = new Date(new Date(date + ' UTC').toLocaleString(locale, {
			timeZone: contextVar.timeZone
		}));
		var dd = today.toLocaleString(locale, dayFormat);
		var mm = today.toLocaleString(locale, monthFormat);
		var yyyy = today.toLocaleString(locale, yearFormat);
		return dd + mm + yyyy;

	}
	else {
		return '-';
	}

}


function arrayCheck(a) {
	return (typeof a !== 'undefined' && Array.isArray(a) && a.length > 0);
}

function checkForData(a) {
	return (typeof a !== 'undefined' && a !== '');
}

contextVar.initialEvidenceAllString = '';
contextVar.initialEvidenceBodyString = '';
contextVar.initialEvidenceHeader = '';
contextVar.progressEvidenceAllString = '';
contextVar.progressEvidenceBodyString = '';
contextVar.progressEvidenceHeader = '';
contextVar.servicesTableAllContents = '';
contextVar.servicesEvidenceHeader = '';
contextVar.finalEvidenceAllString = '';
contextVar.servicesOverviewAllString = '';
contextVar.servicesTableOverviewContents = '';
contextVar.serviceDetailsAllString = '';
contextVar.serviceDetailsAllString1 = '';
contextVar.materialsOverviewAllString = '';
contextVar.materialsOverviewAllString1 = '';
contextVar.materialsOverviewAllString2 = '';
contextVar.materialsOverviewAllString3 = '';
contextVar.materialsTableOverviewContents = '';
contextVar.materialsTableOverviewContents1 = '';
contextVar.materialsTableOverviewContents2 = '';
contextVar.materialsTableOverviewContents3 = '';
contextVar.materialsDetailsTableContents = '';
contextVar.materialsDetailsTableContents1 = '';
contextVar.materialsDetailsTableContents2 = '';
contextVar.finalEvidenceBodyString = '';
contextVar.finalEvidenceHeader = '';
contextVar.taskLog = [];
contextVar.finalTaskResult = [];
contextVar.previousDate = '';
contextVar.allString = '';
contextVar.customerSignatureString = '';
contextVar.workOrderTaskResultLength = '';
contextVar.workOrderTaskResultLengthForSubmitProgress = '';

contextVar.initialEvidenceKey = 1;
contextVar.progressEvidenceKey = 1;
contextVar.serviceEvidenceKey = 1;
contextVar.finalEvidenceKey = 1;
contextVar.materialEvidenceKey = 1;

var appendTaskdetails = new String(contextVar.taskDetailsTemplate);
if (arrayCheck(contextVar.loopThroughTasksList_currentElement.workOrderTaskResult)) {
	if (contextVar.loopThroughTasksList_currentElement.workOrderTaskResult.length - 1 >= 0) {
		contextVar.workOrderTaskResultLength = contextVar.loopThroughTasksList_currentElement.workOrderTaskResult[contextVar.loopThroughTasksList_currentElement.workOrderTaskResult.length - 1];
	} else {
		contextVar.workOrderTaskResultLength = '-';
	}
	if (contextVar.loopThroughTasksList_currentElement.workOrderTaskResult.length - 2 >= 0) {
		contextVar.workOrderTaskResultLengthForSubmitProgress = contextVar.loopThroughTasksList_currentElement.workOrderTaskResult[contextVar.loopThroughTasksList_currentElement.workOrderTaskResult.length - 2];
	} else {
		contextVar.workOrderTaskResultLengthForSubmitProgress = '-';
	}
} else {
	contextVar.workOrderTaskResultLength = '-';
	contextVar.workOrderTaskResultLengthForSubmitProgress = '-';
}
appendTaskdetails = appendTaskdetails.replace('TASKID', contextVar.loopThroughTasksList_currentElement.taskId);
appendTaskdetails = appendTaskdetails.replace('TASKTYPE', contextVar.loopThroughTasksList_currentElement.taskType);
appendTaskdetails = appendTaskdetails.replace('ASSIGNEE', contextVar.loopThroughTasksList_currentElement.technicianName);
appendTaskdetails = appendTaskdetails.replace('STARTDATE', formatDate(contextVar.loopThroughTasksList_currentElement.scheduledDate));
appendTaskdetails = appendTaskdetails.replace('ENDDATE', formatDate(contextVar.loopThroughTasksList_currentElement.endDate));
appendTaskdetails = appendTaskdetails.replace('CUSTOMERSITE', contextVar.loopThroughTasksList_currentElement.siteId);
appendTaskdetails = appendTaskdetails.replace('CUSTOMERADDRESS', (contextVar.loopThroughTasksList_currentElement.siteDetails && contextVar.loopThroughTasksList_currentElement.siteDetails[0].originalAddress) ? contextVar.loopThroughTasksList_currentElement.siteDetails[0].originalAddress : contextVar.loopThroughTasksList_currentElement.siteAddress);
appendTaskdetails = appendTaskdetails.replace('UPDATEDADDRESS', (contextVar.loopThroughTasksList_currentElement.siteDetails && contextVar.loopThroughTasksList_currentElement.siteDetails[0].updatedAddress) ? contextVar.loopThroughTasksList_currentElement.siteDetails[0].updatedAddress : '-');

if (contextVar.loopThroughTasksList_currentElement.workOrderTaskNotes) {
	appendTaskdetails = appendTaskdetails.replace('NOTES', contextVar.loopThroughTasksList_currentElement.workOrderTaskNotes);
} else {
	appendTaskdetails = appendTaskdetails.replace('NOTES', '-');
}
contextVar.allString = contextVar.allString + appendTaskdetails;

if (arrayCheck(contextVar.loopThroughTasksList_currentElement.workOrderTaskResult)) {

	var workOrderTaskResultLength = contextVar.loopThroughTasksList_currentElement.workOrderTaskResult.length;
	contextVar.loopThroughTasksList_currentElement.workOrderTaskResult.forEach(function (element, index) {
		contextVar.initialEvidenceBodyString = '';
		contextVar.progressEvidenceBodyString = '';
		contextVar.servicesTableAllContents = '';
		contextVar.finalEvidenceBodyString = '';
		var tasksobj = {};
		if (element.initialEvidenceDataGrid && Array.isArray(element.initialEvidenceDataGrid)) {
			tasksobj['initialEvidenceCount'] = element.initialEvidenceDataGrid.length;
		} else {
			tasksobj['initialEvidenceCount'] = '-';
		}
		if (element.servicesDataGrid && Array.isArray(element.servicesDataGrid)) {
			tasksobj['servicesCount'] = element.servicesDataGrid.length;
		} else {
			tasksobj['servicesCount'] = '-';
		}
		if (element.finalEvidenceDataGrid && Array.isArray(element.finalEvidenceDataGrid)) {
			tasksobj['finalEvidenceCount'] = element.finalEvidenceDataGrid.length;
		} else {
			tasksobj['finalEvidenceCount'] = '-';
		}
		if (element.submitProgressEvidenceDataGrid && Array.isArray(element.submitProgressEvidenceDataGrid)) {
			tasksobj['isProgressReport'] = 'Yes';
		} else {
			tasksobj['isProgressReport'] = 'No';
		}
		if (element.SubmittedDate) {
			tasksobj['date'] = element.SubmittedDate.split('.')[0];
		}
		if (element.userName) {
			tasksobj['userName'] = element.userName;
		}

		contextVar.taskLog.push(tasksobj);

		contextVar.currentDate = new Date(element.SubmittedDate);

		for (var i = 0; i < contextVar.packageData.length; i++) {

			//Initial Evidences Section
			if (contextVar.packageData[i].id == 'initialEvidence') {
				if (element.initialEvidenceDataGrid && element.initialEvidenceDataGrid.length > 0) {
					contextVar.initialEvidenceHeader = contextVar.initialEvidenceHeaderText;
					if (contextVar.fileType == 'Closeout Package PDF') {
						if (element.SubmittedDate && (contextVar.previousDate == '' || contextVar.initialEvidenceAllString == '' || (contextVar.previousDate != '' && contextVar.previousDate.getDate() != contextVar.currentDate.getDate()))) {
							contextVar.initialEvidenceAllString = contextVar.initialEvidenceAllString + (contextVar.dateString.replace('DATE', element.SubmittedDate.split(' ')[0]));
						}
						if (element.initialEvidenceDataGrid && Array.isArray(element.initialEvidenceDataGrid)) {
							var initialEvidencePhotoCount = 0;
							element.initialEvidenceDataGrid.forEach(function (initialEvidenceElement, i) {
								initialEvidencePhotoCount++;
								var appendString = new String(contextVar.initialEvidenceString);
								appendString = appendString.replace('INITIALEVIDENCEPHOTO', initialEvidenceElement.initialEvidence ? initialEvidenceElement.initialEvidence : '-');
								var photoCountString = 'Photo Evidence' + ' ' + (i + 1);
								appendString = appendString.replace('PHOTOTYPE', photoCountString);
								appendString = appendString.replace('CAPTUREDON', formatDate(initialEvidenceElement.initialEvidenceCapturedTime));
								appendString = appendString.replace('ASSIGNEE', element.userName);
								appendString = appendString.replace('INITIALPHOTOCOMMENTS', initialEvidenceElement.initialEvidenceNotes ? initialEvidenceElement.initialEvidenceNotes : '-');
								if (initialEvidencePhotoCount % 3 == 0) {
									contextVar.initialEvidenceBodyString = contextVar.initialEvidenceBodyString + appendString + '<br>';
								} else {
									contextVar.initialEvidenceBodyString = contextVar.initialEvidenceBodyString + appendString;
								}
							});
						}
						var appendComments = new String(contextVar.initialEvidenceCommentsString);
						appendComments = appendComments.replace('OVERALLCOMMENTS', element.initialComments ? contextVar.workOrderTaskResultLength.initialComments : '-');
						contextVar.initialEvidenceBodyString = contextVar.initialEvidenceBodyString + appendComments;
						contextVar.initialEvidenceBodyString = contextVar.headerForPhotos + contextVar.initialEvidenceBodyString + contextVar.footerForPhotos;
						contextVar.initialEvidenceAllString = contextVar.initialEvidenceAllString + contextVar.initialEvidenceBodyString + contextVar.footerString;
					} else {
						if (arrayCheck(element.initialEvidenceDataGrid)) {
							element.initialEvidenceDataGrid.forEach(function (initialEvidenceElement) {
								let photoName = contextVar.loopThroughTasksList_currentElement.taskId + "_initialEvidence_" + formatDateString(initialEvidenceElement.initialEvidenceCapturedTime) + "_" + contextVar.initialEvidenceKey;
								contextVar.fileNameArray.push(photoName);
								contextVar.photosArray.push(initialEvidenceElement.initialEvidence);
								contextVar.initialEvidenceKey++;
							});
						}
					}
				}
			}

			//Task Progress Reports Section	
			if (contextVar.packageData[i].id == 'taskProgressReports') {
				if (element.submitProgressEvidenceDataGrid && element.submitProgressEvidenceDataGrid.length > 0) {
					if (contextVar.fileType == 'Closeout Package PDF') {
						contextVar.progressEvidenceHeader = contextVar.progressEvidenceHeaderText;
						if (element.SubmittedDate && (contextVar.previousDate == '' || contextVar.progressEvidenceAllString == '' || (contextVar.previousDate != '' && contextVar.previousDate.getDate() != contextVar.currentDate.getDate()))) {
							contextVar.progressEvidenceAllString = contextVar.progressEvidenceAllString + (contextVar.dateString.replace('DATE', element.SubmittedDate.split(' ')[0]));
						}
						if (element.submitProgressEvidenceDataGrid && Array.isArray(element.submitProgressEvidenceDataGrid)) {
							var progressEvidencePhotoCount = 0;
							element.submitProgressEvidenceDataGrid.forEach(function (progressEvidenceElement, i) {
								progressEvidencePhotoCount++;
								var appendString = new String(contextVar.progressEvidenceString);
								appendString = appendString.replace('PROGRESSEVIDENCEPHOTO', progressEvidenceElement.finalEvidence ? progressEvidenceElement.finalEvidence : '-');
								var photoCountString = 'Photo Evidence' + ' ' + (i + 1);
								appendString = appendString.replace('PHOTOTYPE', photoCountString);
								appendString = appendString.replace('CAPTUREDON', formatDate(progressEvidenceElement.finalEvidenceCapturedTime));
								appendString = appendString.replace('ASSIGNEE', element.userName);
								appendString = appendString.replace('PROGRESSPHOTOCOMMENTS', progressEvidenceElement.finalEvidenceNotes ? progressEvidenceElement.finalEvidenceNotes : '-');
								if (progressEvidencePhotoCount % 3 == 0) {
									contextVar.progressEvidenceBodyString = contextVar.progressEvidenceBodyString + appendString + '<br>';
								} else {
									contextVar.progressEvidenceBodyString = contextVar.progressEvidenceBodyString + appendString;
								}
							});

						}
						var appendComments = new String(contextVar.progressEvidenceCommentsString);
						appendComments = appendComments.replace('OVERALLCOMMENTS', element.submitProgressComments ? contextVar.workOrderTaskResultLengthForSubmitProgress.submitProgressComments : '-');
						contextVar.progressEvidenceBodyString = contextVar.progressEvidenceBodyString + appendComments;
						contextVar.progressEvidenceBodyString = contextVar.headerForPhotos + contextVar.progressEvidenceBodyString + contextVar.footerForPhotos;
						contextVar.progressEvidenceAllString = contextVar.progressEvidenceAllString + contextVar.progressEvidenceBodyString + contextVar.footerString;
					} else {
						if (arrayCheck(element.submitProgressEvidenceDataGrid)) {
							element.submitProgressEvidenceDataGrid.forEach(function (progressEvidenceElement) {
								let photoName = contextVar.loopThroughTasksList_currentElement.taskId + "_progressEvidence_" + formatDateString(progressEvidenceElement.finalEvidenceCapturedTime) + "_" + contextVar.progressEvidenceKey;
								contextVar.fileNameArray.push(photoName);
								contextVar.photosArray.push(progressEvidenceElement.finalEvidence);
								contextVar.progressEvidenceKey++;
							});
						}
					}
				}
			}

			/*
			*	Elements in last index of workOrderTaskResult, 
			*	New Service Details
			*/
			if (contextVar.packageData[i].id == 'servicesDelivered') {
				if (Number(index) === Number(workOrderTaskResultLength - 1)) {
					if (arrayCheck(element.serviceGridWrapper)) {
						if (contextVar.fileType == 'Closeout Package PDF') {

							element.serviceGridWrapper.forEach(function (serviceElement) {
								//Services Overview Start
								var appendString = new String(contextVar.serviceOverviewTableContents);
								appendString = appendString.replace('COMPLETEDON', formatDate(serviceElement.addedOn) ? formatDate(serviceElement.addedOn) :'-' );
								if(serviceElement.selectedService !== '' && typeof serviceElement.selectedService !== 'undefined' && serviceElement.selectedService.length > 0 ){
								    serviceElement.selectedService.forEach(function(selectedServiceElement){
								        appendString = appendString.replace('SERVICETYPE', selectedServiceElement.serviceName ? selectedServiceElement.serviceName : '-');
								        
								    })
								
								}
								appendString = appendString.replace('SUBMITTEDBY', serviceElement.addedBy ? serviceElement.addedBy : '-');
                            
								contextVar.servicesTableOverviewContents = contextVar.servicesTableOverviewContents + appendString;

								//Services Overview End

								//Services Details Start
								//Generic Section
								var appendDetailsString = new String(contextVar.serviceDetailsTableHeader);
								appendDetailsString = contextVar.zTableHeaderWithLogo + contextVar.blankString + appendDetailsString;
								appendDetailsString = appendDetailsString.replace('ADDEDON', formatDate(serviceElement.addedOn) ? serviceElement.addedOn: '-');
								appendDetailsString = appendDetailsString.replace('SERVICETYPE', serviceElement.selectedService.serviceName ? serviceElement.selectedService.serviceName:'-');
								appendDetailsString = appendDetailsString.replace('ADDEDBY', serviceElement.addedBy);
								appendDetailsString = appendDetailsString.replace('SERVICEMODE', serviceElement.serviceMode);

								var appendReasonString = '';
								if (serviceElement.serviceMode === 'assetRemoval' || serviceElement.serviceMode === 'assetReplacement') {
									appendReasonString = new String(contextVar.serviceDetailsRemovalReason);
									appendReasonString = appendReasonString.replace('REMOVALREASON', serviceElement[serviceElement.serviceMode].removed.removalReason);
								}
								else {
									appendReasonString = '';
								}
								appendDetailsString = appendDetailsString + appendReasonString + contextVar.serviceDetailsTableFooter + contextVar.blankSeparatorTableString;

								var appendActionDetailsString = '';
								switch (serviceElement.serviceMode) {

									//Install Section
									case 'assetInstallation':
										appendActionDetailsString = new String(contextVar.assetInstallationService);
										appendActionDetailsString = appendActionDetailsString.replace('MANUFACTURER', checkForData(serviceElement[serviceElement.serviceMode].installed.manufacturer) ? serviceElement[serviceElement.serviceMode].installed.manufacturer : '-');
										appendActionDetailsString = appendActionDetailsString.replace('MODELNAME', checkForData(serviceElement[serviceElement.serviceMode].installed.modelName) ? serviceElement[serviceElement.serviceMode].installed.modelName : '-');
										appendActionDetailsString = appendActionDetailsString.replace('MODELNUMBER', checkForData(serviceElement[serviceElement.serviceMode].installed.modelNumber) ? serviceElement[serviceElement.serviceMode].installed.modelNumber : '-');
										appendActionDetailsString = appendActionDetailsString.replace('CATEGORY', checkForData(serviceElement[serviceElement.serviceMode].installed.category) ? serviceElement[serviceElement.serviceMode].installed.category : '-');
										appendActionDetailsString = appendActionDetailsString.replace('SERIALNUMBER', checkForData(serviceElement[serviceElement.serviceMode].installed.serialNumber) ? serviceElement[serviceElement.serviceMode].installed.serialNumber : '-');
										appendActionDetailsString = appendActionDetailsString.replace('SERIALNUMBERPHOTO', checkForData(serviceElement[serviceElement.serviceMode].installed.photoOfSerialNum) ? serviceElement[serviceElement.serviceMode].installed.photoOfSerialNum : '-');
										appendDetailsString = appendDetailsString + contextVar.blankString + contextVar.blankString + appendActionDetailsString;
										break;

									//Replace Section
									case 'assetReplacement':
										appendActionDetailsString = new String(contextVar.assetRemovalService);
										appendActionDetailsString = appendActionDetailsString.replace('MANUFACTURER', checkForData(serviceElement[serviceElement.serviceMode].removed.manufacturer) ? serviceElement[serviceElement.serviceMode].removed.manufacturer : '-');
										appendActionDetailsString = appendActionDetailsString.replace('MODELNAME', checkForData(serviceElement[serviceElement.serviceMode].removed.modelName) ? serviceElement[serviceElement.serviceMode].removed.modelName : '-');
										appendActionDetailsString = appendActionDetailsString.replace('MODELNUMBER', checkForData(serviceElement[serviceElement.serviceMode].removed.modelNumber) ? serviceElement[serviceElement.serviceMode].removed.modelNumber : '-');
										appendActionDetailsString = appendActionDetailsString.replace('CATEGORY', checkForData(serviceElement[serviceElement.serviceMode].removed.category) ? serviceElement[serviceElement.serviceMode].removed.category : '-');
										appendActionDetailsString = appendActionDetailsString.replace('SERIALNUMBER', checkForData(serviceElement[serviceElement.serviceMode].removed.serialNumber) ? serviceElement[serviceElement.serviceMode].removed.serialNumber : '-');

										appendDetailsString = appendDetailsString + contextVar.blankString + contextVar.blankString + appendActionDetailsString + contextVar.footerString;

										appendActionDetailsString = new String(contextVar.assetInstallationService);
										appendActionDetailsString = appendActionDetailsString.replace('MANUFACTURER', checkForData(serviceElement[serviceElement.serviceMode].installed.manufacturer) ? serviceElement[serviceElement.serviceMode].installed.manufacturer : '-');
										appendActionDetailsString = appendActionDetailsString.replace('MODELNAME', checkForData(serviceElement[serviceElement.serviceMode].installed.modelName) ? serviceElement[serviceElement.serviceMode].installed.modelName : '-');
										appendActionDetailsString = appendActionDetailsString.replace('MODELNUMBER', checkForData(serviceElement[serviceElement.serviceMode].installed.modelNumber) ? serviceElement[serviceElement.serviceMode].installed.modelNumber : '-');
										appendActionDetailsString = appendActionDetailsString.replace('CATEGORY', checkForData(serviceElement[serviceElement.serviceMode].installed.category) ? serviceElement[serviceElement.serviceMode].installed.category : '-');
										appendActionDetailsString = appendActionDetailsString.replace('SERIALNUMBER', checkForData(serviceElement[serviceElement.serviceMode].installed.serialNumber) ? serviceElement[serviceElement.serviceMode].installed.serialNumber : '-');
										appendActionDetailsString = appendActionDetailsString.replace('SERIALNUMBERPHOTO', checkForData(serviceElement[serviceElement.serviceMode].installed.photoOfSerialNum) ? serviceElement[serviceElement.serviceMode].installed.photoOfSerialNum : '-');

										appendDetailsString = appendDetailsString + contextVar.blankString + contextVar.blankString + appendActionDetailsString;

										break;

									//Removal Section
									case 'assetRemoval':
										appendActionDetailsString = new String(contextVar.assetRemovalService);
										appendActionDetailsString = appendActionDetailsString.replace('MANUFACTURER', checkForData(serviceElement[serviceElement.serviceMode].removed.manufacturer) ? serviceElement[serviceElement.serviceMode].removed.manufacturer : '-');
										appendActionDetailsString = appendActionDetailsString.replace('MODELNAME', checkForData(serviceElement[serviceElement.serviceMode].removed.modelName) ? serviceElement[serviceElement.serviceMode].removed.modelName : '-');
										appendActionDetailsString = appendActionDetailsString.replace('MODELNUMBER', checkForData(serviceElement[serviceElement.serviceMode].removed.modelNumber) ? serviceElement[serviceElement.serviceMode].removed.modelNumber : '-');
										appendActionDetailsString = appendActionDetailsString.replace('CATEGORY', checkForData(serviceElement[serviceElement.serviceMode].removed.category) ? serviceElement[serviceElement.serviceMode].removed.category : '-');
										appendActionDetailsString = appendActionDetailsString.replace('SERIALNUMBER', checkForData(serviceElement[serviceElement.serviceMode].removed.serialNumber) ? serviceElement[serviceElement.serviceMode].removed.serialNumber : '-');
										appendDetailsString = appendDetailsString + contextVar.blankString + contextVar.blankString + appendActionDetailsString;
										break;

									//Service Section
									case 'assetServicing': appendActionDetailsString = new String(contextVar.assetServicedService);
										appendActionDetailsString = appendActionDetailsString.replace('MANUFACTURER', checkForData(serviceElement[serviceElement.serviceMode].serviced.manufacturer) ? serviceElement[serviceElement.serviceMode].serviced.manufacturer : '-');
										appendActionDetailsString = appendActionDetailsString.replace('MODELNAME', checkForData(serviceElement[serviceElement.serviceMode].serviced.modelName) ? serviceElement[serviceElement.serviceMode].serviced.modelName : '-');
										appendActionDetailsString = appendActionDetailsString.replace('MODELNUMBER', checkForData(serviceElement[serviceElement.serviceMode].serviced.modelNumber) ? serviceElement[serviceElement.serviceMode].serviced.modelNumber : '-');
										appendActionDetailsString = appendActionDetailsString.replace('CATEGORY', checkForData(serviceElement[serviceElement.serviceMode].serviced.category) ? serviceElement[serviceElement.serviceMode].serviced.category : '-');
										appendActionDetailsString = appendActionDetailsString.replace('SERIALNUMBER', checkForData(serviceElement[serviceElement.serviceMode].serviced.serialNumber) ? serviceElement[serviceElement.serviceMode].serviced.serialNumber : '-');
										appendDetailsString = appendDetailsString + contextVar.blankString + contextVar.blankString + appendActionDetailsString;
										break;

									//Other Section
									
								};

								//Photos and Evidences Section
								contextVar.serviceDetailsPhotos = '';

								

								//contextVar.serviceDetailsAllString = contextVar.serviceDetailsAllString + appendDetailsString + contextVar.pageBreakFooter +  contextVar.serviceDetailsPhotos + contextVar.footerString;
								//Services Details End

								contextVar.servicesOverviewAllString = contextVar.zTableHeaderWithLogo + contextVar.servicesOverviewTableHeader + contextVar.servicesTableOverviewContents + contextVar.serviceOverviewTableFooter + contextVar.footerString;
							});
						}
				
					}

				}
			}

			//Final Evidences Section
			if (contextVar.packageData[i].id == 'finalEvidence') {
				if (arrayCheck(element.finalEvidenceDataGrid)) {
					if (contextVar.fileType == 'Closeout Package PDF') {
						contextVar.finalEvidenceHeader = contextVar.finalEvidenceHeaderText;
						if (element.SubmittedDate && (contextVar.previousDate == '' || contextVar.finalEvidenceAllString == '' || (contextVar.previousDate != '' && contextVar.previousDate.getDate() != contextVar.currentDate.getDate()))) {
							contextVar.finalEvidenceAllString = contextVar.finalEvidenceAllString + (contextVar.dateString.replace('DATE', element.SubmittedDate.split(' ')[0]));
						}
						finalEvidencePhotoCount = 0;
						element.finalEvidenceDataGrid.forEach(function (finalEvidenceElement, i) {
							finalEvidencePhotoCount++;
							var appendString = new String(contextVar.finalEvidenceString);
							appendString = appendString.replace('FINALEVIDENCEPHOTO', finalEvidenceElement.finalEvidence ? finalEvidenceElement.finalEvidence : '-');
							var photoCountString = 'Photo Evidence' + ' ' + (i + 1);
							appendString = appendString.replace('PHOTOTYPE', photoCountString);
							appendString = appendString.replace('CAPTUREDON', formatDate(finalEvidenceElement.finalEvidenceCapturedTime));
							appendString = appendString.replace('ASSIGNEE', element.userName);
							appendString = appendString.replace('FINALPHOTOCOMMENTS', finalEvidenceElement.finalEvidenceNotes ? finalEvidenceElement.finalEvidenceNotes : '-');
							if (finalEvidencePhotoCount % 3 == 0) {
								contextVar.finalEvidenceBodyString = contextVar.finalEvidenceBodyString + appendString + '<br>';
							} else {
								contextVar.finalEvidenceBodyString = contextVar.finalEvidenceBodyString + appendString;
							}

						});
						var appendComments = new String(contextVar.finalEvidenceCommentsString);
						appendComments = appendComments.replace('OVERALLCOMMENTS', element.finalComments ? element.finalComments : '-');
						contextVar.finalEvidenceBodyString = contextVar.finalEvidenceBodyString + appendComments;
						contextVar.finalEvidenceBodyString = contextVar.headerForPhotos + contextVar.finalEvidenceBodyString + contextVar.footerForPhotos;
						contextVar.finalEvidenceAllString = contextVar.finalEvidenceAllString + contextVar.finalEvidenceBodyString + contextVar.footerString;
					} else {
						if (element.finalEvidenceDataGrid && Array.isArray(element.finalEvidenceDataGrid) && element.finalEvidenceDataGrid.length > 0) {
							element.finalEvidenceDataGrid.forEach(function (finalEvidenceElement) {
								let photoName = contextVar.loopThroughTasksList_currentElement.taskId + "_finalEvidence_" + formatDateString(finalEvidenceElement.finalEvidenceCapturedTime) + "_" + contextVar.finalEvidenceKey;
								contextVar.fileNameArray.push(photoName);
								contextVar.photosArray.push(finalEvidenceElement.finalEvidence);
								contextVar.finalEvidenceKey++;
							});
						}
					}
				}
			}
		}
		contextVar.previousDate = contextVar.currentDate;
	});

	//Materials Overview
	contextVar.finalTaskResult = contextVar.loopThroughTasksList_currentElement.workOrderTaskResult[workOrderTaskResultLength - 1];
	if (arrayCheck(contextVar.finalTaskResult.materialsDataGrid)) {
		if (contextVar.fileType == 'Closeout Package PDF') {
			contextVar.finalTaskResult.materialsDataGrid.forEach(function (materialElement) {
				var appendString = new String(contextVar.materialsOverviewTableContents);
				appendString = appendString.replace('MANUFACTURER', materialElement.manufacturerName);
				appendString = appendString.replace('MODELNAME', materialElement.modelName);
				appendString = appendString.replace('MODELNUMBER', materialElement.modelNumber);
				appendString = appendString.replace('QUANTITYUSED', materialElement.quantityUsed);
				contextVar.materialsTableOverviewContents = contextVar.materialsTableOverviewContents + appendString;

				var appendDetailsString = new String(contextVar.materialDetailsTemplate);
				appendDetailsString = appendDetailsString.replace('MANUFACTURER', materialElement.manufacturerName);
				appendDetailsString = appendDetailsString.replace('MODELNAME', materialElement.modelName);
				appendDetailsString = appendDetailsString.replace('MODELNUMBER', materialElement.modelNumber);
				appendDetailsString = appendDetailsString.replace('QUANTITYUSED', materialElement.quantityUsed);

				contextVar.materialsDetailsPhotos = '';
				if (arrayCheck(materialElement.materialsPhotosDataGrid)) {
					var materialPhotoCount = 0;
					materialElement.materialsPhotosDataGrid.forEach(function (materialEvidenceElement) {
						materialPhotoCount++;
						var appendPhotoString = new String(contextVar.submittedEvidenceBody);
						appendPhotoString = appendPhotoString.replace('MATERIALPHOTO', materialEvidenceElement.materialsPhotos.media ? materialEvidenceElement.materialsPhotos.media : '-');
						appendPhotoString = appendPhotoString.replace('CAPTUREDON', formatDate(materialEvidenceElement.materialsPhotosCapturedTime));
						appendPhotoString = appendPhotoString.replace('ASSIGNEE', materialEvidenceElement.capturedBy ? materialEvidenceElement.capturedBy : '-');
						appendPhotoString = appendPhotoString.replace('TECHNICIANNOTES', materialEvidenceElement.materialsPhotos.comment ? materialEvidenceElement.materialsPhotos.comment : '-');

						contextVar.materialsDetailsPhotos = contextVar.materialsDetailsPhotos + appendPhotoString;

						if (materialPhotoCount % 3 == 0) {
							contextVar.materialsDetailsPhotos = contextVar.materialsDetailsPhotos + contextVar.footerForPhotos + contextVar.pageBreakFooter + contextVar.headerForPhotos;
						}

					});
				}

				contextVar.materialsDetailsPhotos = contextVar.headerForPhotos + contextVar.materialsDetailsPhotos;

				var appendComments = new String(contextVar.submittedEvidenceComments);
				appendComments = appendComments.replace('OVERALLCOMMENTS', checkForData(materialElement.materialNotes) ? materialElement.materialNotes : '-');

				contextVar.materialsDetailsPhotos = contextVar.materialsDetailsPhotos + appendComments + contextVar.footerForPhotos;

				contextVar.materialsDetailsTableContents = contextVar.materialsDetailsTableContents + appendDetailsString + contextVar.blankSeparatorTableString + contextVar.materialsDetailsPhotos + contextVar.footerString;

			});
			contextVar.materialsOverviewAllString = contextVar.zTableHeaderWithLogo + contextVar.materialsOverviewTableHeader + contextVar.materialsTableOverviewContents + contextVar.materialsOverviewTableFooter + contextVar.footerString + contextVar.materialsDetailsTableContents;
		}
		else {
			contextVar.finalTaskResult.materialsDataGrid.forEach(function (materialElement) {
				if (arrayCheck(materialElement.materialsPhotosDataGrid)) {
					materialElement.materialsPhotosDataGrid.forEach(function (materialEvidenceElement) {
						let photoName = contextVar.loopThroughTasksList_currentElement.taskId + "_materialEvidence_" + formatDateString(materialEvidenceElement.materialsPhotosCapturedTime) + "_" + contextVar.materialEvidenceKey;
						contextVar.fileNameArray.push(photoName);
						contextVar.photosArray.push(materialEvidenceElement.materialsPhotos.media);
						contextVar.materialEvidenceKey++;
					});
				}
			});
		}
	}

    // CheckList
    contextVar.finalTaskResult = contextVar.loopThroughTasksList_currentElement.workOrderTaskResult[workOrderTaskResultLength - 1];
	if (arrayCheck(contextVar.finalTaskResult.acCheckList)) {
		if (contextVar.fileType == 'Closeout Package PDF') {
			contextVar.finalTaskResult.acCheckList.forEach(function (checkElement) {
				var appendString1 = new String(contextVar.materialsOverviewTableContents1);
				appendString1 = appendString1.replace('item', checkElement.item);
				appendString1 = appendString1.replace('isChecked', checkElement.isChecked);
				contextVar.materialsTableOverviewContents1 = contextVar.materialsTableOverviewContents1 + appendString1;

				var appendDetailsString1 = new String(contextVar.materialDetailsTemplate1);
				appendDetailsString1 = appendDetailsString1.replace('item', checkElement.item);
				appendDetailsString1 = appendDetailsString1.replace('isChecked', checkElement.isChecked);
			});
			contextVar.materialsOverviewAllString1 = contextVar.zTableHeaderWithLogo + contextVar.materialsOverviewTableHeader1 + contextVar.materialsTableOverviewContents1 + contextVar.materialsOverviewTableFooter1 + contextVar.footerString + contextVar.materialsDetailsTableContents1;
		}
		else {	
		}
	}




    // Upload Report
    if (arrayCheck(contextVar.finalTaskResult.acUploadReport)) {
		if (contextVar.fileType == 'Closeout Package PDF') {
			var appendDetailsString = new String(contextVar.serviceDetailsTableHeader12);
								appendDetailsString = contextVar.zTableHeaderWithLogo + contextVar.blankString + appendDetailsString;
								appendDetailsString = appendDetailsString.replace('ADDEDON', formatDate(contextVar.date) ? formatDate(contextVar.date): '-');
								
								appendDetailsString = appendDetailsString.replace('latitude', contextVar.latitude);
								appendDetailsString = appendDetailsString.replace('longitude', contextVar.longitude);
appendDetailsString = appendDetailsString  + contextVar.serviceDetailsTableFooter + contextVar.blankSeparatorTableString;
			    contextVar.serviceDetailsAllString1 = contextVar.serviceDetailsAllString1 + appendDetailsString + contextVar.pageBreakFooter + contextVar.footerString;
			
		}
		else {	
		}
	}
    
    
    
    
    //Driving Details
    
	if (arrayCheck(contextVar.acDriving)) {
		
			contextVar.acDriving.forEach(function (driveElement) {
				var appendString2 = new String(contextVar.materialsOverviewTableContents2);
				appendString2 = appendString2.replace('driveFrom', driveElement.driveFrom ? driveElement.driveFrom : '-' );
				appendString2 = appendString2.replace('propertyType', driveElement.propertyType ? driveElement.propertyType : '-' );
				appendString2 = appendString2.replace('startTravelDate', formatDate(driveElement.startTravelDate) ? formatDate(driveElement.startTravelDate) : '-');
				appendString2 = appendString2.replace('endTravelDate', formatDate(driveElement.endTravelDate) ? formatDate(driveElement.endTravelDate): '-');
                appendString2 = appendString2.replace('driveTime', driveElement.driveTime ? driveElement.driveTime : '-');
				appendString2 = appendString2.replace('driveDistance', driveElement.driveDistance ? driveElement.driveDistance  : '-');
                appendString2 = appendString2.replace('startLatitude', driveElement.startLatitude ? driveElement.startLatitude : '-');
				appendString2 = appendString2.replace('startLongitude', driveElement.startLongitude ? driveElement.startLongitude : '-');
                appendString2 = appendString2.replace('endLatitude', driveElement.endLatitude ? driveElement.endLatitude : '-');
				appendString2 = appendString2.replace('endLongitude', driveElement.endLongitude ? driveElement.endLongitude : '-');
				contextVar.materialsTableOverviewContents2 = contextVar.materialsTableOverviewContents2 + appendString2;

				
			});
			contextVar.materialsOverviewAllString2 = contextVar.zTableHeaderWithLogo + contextVar.materialsOverviewTableHeader2 + contextVar.materialsTableOverviewContents2 + contextVar.materialsOverviewTableFooter2;
		}
		
	if (arrayCheck(contextVar.acDriving)) {
		
			contextVar.acDriving.forEach(function (driveElement) {
				var appendString3 = new String(contextVar.materialsOverviewTableContents3);
                appendString3 = appendString3.replace('startLatitude', driveElement.startLatitude ? driveElement.startLatitude : '-');
				appendString3 = appendString3.replace('startLongitude', driveElement.startLongitude ? driveElement.startLongitude : '-');
                appendString3 = appendString3.replace('endLatitude', driveElement.endLatitude ? driveElement.endLatitude : '-');
				appendString3 = appendString3.replace('endLongitude', driveElement.endLongitude ? driveElement.endLongitude : '-');
				contextVar.materialsTableOverviewContents3 = contextVar.materialsTableOverviewContents3 + appendString3;

				
			});
			contextVar.materialsOverviewAllString3 = contextVar.materialsOverviewTableHeader3 + contextVar.materialsTableOverviewContents3 + contextVar.materialsOverviewTableFooter3 + contextVar.footerString + contextVar.materialsDetailsTableContents2;
		}

}

contextVar.taskResultAllString = '';
contextVar.taskContent = '';
if (contextVar.taskLog && Array.isArray(contextVar.taskLog)) {
	contextVar.taskLog.forEach(function (taskElement) {
		var appendString = new String(contextVar.taskResultsTable);
		appendString = appendString.replace('SUBMITTEDON', formatDate(taskElement.date));
		appendString = appendString.replace('ASSIGNEE', taskElement.userName ? taskElement.userName : contextVar.workOrderData[0].technicianName);
		appendString = appendString.replace('PROGRESSREPORTS', taskElement.isProgressReport ? taskElement.isProgressReport : '-');
		appendString = appendString.replace('SERVICESDELIVERED', taskElement.servicesCount ? taskElement.servicesCount : '-');
		appendString = appendString.replace('INITIALEVIDENCE', taskElement.initialEvidenceCount ? taskElement.initialEvidenceCount : '-');
		appendString = appendString.replace('FINALEVIDENCE', taskElement.finalEvidenceCount ? taskElement.finalEvidenceCount : '-');
		contextVar.taskContent = contextVar.taskContent + appendString;
	});
}
contextVar.taskResultAllString = contextVar.taskResultAllString + contextVar.taskTableHeader + contextVar.taskContent + contextVar.taskTableFooter + contextVar.footerString;


var appendSignature = new String(contextVar.customerSignatureTemplate);
appendSignature = appendSignature.replace('CUSTOMERSIGNATURE', contextVar.loopThroughTasksList_currentElement.customerSignature ? contextVar.loopThroughTasksList_currentElement.customerSignature : '-');
if (Array.isArray(contextVar.loopThroughTasksList_currentElement.workOrderTaskResult) && contextVar.loopThroughTasksList_currentElement.workOrderTaskResult.length > 0) {
	appendSignature = appendSignature.replace('APPROVEDBY', contextVar.loopThroughTasksList_currentElement.workOrderTaskResult[contextVar.loopThroughTasksList_currentElement.workOrderTaskResult.length - 1].approvedBy ? contextVar.loopThroughTasksList_currentElement.workOrderTaskResult[contextVar.loopThroughTasksList_currentElement.workOrderTaskResult.length - 1].approvedBy : '-');
	appendSignature = appendSignature.replace('SIGNEDON', formatDate(contextVar.loopThroughTasksList_currentElement.workOrderTaskResult[contextVar.loopThroughTasksList_currentElement.workOrderTaskResult.length - 1].SubmittedDate));
} else {
	appendSignature = appendSignature.replace('APPROVEDBY', '');
	appendSignature = appendSignature.replace('SIGNEDON', '');
}
contextVar.customerSignatureString = contextVar.customerSignatureString + appendSignature + contextVar.footerString;

contextVar.allString = contextVar.allString + contextVar.taskResultAllString + contextVar.initialEvidenceHeader + contextVar.initialEvidenceAllString + contextVar.progressEvidenceHeader + contextVar.progressEvidenceAllString + contextVar.servicesOverviewAllString + contextVar.serviceDetailsAllString  + contextVar.materialsOverviewAllString + contextVar.finalEvidenceHeader + contextVar.finalEvidenceAllString +contextVar.serviceDetailsAllString1+ contextVar.materialsOverviewAllString1 + contextVar.materialsOverviewAllString2 + contextVar.materialsOverviewAllString3;