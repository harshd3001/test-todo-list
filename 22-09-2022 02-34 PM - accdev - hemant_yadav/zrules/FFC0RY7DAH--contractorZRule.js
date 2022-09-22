{
  contextVar.jsonObj = [];
  if(contextVar.subAction == "upsertContractor") {
    jsonData = {};
    for (var key in contextVar.contractor) {
      if(key === "recver") {
        continue;
      } else {
        jsonData[key] = contextVar.contractor[key];
      }
    }
    contextVar.jsonObj.push(jsonData);
  } else if(contextVar.subAction == "deleteContractor") {
    contextVar.jsonObj = [
      {
        "id": contextVar.contractor.id,
        "recver": contextVar.contractor.recver
      }
    ];
  }
}