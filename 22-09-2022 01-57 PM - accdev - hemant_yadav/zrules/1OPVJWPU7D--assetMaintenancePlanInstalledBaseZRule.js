function getAssetsToBeDeleted(selectedAssets) {
	contextVar.assetsToDelete = contextVar.assetMaintenancePlanInstalledBaseData.filter(asset => !selectedAssets.some(selectedAsset => selectedAsset.value === asset.installedBaseId));
}

function getAssetsToBeInserted(selectedAssets) {
	contextVar.assetsToInsert = selectedAssets.reduce((result, selectedAsset) => { if (!contextVar.assetMaintenancePlanInstalledBaseData.some(asset => asset.installedBaseId === selectedAsset.value)) { result.push(createJsonObject(selectedAsset)) } return result }, []);
}

function createJsonObject(selectedAsset) {
	return ({ "assetMaintenancePlanId": contextVar.assetMaintenancePlanId, "installedBaseId": selectedAsset.value });
}

{
	contextVar.assetsToInsert = [];
	contextVar.assetsToDelete = [];
	if (typeof contextVar.selectedAssets !== 'undefined' && contextVar.selectedAssets !== '' && Array.isArray(contextVar.selectedAssets) && contextVar.selectedAssets.length > 0) {
		if (contextVar.subAction === "upsertAssetMaintenancePlanInstalledBase") {
			if (typeof contextVar.assetMaintenancePlanInstalledBaseData !== 'undefined' && contextVar.assetMaintenancePlanInstalledBaseData !== '' && Array.isArray(contextVar.assetMaintenancePlanInstalledBaseData) && contextVar.assetMaintenancePlanInstalledBaseData.length > 0) {
				getAssetsToBeDeleted(contextVar.selectedAssets);
				getAssetsToBeInserted(contextVar.selectedAssets);
			} else {
				contextVar.assetsToInsert = contextVar.selectedAssets.map(selectedAsset => createJsonObject(selectedAsset));
			}
		}
	}
}