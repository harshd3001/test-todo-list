{
  contextVar.jsonObj = [];
  if(contextVar.subAction === "upsertSkill") {
    jsonData = {};
    for (var key in contextVar.skill) {
      if(key === "recver") {
        continue;
      } else {
        jsonData[key] = contextVar.skill[key];
      }
    }
    contextVar.jsonObj.push(jsonData);
  } else if(contextVar.subAction === "deleteSkill") {
    contextVar.jsonObj = [
      {
        "id": contextVar.skill.id,
        "recver": contextVar.skill.recver
      }
    ];
  }
}