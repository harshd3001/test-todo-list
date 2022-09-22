{
  contextVar.jsonObj = [];
  if(contextVar.subAction === 'upsertWorkOrderType') {
    jsonData = {};
    for (var key in contextVar.workOrderType) {
      if(key === "recver"){
        continue;
      } else {
        jsonData[key] = contextVar.workOrderType[key];
      }
    }
    contextVar.jsonObj.push(jsonData);
  }
  else if(contextVar.subAction==='reactivateWorkOrderType' || contextVar.subAction==='deactivateWorkOrderType'){
    contextVar.jsonObj = [  {
      'id':contextVar.workOrderType.id,
      'statusId':contextVar.workOrderType.statusId
    }];
  }
}