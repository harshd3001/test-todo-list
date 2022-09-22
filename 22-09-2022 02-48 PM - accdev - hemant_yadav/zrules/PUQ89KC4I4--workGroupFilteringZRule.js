contextVar.customerFilter = [];
contextVar.workOrderFilter = [];
contextVar.taskFilter = [];
// create arrays with filter ids
if ((typeof contextVar.workforceWorkGroupData !== 'undefined' || typeof contextVar.workforceWorkGroupDataforDisptacher !== 'undefined' || typeof contextVar.workforceWorkGroupDataFortechnician != 'undefined') && contextVar.isAllFilterApplied !== true) {
	if (typeof contextVar.taskType !== 'undefined' && contextVar.taskType.length > 0) {
		contextVar.taskFilter = contextVar.taskType;
	}
	if (typeof contextVar.WorkOrderIdsToFilterWith != 'undefined') {
		contextVar.workOrderFilter = contextVar.WorkOrderIdsToFilterWith;
	}
	if (typeof contextVar.siteIdsToFilterWith != 'undefined') {
		contextVar.customerFilter = contextVar.siteIdsToFilterWith;
	}
}
// create dynamic filter
if (typeof contextVar === 'undefined' || typeof contextVar.batchNumber === 'undefined' || contextVar.batchNumber === '') {
	contextVar.batchNumber = 1;
} else {
	contextVar.batchNumber = contextVar.batchNumber;
}
if (typeof contextVar === 'undefined' || typeof contextVar.batchSize === 'undefined' || contextVar.batchSize === '') {
	contextVar.batchSize = 50;
} else {
	contextVar.batchSize = contextVar.batchSize;
}
if (typeof contextVar === 'undefined' || typeof contextVar.orderBy === 'undefined' || contextVar.orderBy === '') {
	contextVar.orderBy = 'modifiedDate DESC';
} else {
	contextVar.orderBy = contextVar.orderBy;
}
if (typeof contextVar === 'undefined' || typeof contextVar.filter === 'undefined') {
	contextVar.filter = '({$status} in {@statusFilter})';
} else {
	contextVar.filter = '({$status} in {@statusFilter}) and ' + contextVar.filter;
	var count = 0;
	if (contextVar.filter.includes('customerCompanyName')) {
		var position = contextVar.filter.lastIndexOf('customerCompanyName');
		if (contextVar.filter.indexOf('customerCompanyName') != position) {
			contextVar.customerFilterString = contextVar.filter.match('\\s*{\\$customerCompanyName}.*?\\AND')[0].replace('AND', '').replace('{$customerCompanyName} like', '').replace(/'/mg, '').replace(/^\s+/m, '').replace(/\s+$/, '');
			if (contextVar.filter.replace(/{\$customerCompanyName}.*?\\AND'/m, '')) {
				contextVar.filter = contextVar.filter.replace(/{\$customerCompanyName}.*?AND/m, '');
				contextVar.filter = contextVar.filter.replace(/\|\| {\$customerCompanyName}.*?%'/m, '');
				contextVar.filter = contextVar.filter.replace(/$/, ' AND {$customerId} in ({@customerCompanyNames})');
				count++;
			}
		} else {
			contextVar.customerFilterString = contextVar.filter.match('\\|\\|\\s*{\\$customerCompanyName}.*%\\\'')[0].
			replace('||', '').replace('{$customerCompanyName} like', '').replace(/'/mg, '').replace(/^\s+/m, '').replace(/\s+$/, '');
			if (contextVar.filter.replace(/\|\| {\$customerCompanyName}.*%'/m, '')) {
				contextVar.filter = contextVar.filter.replace(/\|\| {\$customerCompanyName}.*%'/m, '');
				contextVar.filter = contextVar.filter.replace(/\)$/, '|| {$customerId} in ({@customerCompanyNames}\)\)');
			}
		}
	}
	if (contextVar.filter.includes('regionName')) {
		var position = contextVar.filter.lastIndexOf('regionName');
		if (contextVar.filter.indexOf('regionName') != position) {
			contextVar.regionFilterString = contextVar.filter.match('\\s*{\\$regionName}.*?\\AND')[0].replace('AND', '').replace('{$regionName} like', '').replace(/'/mg, '').replace(/^\s+/m, '').replace(/\s+$/, '');
			if (contextVar.filter.replace(/{\$regionName}.*?\\AND'/m, '')) {
				contextVar.filter = contextVar.filter.replace(/{\$regionName}.*?AND/m, '');
				contextVar.filter = contextVar.filter.replace(/\|\| {\$regionName}.*?%'/m, '');
				contextVar.filter = contextVar.filter.replace(/$/, ' AND {$regionId} in ({@regionNames})');
			}
		} else {
			contextVar.regionFilterString = contextVar.filter.match('\\|\\|\\s*{\\$regionName}.*%\\\'')[0].replace('||', '').
			replace('{$regionName} like', '').replace(/'/mg, '').replace(/^\s+/m, '').replace(/\s+$/, '');
			if (contextVar.filter.replace(/\|\| {\$regionName}.*%'/m, '')) {
				contextVar.filter = contextVar.filter.replace(/\|\| {\$regionName}.*%'/m, '');
				if (count === 0) {
					contextVar.filter = contextVar.filter.replace(/\)$/, '|| {$regionId} in ({@regionNames}\)\)');
				}
			}
		}
	}
	if (contextVar.isAllFilterApplied === false) {
		if (contextVar.customerFilter.length > 0) {
			contextVar.filter = contextVar.filter + ' and ({$site.id} in {@customerFilter})';
		}
		if (contextVar.workOrderFilter.length > 0) {
			contextVar.filter = contextVar.filter + ' and ({$workOrderTask.workOrderId} in {@workOrderFilter})';
		}
		if (contextVar.taskFilter.length > 0) {
			contextVar.filter = contextVar.filter + ' and ({$workOrderTask.taskTypeId} in {@taskFilter})';
		}
		if (contextVar.region.length > 0) {
			contextVar.filter = contextVar.filter + ' and ({$regionId} in {@region})';
		}
	}
}
//to handle filter when customer portal is installed
if (contextVar.isCustomerPortalOrderDetailsModelPresent == false && contextVar.filter.includes('UID')) {
	let subStr1 = contextVar.filter.slice(contextVar.filter.indexOf('{$UID}'), contextVar.filter.indexOf('||', contextVar.filter.indexOf('{$UID}')) + 2);
	let subStr2 = contextVar.filter.slice(contextVar.filter.indexOf('{$bookingStatus}'), contextVar.filter.indexOf('||', contextVar.filter.indexOf('{$bookingStatus}')) + 2);
	contextVar.filter = contextVar.filter.replace(subStr1, '');
	contextVar.filter = contextVar.filter.replace(subStr2, '');
} else {
	contextVar.filter = contextVar.filter.includes('%Confirmed%') ? contextVar.filter.replace(/%Confirmed%/g, 'fscx2_0_userBookingConfirmed') : contextVar.filter;
	contextVar.filter = contextVar.filter.includes('%confirmed%') ? contextVar.filter.replace(/%confirmed%/g, 'fscx2_0_userBookingConfirmed') : contextVar.filter;
	contextVar.filter = contextVar.filter.includes('%Unconfirmed%') ? contextVar.filter.replace(/%confirmed%/g, 'fscx2_0_userBookingUnconfirmed') : contextVar.filter;
	contextVar.filter = contextVar.filter.includes('%unconfirmed%') ? contextVar.filter.replace(/%confirmed%/g, 'fscx2_0_userBookingUnconfirmed') : contextVar.filter;
	contextVar.filter = contextVar.filter.includes('bookingStatus') ? contextVar.filter.replace('bookingStatus', 'bookingStatusId') : contextVar.filter;
	if (contextVar.filter.includes('%Confirmed%') || contextVar.filter.includes('%confirmed%') || contextVar.filter.includes('%Unconfirmed%') || contextVar.filter.includes('%unconfirmed%')) {
		contextVar.filter = contextVar.filter.replace('({$status} in {@statusFilter}) and', '');
	}
}