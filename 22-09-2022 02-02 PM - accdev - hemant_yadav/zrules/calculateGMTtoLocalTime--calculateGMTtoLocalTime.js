function formatDate(date) {
	if (date) {	
		var d = new Date(new Date(date).getTime() - contextVar.siteTimeZone * 60 * 1000);
	
		return (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) + '-' + (parseInt(d.getMonth() + 1) < 10 ? '0' + parseInt(d.getMonth() + 1) : parseInt(d.getMonth() + 1)) + '-' + d.getFullYear() + ' ' + (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + ':' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + ': 00.000';
	} else {
		return '-';
	}
}