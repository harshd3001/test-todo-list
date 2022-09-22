{
	const statuses = {
		schedulerLogInProgress: 'schedulerLogInProgress',
		schedulerLogQueued: 'schedulerLogQueued',
		schedulerLogSkipped: 'schedulerLogSkipped'
	};
	let inProgressOrToMoveToInProgressSchedulers = [];
	if (contextVar.data.status === statuses.schedulerLogQueued) {
		inProgressOrToMoveToInProgressSchedulers = contextVar.activeSchedulerData || [];
	} else {
		inProgressOrToMoveToInProgressSchedulers = (contextVar.activeSchedulerData || []).filter(log => log.status === statuses.schedulerLogInProgress);
	}
	contextVar.techsToBeFetchedSchedulers.forEach((queued) => {
		techsAndDatesDontOverlap = true;
		let i = 0;
		while (i < inProgressOrToMoveToInProgressSchedulers.length && techsAndDatesDontOverlap) {
			let log = inProgressOrToMoveToInProgressSchedulers[i];
			if ((queued.context.startDate >= log.context.startDate && queued.context.startDate <= log.context.endDate) || (queued.context.endDate >= log.context.startDate && queued.context.endDate <= log.context.endDate) || (log.context.startDate >= queued.context.startDate && log.context.startDate <= queued.context.endDate) || (log.context.endDate >= queued.context.startDate && log.context.endDate <= queued.context.endDate)) {
				let j = 0;
				while (techsAndDatesDontOverlap && j < log.context.schedulerTriggerContext.technicians.length) {
					if (contextVar.schedulerToTechsMap[queued.id].originalFilteredTechIds.indexOf(log.context.schedulerTriggerContext.technicians[j].id) !== -1) {
						techsAndDatesDontOverlap = false;
						break;
					}
					j++;
				}
			}
			i++;
		}

		if (techsAndDatesDontOverlap) {
			queued.context.schedulerTriggerContext = {
				technicians: contextVar.schedulerToTechsMap[queued.id].technicians,
				startDate: queued.context.startDate,
				endDate: queued.context.endDate
			};
			let logToInsert = {
				schedulerId: queued.schedulerId,
				schedulerType: queued.schedulerType,
				context: queued.context,
				id: queued.id,
				status: queued.status,
				modelName: queued.modelName
			};
			contextVar.schedulersToMoveInProgress.push(logToInsert);
			inProgressOrToMoveToInProgressSchedulers.push(logToInsert);
		}
	});
}