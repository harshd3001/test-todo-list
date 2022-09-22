{
	var technicianArray = [],
		techData = {};
	contextVar.technicianList = [];
	if (typeof contextVar.techArray != 'undefined' && contextVar.techArray.length > 0) {

		// forming array of an object with all the required information of the technicians.
		contextVar.techArray.forEach(function (element) {
			if (typeof contextVar.proximityScoreData[element] === 'undefined' || typeof contextVar.proximityScoreData[element].value === 'undefined' || contextVar.proximityScoreData[element].value === '' || typeof contextVar.proximityScoreData[element].text === 'undefined' || contextVar.proximityScoreData[element].text === '' || typeof contextVar.proximityScoreData[element].distanceValue === 'undefined' || contextVar.proximityScoreData[element].distanceValue === '') {
				return;
			}
			var techUserName = '',
				techEmail = '';
			if (typeof contextVar.technicianListData !== 'undefined' && contextVar.technicianListData.length > 0) {
				for (var i = 0; i < contextVar.technicianListData.length; i++) {
					if (contextVar.technicianListData[i].userId === element) {
						techUserName = contextVar.technicianListData[i].userName;
						techEmail = contextVar.technicianListData[i].userEmail;
						break;
					}
				}
			}
			techData = {
				'workforceUserId': element,
				'userName': techUserName,
				'utilizationScore': (typeof contextVar.utilizationScoreData[element] === 'undefined' || contextVar.utilizationScoreData[element] === '0') ? 0 : parseInt(contextVar.utilizationScoreData[element]),
				'travelTimeValue': parseInt(contextVar.proximityScoreData[element].value),
				'travelTime': contextVar.proximityScoreData[element].text,
				'distanceValue': parseInt(contextVar.proximityScoreData[element].distanceValue),
				'experienceScore': (typeof contextVar.experienceScoreData[element] === 'undefined' || contextVar.experienceScoreData[element] === '0') ? 0 : parseInt(contextVar.experienceScoreData[element]),
				'email': techEmail
			};
			technicianArray.push(techData);

		});
		if (typeof contextVar === 'undefined' || typeof contextVar.orderBy === 'undefined' || contextVar.orderBy === '') {
			// if orderBy is not getting passed from the API call
			if (contextVar.optimizeAllTask === 'travelTime') {
				technicianArray.sort(function (a, b) {
					return a.travelTimeValue - b.travelTimeValue;
				});
			} else if (contextVar.optimizeAllTask === 'experienceScore') {
				technicianArray.sort(function (a, b) {
					return b[contextVar.optimizeAllTask] - a[contextVar.optimizeAllTask];
				});
			} else {
				technicianArray.sort(function (a, b) {
					return a[contextVar.optimizeAllTask] - b[contextVar.optimizeAllTask];
				});
			}
		} else {
			// if orderBy is getting passed from the API call
			var orderName = contextVar.orderBy.split(' ')[0];
			if (contextVar.orderBy.split(' ')[1] === 'DESC') {
				// ordering in descending order
				if (orderName === 'userName' || orderName === 'email') {
					technicianArray.sort(function (a, b) {
						var titleA = b[orderName].toLowerCase(),
							titleB = a[orderName].toLowerCase();
						if (titleA < titleB) return -1;
						if (titleA > titleB) return 1;
						return 0;
					});
				} else if (orderName === 'utilizationScore' || orderName === 'experienceScore') {
					technicianArray.sort(function (a, b) {
						return b[orderName] - a[orderName];
					});
				} else {
					technicianArray.sort(function (a, b) {
						return b.travelTimeValue - a.travelTimeValue;
					});
				}
			} else {
				// ordering in ascending order
				if (orderName === 'userName' || orderName === 'email') {
					technicianArray.sort(function (a, b) {
						var titleA = a[orderName].toLowerCase(),
							titleB = b[orderName].toLowerCase();
						if (titleA < titleB) return -1;
						if (titleA > titleB) return 1;
						return 0;
					});
				} else if (orderName === 'utilizationScore' || orderName === 'experienceScore') {
					technicianArray.sort(function (a, b) {
						return a[orderName] - b[orderName];
					});
				} else {
					technicianArray.sort(function (a, b) {
						return a.travelTimeValue - b.travelTimeValue;
					});
				}
			}
		}

		// formatting the final list of data
		technicianArray.forEach(function (key) {
			if (key.utilizationScore === 0) {
				key.utilizationScore = 0 + '%';
			} else {
				key.utilizationScore = key.utilizationScore + '%';
			}
			if (key.experienceScore === 0) {
				key.experienceScore = '-';
			}
		});
		contextVar.technicianList = JSON.parse(JSON.stringify(technicianArray));
	}

	// formation of data if the call is from Jit Scheduler
	if (typeof contextVar.workflow === 'undefined' && typeof contextVar.technicianList !== 'undefined' && contextVar.technicianList.length > 0) {
		contextVar.data = [];
		var data = [];
		var schedulerObj = {
			'id': contextVar.technicianList[0].workforceUserId,
			'totalScore': 100
		};
		data.push(schedulerObj);
		contextVar.data = [{
			'data': data,
			'resultKey': 'totalScore'
		}];
	}
}