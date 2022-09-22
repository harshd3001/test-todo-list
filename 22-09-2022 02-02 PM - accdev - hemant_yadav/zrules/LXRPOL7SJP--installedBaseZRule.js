{
    if(contextVar.subAction === 'upsertInstalledBase' || contextVar.subAction === 'deactivateInstalledBase') {
        contextVar.jsonObj = [ ];
        for (var index in contextVar.installedBase) {
            jsonData = {};
            for (var key in contextVar.installedBase[index]) {
                if(key === "recver") {
                    continue;
                } else {
                    jsonData[key] = contextVar.installedBase[index][key];
                }
            }
            contextVar.jsonObj.push(jsonData);
        }
    }
  }