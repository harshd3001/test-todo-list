{
  contextVar.jsonObj = [];
  if(contextVar.subAction === "upsertManufacturer") {
    jsonData = {};
    for (var key in contextVar.manufacturer) {
        if(key === "recver") {
            continue;
        } else {
            jsonData[key] = contextVar.manufacturer[key];
        }
    }
    contextVar.jsonObj.push(jsonData);
  } else if(contextVar.subAction === "deleteManufacturer") {
    contextVar.jsonObj = [
      {
        "id": contextVar.manufacturer.id,
        "recver": contextVar.manufacturer.recver
      }
    ];
  } 
}