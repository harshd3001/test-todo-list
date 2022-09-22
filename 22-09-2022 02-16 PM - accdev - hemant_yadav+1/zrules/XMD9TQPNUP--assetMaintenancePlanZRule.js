var jsonData = {};
    contextVar.workOrderDeadline = '-';
    if (Array.isArray(contextVar.workOrderDeadlineData) && contextVar.workOrderDeadlineData.length > 0) {
        contextVar.workOrderDeadlineData.forEach((element) => {
            if (element.priority === contextVar.workOrderPriority) {
                contextVar.workOrderDeadline = element.deadline;
            }
        });
    }
    contextVar.createWorkOrder = new Date(contextVar.scheduledOnDate);
    contextVar.createWorkOrder.setDate(contextVar.createWorkOrder.getDate() - contextVar.daysInAdvance);
    contextVar.createWorkOrder = contextVar.createWorkOrder.toISOString().replace('T', ' ').replace('Z', '');
    jsonData = {
        'createWorkOrderDate': contextVar.createWorkOrder,
        'deadline': contextVar.workOrderDeadline,
        'requestedDate': contextVar.scheduledOnDate
    };
    contextVar.maintenanceScheduleData.push(jsonData);
    contextVar.scheduledOnDate = new Date(contextVar.scheduledOnDate);
    if (contextVar.frequencyUnit === 'day' || contextVar.frequencyUnit === 'days') {
        contextVar.scheduledOnDate.setDate(contextVar.scheduledOnDate.getDate() + 1 * contextVar.frequencyValue);
    }
    if (contextVar.frequencyUnit === 'week' || contextVar.frequencyUnit === 'weeks') {
        contextVar.scheduledOnDate = new Date(contextVar.scheduledOnDate.getTime() + (7 * 24 * 60 * 60 * 1000) * contextVar.frequencyValue);
    }
    if (contextVar.frequencyUnit === 'month' || contextVar.frequencyUnit === 'months') {
        contextVar.scheduledOnDate.setMonth(contextVar.scheduledOnDate.getMonth() + 1 * contextVar.frequencyValue);
    }
    contextVar.scheduledOnDate = contextVar.scheduledOnDate.toISOString().replace('T', ' ').replace('Z', '');