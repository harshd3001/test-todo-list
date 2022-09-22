{
  contextVar.jsonObj = [];
  contextVar.taskScheduleBreakdown.forEach(function (element) {
    jsonData = {};
    jsonData.id = '';
    for (var key in element) {
      if (key === "durationInHours") {
        continue;
      } else {
        jsonData[key] = element[key];
      }
    }
    jsonData.workOrderTaskId = contextVar.workOrderTaskId;
    contextVar.jsonObj.push(jsonData);
  });
}