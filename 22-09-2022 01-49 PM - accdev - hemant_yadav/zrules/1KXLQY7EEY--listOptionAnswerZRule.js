{
  contextVar.jsonObj = [];
 if(contextVar.subAction === "deleteListOptionAnswer") {
    contextVar.jsonObj = [
      {
        "id": contextVar.listOptionAnswer.id,
        "recver": contextVar.listOptionAnswer.recver
      }
    ];
  }
  else if(contextVar.subAction === "upsertListOptionAnswer") {
    jsonData = {};
    for (var key in contextVar.listOptionAnswer) {
      if(key === "recver") {
        continue;
      } else {
        jsonData[key] = contextVar.listOptionAnswer[key];
      }
    }
    contextVar.jsonObj.push(jsonData);
  }
}