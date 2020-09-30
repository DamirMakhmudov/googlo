var ci, cs, rt, at;

/* AUTHORIZATION */

function getCredentials(){
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
  let payload = {
    client_id: ci,
    client_secret: cs,
    refresh_token: rt,
    grant_type: 'refresh_token'
  };
  let res = await fetch(url, {
    method: 'POST',
    body:JSON.stringify(payload)
  });
  let resJson = await res.json();
  at = resJson.access_token;
}

/* READ */

async function readRows(spreadSheetId, sheetName, rowS, rowE){ 
  await getAccessToken();
  let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadSheetId}/values/${sheetName}!A${rowS}:ZZ${rowE}?majorDimension=ROWS`;
  let res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + at
    }
  });
  let resJson = await res.json();
  return resJson.values;
}

// using batch
async function readRange(spreadSheetId, sheetIndex, rowS, rowE, colS, colE){
  try{
    await getAccessToken();
    var grid = {
      "sheetId": sheetIndex,
      "startRowIndex": rowS - 1,
      "endRowIndex": rowE,
      "startColumnIndex": colS - 1,
      "endColumnIndex": colE
    }
    var dataFilter = {
      "gridRange": grid
    };
    
    var url = "https://sheets.googleapis.com/v4/spreadsheets/" + spreadSheetId + "/values:batchGetByDataFilter";
    var req = {
      "dataFilters": [
        dataFilter
      ],
      "majorDimension": "ROWS",
      "valueRenderOption": "FORMATTED_VALUE"
      // "dateTimeRenderOption": ""
    };
    let res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + at
      },
      body: JSON.stringify(req)
    });
    let resJson = await res.json();
    return resJson.valueRanges[0].valueRange.values;
  }catch(e){
    console.error(e);
  }
}

async function getSheets(spreadSheetId){
  try{
    await getAccessToken();
    var url = "https://sheets.googleapis.com/v4/spreadsheets/" + spreadSheetId;
    
    var req = {
      "spreadsheetId":spreadSheetId
    };
    let res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + at
      }
    });
    let resJson = await res.json();
    return resJson.sheets
  }catch(e){
    console.error(e);
  }
}

/* WRITE */

async function writeRows(spreadSheetId, sheetName, rowS, rowE, values){
  await getAccessToken();
  var url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadSheetId}/values/${sheetName}!A${rowS}:ZZ${rowE}?valueInputOption=USER_ENTERED`;
  var obj = {
    "range": `${sheetName}!A${rowS}:ZZ${rowE}`,
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

async function batchUpdate(spreadSheetId, requests){
  try{
    await getAccessToken();
    var url = "https://sheets.googleapis.com/v4/spreadsheets/" + spreadSheetId + ":batchUpdate";
    var req = {
      "requests": requests,
      "includeSpreadsheetInResponse": false
        // "responseRanges": [
        // string
        // ],
        // "responseIncludeGridData": 
    };
    let res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + at
      },
      body: JSON.stringify(req)
    });
    return res.status;
  }catch(e){
    console.error(e);
  }
}

function pasteO(sheetIndex, row, column, value){
  return {
      "pasteData":{
        "coordinate": {
          "sheetId": sheetIndex,
          "rowIndex": row-1,
          "columnIndex": column-1
        },
      "data": value,
      "type": "PASTE_NORMAL",
      "delimiter": "#"
      // "html": true
    }
  }
}

function insertRangeO(sheetIndex, row, count){
  return {
    "insertRange":{
      "range":{
        "sheetId": sheetIndex,
        "startRowIndex": row - 1,
        "endRowIndex": row + count - 1,
        "startColumnIndex": 0,
        "endColumnIndex": 100
      },
      "shiftDimension":"ROWS"
    }
  }
}

function replaceO(sheetIndex, input, output){
  return {
    "findReplace":{
      "find": input,
      "replacement": output,
      "matchCase": false,
      "matchEntireCell": false,
      "searchByRegex": false,
      "includeFormulas": false,
      "sheetId": sheetIndex,
    }
  }
}

async function batchUpdateValues(spreadSheetId, requests){
  try{
    await getAccessToken();
    var url = "https://sheets.googleapis.com/v4/spreadsheets/" + spreadSheetId + "/values:batchUpdate";
    var req = {
      "valueInputOption": "USER_ENTERED",
      "data": requests,
      "includeValuesInResponse": false,
      "responseValueRenderOption": "FORMATTED_VALUE"
      // "responseDateTimeRenderOption": enum (DateTimeRenderOption)
    }
    let res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + at
      },
      body: JSON.stringify(req)
    })
    return res.status;
  }catch(e){
    console.error(e);
  }
}

function prepareO(sheetName, row, obj){
  return {
    "range": `${sheetName}!A${row}:ZZ${row}`,
    "majorDimension": "ROWS",
    "values": [
      obj  
    ]
  }
}