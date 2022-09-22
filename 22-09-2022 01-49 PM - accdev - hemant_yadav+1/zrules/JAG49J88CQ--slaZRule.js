{
  contextVar.jsonObj = [];
  if(contextVar.subAction === 'deleteSla') {
    contextVar.jsonObj = [{
      "id": contextVar.sla.id,
      "recver": contextVar.sla.recver

    }];
  }
  else if(contextVar.subAction === "upsertSla") {
    jsonData = {};
    for (var key in contextVar.sla) {
      if(key === "recver") {
        continue ;
      } else {
        jsonData[key] = contextVar.sla[key];
      }
    }
    contextVar.jsonObj.push(jsonData);
  }
}