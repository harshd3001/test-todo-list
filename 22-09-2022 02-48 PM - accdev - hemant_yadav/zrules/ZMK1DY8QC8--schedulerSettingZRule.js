{
  contextVar.jsonObj = [ ];
  if(contextVar.subAction === "upsertSchedulerSetting") {
    jsonData = {};
    for (var key in contextVar.schedulerSetting) {
        jsonData[key] = contextVar.schedulerSetting[key];
    }
    contextVar.jsonObj.push(jsonData);
  }
}