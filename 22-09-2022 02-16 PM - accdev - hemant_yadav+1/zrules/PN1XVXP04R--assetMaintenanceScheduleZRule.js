function getSchedulesToBeDeleted(selectedSchedules) {
  contextVar.schedulesToDelete = contextVar.assetMaintenanceScheduleData.filter(schedule => !selectedSchedules.some(selectedSchedule => selectedSchedule.id === schedule.id));
}

function getSchedulesToBeInserted(selectedSchedules) {
  function compare(a) {
    return function (current) {
      return a.filter(function (b) {
        return b.createWorkOrderDate === current.createWorkOrderDate && b.id === current.id && b.requestedDate === current.requestedDate && b.deadline === current.deadline;
      }).length === 0;
    };
  }
  contextVar.schedulesToInsert = selectedSchedules.filter(compare(contextVar.assetMaintenanceScheduleData));
}

function createJsonObject(selectedSchedule) {
  selectedSchedule.assetMaintenancePlanId = contextVar.assetMaintenancePlanId;
  return selectedSchedule;
} {
  contextVar.schedulesToInsert = [];
  contextVar.schedulesToDelete = [];
  if (Array.isArray(contextVar.selectedSchedules) && contextVar.selectedSchedules.length > 0) {
    if (contextVar.subAction === "upsertAssetMaintenanceSchedule") {
      if (Array.isArray(contextVar.assetMaintenanceScheduleData) && contextVar.assetMaintenanceScheduleData.length > 0) {
        getSchedulesToBeDeleted(contextVar.selectedSchedules);
        getSchedulesToBeInserted(contextVar.selectedSchedules);
      } else {
        contextVar.schedulesToInsert = contextVar.selectedSchedules.map(selectedSchedule => createJsonObject(selectedSchedule));
      }
    }
  }
}