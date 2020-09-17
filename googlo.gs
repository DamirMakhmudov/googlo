function setCredentials(){
  let credentials = {
    'clientId':'your client id',
    'clientSecret':'your client secret',
    'refreshToken':'your refreshtoken'
  }
  PropertiesService.getScriptProperties().setProperty('credentials', JSON.stringify(credentials));
}

function getCredentials(){
  return JSON.parse(PropertiesService.getScriptProperties().getProperty('credentials'));
}