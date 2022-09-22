{
  contextVar.jsonObj = [];
  if(contextVar.subAction === "upsertSkillLevel") {
    jsonData = {};
    for (var key in contextVar.skillLevel) {
      if(key === "recver") {
        continue;
      } else {
        jsonData[key] = contextVar.skillLevel[key];
      }
    }
    contextVar.jsonObj.push(jsonData);
  } else if(contextVar.subAction === "deleteSkillLevel") {
    contextVar.jsonObj = [
      {
        "id": contextVar.skillLevel.id,
        "recver": contextVar.skillLevel.recver
      }
    ];
  }
}