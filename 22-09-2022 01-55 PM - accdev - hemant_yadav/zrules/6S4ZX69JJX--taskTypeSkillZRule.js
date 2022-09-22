{
  contextVar.jsonObj = [];
  if(contextVar.subAction === "upsertSkill") {
    jsonData = {};
    for (var key in contextVar.taskTypeSkill) {
      if(key === "recver") {
        continue;
      } else {
        jsonData[key] = contextVar.taskTypeSkill[key];
      }
    }
    contextVar.jsonObj.push(jsonData);
  } else if(contextVar.subAction === "deleteSkill") {
    contextVar.jsonObj = [
      {
        "taskTypeId": contextVar.taskTypeSkill.taskTypeId,
        "skillId": contextVar.taskTypeSkill.skillId,
        "recver": contextVar.taskTypeSkill.recver
      }
    ];
  }
}