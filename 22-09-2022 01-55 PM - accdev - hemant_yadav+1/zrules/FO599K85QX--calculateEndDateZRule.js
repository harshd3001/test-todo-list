{
  if ((typeof contextVar.plannedStartTime !== 'undefined' && contextVar.plannedStartTime !== '') || (typeof contextVar.estimatedDurationInHours !==
    'undefined' && contextVar.estimatedDurationInHours !== '')) {
    scheduledDate = new Date(contextVar.plannedStartTime);
    scheduledDate = new Date(scheduledDate.setHours(scheduledDate.getHours() + contextVar.estimatedDurationInHours));
    contextVar.plannedEndTime = scheduledDate.toISOString().replace('T', ' ').replace('Z', '');
  }
}