{
    if(contextVar.subAction === 'upsertCustomerSite' || contextVar.subAction === 'reactivateCustomerSite' || contextVar.subAction === 'deactivateCustomerSite' || contextVar.subAction === 'upsertStockLocation') {
        contextVar.jsonObj = [];
        for(var index in contextVar.site) {
            jsonData = {};
            for(var key in contextVar.site[index]) {
                if(key === "recver") {
                    continue;
                } else {
                    jsonData[key] = contextVar.site[index][key];
                }
            }
            contextVar.jsonObj.push(jsonData);
        }
    }
}