{
  contextVar.jsonObj = [];
  if(contextVar.subAction === "upsertSubRegion") {
    jsonData = {};
    for (var key in contextVar.subRegion) {
      if(key === "recver") {
        continue;
      } else {
        jsonData[key] = contextVar.subRegion[key];
      }
    }
    contextVar.jsonObj.push(jsonData);
  } else if(contextVar.subAction === "deleteSubRegion") {
    contextVar.jsonObj = [
      {
        "id": contextVar.subRegion.id,
        "recver": contextVar.subRegion.recver
      }
    ];
  }
}