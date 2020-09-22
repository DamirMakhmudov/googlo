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
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token'
  };
  let res = await fetch(url, {
    method: 'POST',
    body:JSON.stringify(payload)
  });
  return await res.json();
}

async function readGoogleData(spreadSheetId, sheet, range){    
  let url = "https://sheets.googleapis.com/v4/spreadsheets/" + spreadSheetId + "/values/" + sheet + "!" + range + "?majorDimension=ROWS";
  let res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken
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
      'Authorization': 'Bearer ' + accessToken
    },
    body:JSON.stringify(obj)
  });
  return await res.json();
}

// ---draft---

function testo(){
  var sc = document.createElement('script');
  sc.type = "text/javascript";
  testo2().then((data) => {
  sc.innerHTML = data;
    document.head.appendChild(sc);
  });
}

async function testo2(){
  let url = "https://raw.githubusercontent.com/DamirMakhmudov/googlo/master/googlo.js";
  let res = await fetch(url, {
    method: 'GET'
  });
  return await res.text();
}