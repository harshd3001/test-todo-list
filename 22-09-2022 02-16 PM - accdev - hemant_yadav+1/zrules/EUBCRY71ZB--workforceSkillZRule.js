{
  contextVar.jsonObj = [];
  if(contextVar.subAction === "upsertTechnicianSkill") {
    jsonData = {};
    for (var key in contextVar.workforceSkill) {
      if(key === "recver") {
        continue;
      } else {
        jsonData[key] = contextVar.workforceSkill[key];
      }
    }
    contextVar.jsonObj.push(jsonData);
  }
}