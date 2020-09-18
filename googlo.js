var at, ci, cs, rt;

function getCredentials(){
    console.log('---getCredentials---4')
    google.script.run.withSuccessHandler(
      function (credentials){
        console.log(credentials);
        ci = credentials.clientId;
        cs = credentials.clientSecret;
        rt = credentials.refreshToken;
      }
    ).getCredentials();
  }

// function readGoogleData_old(spreadSheetId, sheet, range){    
//     console.log('---readGoogleData---');
//     var url = "https://sheets.googleapis.com/v4/spreadsheets/" + spreadSheetId + "/values/" + sheet + "!" + range + "?majorDimension=ROWS";
//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", url);
//     xhr.setRequestHeader('Authorization','Bearer ' + at);
//     xhr.send();
//     xhr.onload = function(){
//         console.log(xhr.status);
//         console.log(xhr.statusText);
//         console.log(xhr.response);
//     }
//  }

// function geToken_old(){
//     console.log('---getat--');
//     var clientId = '26731186254-odugkqn68d6d1g6tj3kjpvf299vk9e95.apps.googleusercontent.com';
//     var clientSecret = 'E44LiAGNh1uCLT4HRINzjJbM';
//     var refreshToken = '1//04u7UiETSPmfHCgYIARAAGAQSNwF-L9IrvvzDfyINUWLOiZwvfBa-AulQ_SO6wsuIDef_8L7PTcM4q_YPZVwsd2zE1iggbj1Qnts';
//     var url = 'https://oauth2.googleapis.com/token';
//     var payload = {
//         client_id: clientId,
//         client_secret: clientSecret,
//         refresh_token: refreshToken,
//         grant_type: 'refresh_token'
//     };
//     var xhr = new XMLHttpRequest();
//     xhr.open("POST", url);
//     xhr.send(JSON.stringify(payload));
//         xhr.onload =  function(){
//         at = JSON.parse(xhr.responseText).access_token;
//     }
// }