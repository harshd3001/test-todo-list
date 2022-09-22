function findLocalizedString(locale, localizeTxt, defaultTxt) {
    let text = defaultTxt;
    let statusObj = contextVar.landingStatuses[contextVar.workOrderTaskStatusId][contextVar.foundInStatus];
    if (statusObj && Array.isArray(statusObj.replaceStr) && statusObj.replaceStr.length > 0) {
        if (contextVar.responseData[locale] && statusObj[localizeTxt] && contextVar.responseData[locale][statusObj[localizeTxt]]) {
            text = contextVar.responseData[locale][statusObj[localizeTxt]];
        }
        statusObj.replaceStr.forEach((el) => {
            let parsedData = el.replace(/^{@/, '').replace(/}$/, '');
            text = text.replace(el, contextVar[parsedData]);
        });
    }
    return text;
}

contextVar.currentUserId = contextVar.loop_currentElement;
contextVar.modifiedUser = (Array.isArray(contextVar.modifiedUserData) && contextVar.modifiedUserData.length > 0 && (typeof contextVar.modifiedUserData[0].name !== 'undefined' && contextVar.modifiedUserData[0].name !== '')) ? contextVar.modifiedUserData[0].name : contextVar.modifiedByUser;

let currUser = contextVar.currentUserId;
contextVar.inShortText = contextVar.shortText;
contextVar.inLongText = contextVar.longText;
if (typeof contextVar.preferenceData !== 'undefined' && contextVar.preferenceData !== '' && typeof contextVar.preferenceData[currUser] !== 'undefined') {
    let prefLocale = contextVar.preferenceData[currUser].userLocale.toLocaleLowerCase();
    if (prefLocale) {
        contextVar.inShortText = findLocalizedString(prefLocale, contextVar.localizedStrings['shortText'], contextVar.shortText);
        contextVar.inLongText = findLocalizedString(prefLocale, contextVar.localizedStrings['longText'], contextVar.longText);
    }
}

contextVar.inputData = {
    'longText': contextVar.inLongText,
    'shortText': contextVar.inShortText
};