{
  contextVar.jsonObj = [];
  if(contextVar.subAction == "deleteContractorRegion") {
    contextVar.jsonObj = [
      {
        "id": contextVar.contractorRegion.id,
        "recver": contextVar.contractorRegion.recver
      }
    ];
  } else if(contextVar.subAction == "upsertContractorRegion") {
    jsonData = {};
    for (var key in contextVar.contractorRegion) {
      if(key === "recver") {
        continue;
      } else {
        jsonData[key] = contextVar.contractorRegion[key];
      }
    }
    contextVar.jsonObj.push(jsonData);
  }
}