{
  contextVar.jsonObj = [];
  if(contextVar.subAction === "upsertHoliday") {
    jsonData = {};
    for (var key in contextVar.holiday) {
      if(key === "recver") {
        continue;
      } else {
        jsonData[key] = contextVar.holiday[key];
      }
    }
    contextVar.jsonObj.push(jsonData);
  } else if(contextVar.subAction === "deleteHoliday") {
    contextVar.jsonObj = [
      {
        "id": contextVar.holiday.id,
        "recver": contextVar.holiday.recver
      }
    ];
  }
}