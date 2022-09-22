{
  contextVar.jsonObj = [];
if(contextVar.subAction === "deleteListOption") {
    contextVar.jsonObj = [
      {
        "id": contextVar.listOption.id,
        "recver": contextVar.listOption.recver
      }
    ];
  }
  else if(contextVar.subAction === "upsertListOption") {
    jsonData = {};
    for (var key in contextVar.listOption) {
      if(key === "recver") {
        continue;
      } else {
        jsonData[key] = contextVar.listOption[key];
      }
    }
    contextVar.jsonObj.push(jsonData);
  }
}