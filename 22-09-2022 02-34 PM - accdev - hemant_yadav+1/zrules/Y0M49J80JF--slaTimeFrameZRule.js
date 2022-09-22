{

    contextVar.jsonObj = [];
    if(contextVar.subAction === 'deleteSlaTimeFrame') {
        contextVar.jsonObj = [{
            "slaId": contextVar.slaTimeFrame.slaId,
            "recver": contextVar.slaTimeFrame.recver,
            "priorityPriority": contextVar.slaTimeFrame.priorityPriority
        }];
    }
    else if(contextVar.subAction === "upsertSlaTimeFrame") {
        jsonData = {};
        for (var key in contextVar.slaTimeFrame) {
          if(key === "recver") {
            continue;
          } else {
            jsonData[key] = contextVar.slaTimeFrame[key];
          }
        }
        contextVar.jsonObj.push(jsonData);
      }
    
}