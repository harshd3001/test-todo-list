{
  contextVar.jsonObj = [];
  if(contextVar.subAction === "upsertRegion") {
    jsonData = {};
    for (var key in contextVar.region) {
      if(key === "recver") {
        continue;
      } else {
        jsonData[key] = contextVar.region[key];
      }
    }
    contextVar.jsonObj.push(jsonData);
  } else if(contextVar.subAction === "deleteRegion") {
    contextVar.jsonObj = [
      {
        "id": contextVar.region.id,
        "recver": contextVar.region.recver
      }
    ];
  }
}