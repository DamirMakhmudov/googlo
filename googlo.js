var ci, cs, rt, at;

function getCredentials(){
  console.log('---getCredentials---')
  google.script.run.withSuccessHandler(
    function (credentials){
      ci = credentials.clientId;
      cs = credentials.clientSecret;
      rt = credentials.refreshToken;
    }
  ).getCredentials();
}

async function getAccessToken(){
  let url = 'https://oauth2.googleapis.com/token';
  var payload = {
    client_id: ci,
    client_secret: cs,
    refresh_token: rt,
    grant_type: 'refresh_token'
  };
  let res = await fetch(url, {
    method: 'POST',
    body:JSON.stringify(payload)
  });
  return await res.json()
}

async function pasteData(spreadSheetId, requests){
    at = await getAccessToken();
    at = at.access_token;
    var rrr = [];
    var tt = batchUpdate(spreadSheetId, requests);
    return tt;
}

async function batchUpdate(spreadSheetId, requests){
  var url = "https://sheets.googleapis.com/v4/spreadsheets/" + spreadSheetId + ":batchUpdate";

  var req = {
      "requests": requests
      // "includeSpreadsheetInResponse": false
      // "responseRanges": [
          // string
      // ],
      // "responseIncludeGridData": 
  }

  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + at
    },
    body:JSON.stringify(req)
  });
  return res.status;
//   return await res.json();
}

// find and replace
// "findReplace":{
//     "find": "Alice",
//     "replacement": "Pol",
//     "matchCase": false,
//     "matchEntireCell": false,
//     "searchByRegex": false,
//     "includeFormulas": false,
//     "sheetId": 0,
// }

async function readGoogleData(spreadSheetId, sheet, range){    
  let url = "https://sheets.googleapis.com/v4/spreadsheets/" + spreadSheetId + "/values/" + sheet + "!" + range + "?majorDimension=ROWS";
  let res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + at
    }
  });
  return await res.json();
}

async function putGoogleData(spreadSheetId, sheet, range, values){
  var url = "https://sheets.googleapis.com/v4/spreadsheets/" + spreadSheetId + "/values/" + sheet + "!" + range + "?valueInputOption=USER_ENTERED";
  var obj = {
    "range": sheet + "!" + range,
    "majorDimension": "ROWS",
    "values": values
  }   
  let res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + at
    },
    body:JSON.stringify(obj)
  });
  return await res.json();
}