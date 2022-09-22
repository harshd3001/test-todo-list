function getSitesToBeDeleted(selectedSites) {
	contextVar.sitesToDelete = contextVar.assetMaintenancePlanSiteData.filter(site => !selectedSites.some(selectedSite => selectedSite.value === site.siteId));
}

function getSitesToBeInserted(selectedSites) {
	contextVar.sitesToInsert = selectedSites.reduce((result, selectedSite) => { if (!contextVar.assetMaintenancePlanSiteData.some(site => site.siteId === selectedSite.value)) { result.push(createJsonObject(selectedSite)) } return result }, []);
}

function createJsonObject(selectedSite) {
	return ({ "assetMaintenancePlanId": contextVar.assetMaintenancePlanId, "siteId": selectedSite.value });
}

{
	contextVar.sitesToInsert = [];
	contextVar.sitesToDelete = [];
	if (typeof contextVar.selectedSites !== 'undefined' && contextVar.selectedSites !== '' && Array.isArray(contextVar.selectedSites) && contextVar.selectedSites.length > 0) {
		if (contextVar.subAction === "upsertAssetMaintenancePlanSite") {
			if (typeof contextVar.assetMaintenancePlanSiteData !== 'undefined' && contextVar.assetMaintenancePlanSiteData !== '' && Array.isArray(contextVar.assetMaintenancePlanSiteData) && contextVar.assetMaintenancePlanSiteData.length > 0) {
				getSitesToBeDeleted(contextVar.selectedSites);
				getSitesToBeInserted(contextVar.selectedSites);
			} else {
				contextVar.sitesToInsert = contextVar.selectedSites.map(selectedSite => createJsonObject(selectedSite));
			}
		}
	}
}