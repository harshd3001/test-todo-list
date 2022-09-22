contextVar.isAllFilterApplied = false;
var filters = [];
var obj = {};
obj.temp = [];
var region = [];
var customer = [];
var taskType = [];
var workOrderType = [];
var filterForDispatcher = false;
var filterForTechnician = false;

obj.temp = contextVar.workforceWorkGroupDataFortechnician;
//Creating array for workGroupFilterMethod from workforceWorkGroupDataforDisptacher
if (typeof contextVar.workforceWorkGroupDataforDisptacher !== 'undefined' && contextVar.workforceWorkGroupDataforDisptacher !== '' && contextVar.workforceWorkGroupDataforDisptacher.length > 0) {
	if (contextVar.isAllFilterApplied !== true) {
		for (var i = 0; i < contextVar.workforceWorkGroupDataforDisptacher.length; i++) {
			if (typeof contextVar[contextVar.workforceWorkGroupDataforDisptacher[i].workGroupFilterMethod] === 'undefined') {
				if (contextVar.workforceWorkGroupDataforDisptacher[i].workGroupFilterMethod === 'all') {
					filterForDispatcher = true;

					break;
				}
				contextVar[contextVar.workforceWorkGroupDataforDisptacher[i].workGroupFilterMethod] = [];
				filters.push(contextVar.workforceWorkGroupDataforDisptacher[i].workGroupFilterMethod);
			}
			if (contextVar[contextVar.workforceWorkGroupDataforDisptacher[i].workGroupFilterMethod].indexOf(contextVar.workforceWorkGroupDataforDisptacher[i].workGroupFilterFilterId) == -1) {
				contextVar[contextVar.workforceWorkGroupDataforDisptacher[i].workGroupFilterMethod].push(contextVar.workforceWorkGroupDataforDisptacher[i].workGroupFilterFilterId);
			}
		}
	}
}
//Creating array for workGroupFilterMethod from workforceWorkGroupDataFortechnician
if (typeof obj.temp !== 'undefined' && obj.temp !== '' && obj.temp.length > 0) {
	if (contextVar.isAllFilterApplied !== true) {
		for (var i = 0; i < obj.temp.length; i++) {
			if (typeof obj[obj.temp[i].workGroupFilterMethod] === 'undefined') {
				if (obj.temp[i].workGroupFilterMethod === 'all') {
					filterForTechnician = true;
					break;
				}
				obj[obj.temp[i].workGroupFilterMethod] = [];
				filters.push(obj.temp[i].workGroupFilterMethod);
			}
			if (obj[obj.temp[i].workGroupFilterMethod].indexOf(obj.temp[i].workGroupFilterFilterId) == -1) {
				obj[obj.temp[i].workGroupFilterMethod].push(obj.temp[i].workGroupFilterFilterId);
			}
		}
	}
}
//if both workforceWorkGroupDataforDisptacher and workforceWorkGroupDataforDisptacher has 'all' filter
if (filterForDispatcher === true && filterForTechnician === true) {
	contextVar.isAllFilterApplied = true;
}

//taking similar values from both the dispatcher and technician
if (typeof obj.region !== 'undefined' && obj.region !== '' && obj.region.length > 0 && typeof contextVar.region !== 'undefined' && contextVar.region !== '' && contextVar.region.length > 0) {
	for (var i = 0; i < obj.region.length; i++) {
		for (var e = 0; e < contextVar.region.length; e++) {
			if (obj.region[i] === contextVar.region[e]) {
				region.push(obj.region[i]);
			}
		}
	}
}
if (typeof obj.taskType !== 'undefined' && obj.taskType !== '' && obj.taskType.length > 0 && typeof contextVar.taskType !== 'undefined' && contextVar.taskType !== '' && contextVar.taskType.length > 0) {
	for (var i = 0; i < obj.taskType.length; i++) {
		for (var e = 0; e < contextVar.taskType.length; e++) {
			if (obj.taskType[i] === contextVar.taskType[e]) {
				taskType.push(obj.taskType[i]);
			}
		}
	}
}
if (typeof obj.workOrderType !== 'undefined' && obj.workOrderType !== '' && obj.workOrderType.length > 0 && typeof contextVar.workOrderType !== 'undefined' && contextVar.workOrderType !== '' && contextVar.workOrderType.length > 0) {
	for (var i = 0; i < obj.workOrderType.length; i++) {
		for (var e = 0; e < contextVar.workOrderType.length; e++) {
			if (obj.workOrderType[i] === contextVar.workOrderType[e]) {
				workOrderType.push(obj.workOrderType[i]);
			}
		}
	}
}
if (typeof obj.customer !== 'undefined' && obj.customer !== '' && obj.customer.length > 0 && typeof contextVar.customer !== 'undefined' && contextVar.customer !== '' && contextVar.customer.length > 0) {
	for (var i = 0; i < obj.customer.length; i++) {
		for (var e = 0; e < contextVar.customer.length; e++) {
			if (obj.customer[i] === contextVar.customer[e]) {
				customer.push(obj.customer[i]);
			}
		}
	}
}
if (region.length > 0) {
	contextVar.region = region;
}
if (taskType.length > 0) {
	contextVar.taskType = taskType;
}
if (workOrderType.length > 0) {
	contextVar.workOrderType = workOrderType;
}
if (customer.length > 0) {
	contextVar.customer = customer;
}
if (typeof contextVar.region === 'undefined' || contextVar.region.length === 0 || contextVar.region === '') {
	contextVar.region = obj.region;
}
if (typeof contextVar.taskType === 'undefined' || contextVar.taskType.length === 0 || contextVar.taskType === '') {
	contextVar.taskType = obj.taskType;
}
if (typeof contextVar.workOrderType === 'undefined' || contextVar.workOrderType.length === 0 || contextVar.workOrderType === '') {
	contextVar.workOrderType = obj.workOrderType;
}
if (typeof contextVar.customer === 'undefined' || contextVar.customer.length === 0 || contextVar.customer === '') {
	contextVar.customer = obj.customer;
}