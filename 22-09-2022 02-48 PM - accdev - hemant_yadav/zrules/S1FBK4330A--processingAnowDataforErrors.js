var nullable = {
  "orderedByCustomId": true,
  "orderedByName": false,
  "orderedByAddress": false,
  "orderedByAddressTwo": true,
  "orderedByCity": false,
  "orderedByState": false,
  "orderedByZipCode": false,
  "orderedByCountry": false,
  "orderedByContactPhone": true,
  "addressedToCustomId": true,
  "addressedToName": false,
  "fileNumber": false,
  "contactFirstName": true,
  "contactLastName": true,
  "contactPhone": true,
  "contactEmail": true,
  "address": false,
  "addressTwo": true,
  "city": false,
  "state": false,
  "zipCode": false,
  "primaryAppraiser": false,
  "reportType": false,
  "loanType": false,
  "orderDate": true,
  "dueDate": true,
  "contractValue": true,
  "tags": true,
  "primaryReviewer": true,
  "appointmentDate": true,
  "processStatus": true
};

var datesArray = ['orderDate','dueDate','appointmentDate'];

for(var k in datesArray) {
    if (typeof contextVar.data[datesArray[k]] != 'undefined' && contextVar.data[datesArray[k]] != "" && new Date(contextVar.data[datesArray[k]]) != "Invalid Date") {
        contextVar.data[datesArray[k]] = new Date(contextVar.data[datesArray[k]]).toISOString().replace(/T/, ' ').replace(/\\..+/, '').replace(/Z/, '');
    } else {
      if (contextVar.data[datesArray[k]] != "") {
        if (contextVar.data.error!='') {
          contextVar.data.error += '|';
        }
        contextVar.data.error += ' '+datesArray[k]+' is Invalid';
      }
      contextVar.data[datesArray[k]] = null;
    }
}

count = 0;
var errNulls = [];
for (var x in nullable) {
  if (x!="error" && !nullable[x] && (typeof contextVar.data[x] == 'undefined' || contextVar.data[x] == '')) {
    errNulls.push(x);
    count++;
  }
}
if (count>0) {
  if (contextVar.data.error!='') {
    contextVar.data.error += '|';
  }
  contextVar.data.error += errNulls.join(', ')+" should not be empty";
}
if ((typeof contextVar.data.contactPhone == 'undefined' || contextVar.data.contactPhone == '') && (typeof contextVar.data.contactEmail == 'undefined' || contextVar.data.contactEmail == '')) {
  if (contextVar.data.error!='') {
    contextVar.data.error += '|';
  }
  contextVar.data.error += " Both contactPhone and contactEmail cannot be empty";
}