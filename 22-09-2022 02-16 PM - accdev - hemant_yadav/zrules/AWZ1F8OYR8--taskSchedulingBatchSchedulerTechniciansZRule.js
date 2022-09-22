/* Array Validation function */
function arrayCheck(array) {
	return Array.isArray(array) && array.length > 0;
}

/* function to create a hash map for all data */
function constructObject(array, key, type) {
	var hashObj = {};
	if (arrayCheck(array)) {
		array.forEach(obj => {
			if (typeof hashObj[obj[key]] === 'undefined' || hashObj[obj[key]] === '') {
				if (type === 'object') {
					hashObj[obj[key]] = {};
				} else {
					hashObj[obj[key]] = [];
				}
			}
			if (type === 'object') {
				hashObj[obj[key]][obj.skillId] = obj.skillLevelRank;
			} else {
				hashObj[obj[key]].push(obj);
			}
		});
	}
	return hashObj;
}

{
	var allData = [],
		skillMap = {},
		calendarMapData = {},
		overtimeData = {};

	if (arrayCheck(contextVar.technicianTaskData)) {
		allData = allData.concat(contextVar.technicianTaskData);
	}

	if (arrayCheck(contextVar.technicianLeaveData)) {
		allData = allData.concat(contextVar.technicianLeaveData);
	}

	if (arrayCheck(contextVar.unavailableTechsData)) {
		allData = allData.concat(contextVar.unavailableTechsData);
	}

	calendarMapData = constructObject(allData, 'workforceUserId', 'array');


	/* constructing overtime hashmap */
	if (arrayCheck(contextVar.technicianOvertimeData)) {
		contextVar.technicianOvertimeData.forEach(obj => {
			if (typeof overtimeData[obj.workforceUserId] === 'undefined' || overtimeData[obj.workforceUserId] === '') {
				overtimeData[obj.workforceUserId] = {};
			}
			var overtimeDate = obj.openingTime.split(' ')[0];
			overtimeData[obj.workforceUserId][overtimeDate] = new Array(obj);
		});
	}

	if (contextVar.schedulerSettingUseSkills && arrayCheck(contextVar.technicianSkillData)) {
		skillMap = constructObject(contextVar.technicianSkillData, 'workforceUserId', 'object');
	}

	/* replacing calendarMap, availability and availability with overTime with respective hashmap */
	if (arrayCheck(contextVar.technicians)) {
		contextVar.technicians.forEach(element => {
			element.calendarMap = element.calendarMap.concat(calendarMapData[element.workforceUserId] || []);
			element.availabilityWithOverTime = overtimeData[element.workforceUserId];
			element['techniciansSkill'] = skillMap[element.workforceUserId];
		});
	}
}