{
  contextVar.jsonObj = [];
  if(contextVar.subAction === "upsertContractorWorkforce") {
    jsonData = {};
    for (var key in contextVar.contractorWorkforce.selectedRowIds) {
      jsonData = {
        "contractorRegionId": contextVar.contractorWorkforce.selectedRowIds[key].contractorRegionId,
        "workforceId": contextVar.contractorWorkforce.workforceId
      };
      contextVar.jsonObj.push(jsonData);
    }
  }
}