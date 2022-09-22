{
    contextVar.jsonObj = [];
   if (contextVar.subAction === "deleteCatalog") {
        contextVar.jsonObj = [{
            "id": contextVar.catalog.id,
            "recver": contextVar.catalog.recver
        }];
    }
   else if (contextVar.subAction === "upsertCatalog") {
        jsonData = {};
        for (var key in contextVar.catalog) {
            if (key === "recver") {
                continue;
            } else {
                jsonData[key] = contextVar.catalog[key];
            }
        }
        contextVar.jsonObj.push(jsonData);
    }
}