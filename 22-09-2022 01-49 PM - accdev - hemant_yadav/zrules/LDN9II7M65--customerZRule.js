{
  contextVar.jsonObj = [ ];
  if(contextVar.subAction === "upsertCustomer" || contextVar.subAction==='reactivateCustomer' || contextVar.subAction==='deactivateCustomer') {
    jsonData = {};
    for (var key in contextVar.customer) {
      if(key === "recver") {
        continue;
      } else {
        jsonData[key] = contextVar.customer[key];
      }
    }
    contextVar.jsonObj.push(jsonData);
  }
}