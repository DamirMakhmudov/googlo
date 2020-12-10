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
  at = (await res.json()).access_token;
}

/* READ */

async function jsonerO(headers, data){
  let rows = [];
  data.forEach((row, i) => {
    let obj = {};
    headers[0].forEach((col, j) => {
      obj[col] = row[j]
    });
    rows.push(obj);
  })
  return rows
}

async function readProperties(spreadSheetId){ 
  try{
    await getAccessToken();
    let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadSheetId}?includeGridData=true`;
    let res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${at}`
      }
    });
    return (await res.json())
  }catch(e){
    console.error(e);
  }
}

async function getSheets(spreadSheetId){
  try{
    await getAccessToken();
    var url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadSheetId}?includeGridData=false`;
    let res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${at}`
      }
    });
    return (await res.json()).sheets
  }catch(e){
    console.error(e);
  }
}

async function readRows2(spreadSheetId, sheetName, rowS, rowE){ 
  try{
    await getAccessToken();
    let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadSheetId}/values/${sheetName}!1:1?majorDimension=ROWS`;
    let res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${at}`
      }
    });
    let headers = (await res.json()).values;
    // console.log('headers', headers);

    rowE = rowS + rowE -1;
    let url2 = `https://sheets.googleapis.com/v4/spreadsheets/${spreadSheetId}/values/${sheetName}!A${rowS}:ZZ${rowE}?majorDimension=ROWS`;
    let res2 = await fetch(url2, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${at}`
      }
    });
    let data = (await res2.json()).values;
    // console.log('data', data);

    return (await jsonerO(headers, data))
  }catch(e){
    console.error(e);
  }
}

async function readRows(spreadSheetId, sheetName, rowS, rowE){ 
  try{
    await getAccessToken();
    let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadSheetId}/values/${sheetName}!A${rowS}:ZZ${rowE}?majorDimension=ROWS`;
    let res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${at}`
      }
    });
    return (await res.json()).values
  }catch(e){
    console.error(e);
  }
}

//!!!
async function readRange2(spreadSheetId, sheetName, rowS, rowE){
  try{
    await getAccessToken();

    var dataFilterHeader = {
      "a1Range": `${sheetName}!1:1`
    };

    var dataFilter = {
      "a1Range": `${sheetName}!A${rowS}:ZZ${rowS+rowE}`
    };

    var url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadSheetId}/values:batchGetByDataFilter`;
    var req = {
      "dataFilters": [
        dataFilterHeader,
        dataFilter
      ],
      "majorDimension": "ROWS",
      "valueRenderOption": "FORMATTED_VALUE"
      // "dateTimeRenderOption": ""
    };
    let res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${at}`
      },
      body: JSON.stringify(req)
    });
    let resJson = (await res.json());
    console.log(resJson);
    return
    console.log(resJson[0].valueRange.values);
    console.log(resJson[1].valueRange.values);
    return jsonerO(resJson[1].valueRange.values, resJson[0].valueRange.values)
  }catch(e){
    console.error(e);
  }
}

async function readRange(spreadSheetId, sheetIndex, rowS, colS, rowE, colE){
  try{
    await getAccessToken();
    var grid = {
      "sheetId": sheetIndex,
      "startRowIndex": rowS - 1,
      "endRowIndex": rowS + rowE,
      "startColumnIndex": colS - 1,
      "endColumnIndex": colS + colE
    }
    var dataFilter = {
      "gridRange": grid
    };
    var url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadSheetId}/values:batchGetByDataFilter`;
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
        'Authorization': `Bearer ${at}`
      },
      body: JSON.stringify(req)
    });
    // let resJson = await res.json();
    return (await res.json()).valueRanges[0].valueRange.values
  }catch(e){
    console.error(e);
  }
}

/* WRITE */

async function appendRows(spreadSheetId, sheetName, values){
  await getAccessToken();
  var url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadSheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED`;
  var req = {
    "values": values
  }   
  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${at}`
    },
    body: JSON.stringify(req)
  });
  let resJson = await res.json();
  return resJson;
}

async function batchUpdate(spreadSheetId, requests){
  try{
    await getAccessToken();
    var url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadSheetId}:batchUpdate`;
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
        'Authorization': `Bearer ${at}`
      },
      body: JSON.stringify(req)
    });
    return res.status;
  }catch(e){
    console.error(e);
  }
}

function pasteData(sheetIndex, row, column, value){
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

function insertDimension(sheetIndex, row, count){
  return {
    "insertDimension":{
      "range": {
        "sheetId": sheetIndex,
        "dimension": "ROWS",
        "startIndex": row,
        "endIndex": row + count
      },
      "inheritFromBefore": true
    }
  }
}

function findReplace(sheetIndex, input, output){
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
        'Authorization': `Bearer ${at}`
      },
      body: JSON.stringify(req)
    })
    return res.status;
  }catch(e){
    console.error(e);
  }
}

function valueRange(sheetName, row, obj){
  return {
    "range": `${sheetName}!A${row}`,
    "majorDimension": "ROWS",
    "values": [obj]
  }
}

async function writeRows(spreadSheetId, sheetName, rowS, values){
  await getAccessToken();
  rowE = rowS + values.length-1;
  // var url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadSheetId}/values/${sheetName}!${rowS}:${rowE}?valueInputOption=USER_ENTERED`;
  var url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadSheetId}/values/${sheetName}!A${rowS}?valueInputOption=USER_ENTERED`;
  var req = {
    // "range": `${sheetName}!${rowS}:${rowE}`,
    "range": `${sheetName}!A${rowS}`,
    "majorDimension": "ROWS",
    "values": values
  }   
  let res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${at}`
    },
    body:JSON.stringify(req)
  });
  let resJson = await res.json();
  return resJson;
}