var accessToken;

function getAccessToken(){
    console.log('---getAccessToken---');
    var clientId = '26731186254-odugkqn68d6d1g6tj3kjpvf299vk9e95.apps.googleusercontent.com';
    var clientSecret = 'E44LiAGNh1uCLT4HRINzjJbM';
    var refreshToken = '1//04u7UiETSPmfHCgYIARAAGAQSNwF-L9IrvvzDfyINUWLOiZwvfBa-AulQ_SO6wsuIDef_8L7PTcM4q_YPZVwsd2zE1iggbj1Qnts';
    var url = 'https://oauth2.googleapis.com/token';
    var payload = {
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
    };
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.send(JSON.stringify(payload));
    // xhr.
    xhr.onload =  function(){
        // console.log('here');
        // console.log('access tiken', JSON.parse(xhr.responseText).access_token)
        accessToken = JSON.parse(xhr.responseText).access_token;
    }
}