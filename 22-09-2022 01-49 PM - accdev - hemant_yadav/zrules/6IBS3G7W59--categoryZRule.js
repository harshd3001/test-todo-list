{
  contextVar.jsonObj = [];
  if(contextVar.subAction === "upsertCategory") {
    jsonData = {};
    for (var key in contextVar.category) {
      if(key === "recver") {
        continue;
      } else {
        jsonData[key] = contextVar.category[key];
      }
    }
    contextVar.jsonObj.push(jsonData);
  } else if(contextVar.subAction === "deleteCategory") {
    contextVar.jsonObj = [
      {
        "id": contextVar.category.id,
        "recver": contextVar.category.recver
      } 
    ];
  }
}