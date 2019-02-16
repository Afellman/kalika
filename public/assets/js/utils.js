
function httpGet(url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/backend/' + url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log(xhr);
      cb(xhr.responseText);
    } else if (xhr.status !== 200) {
      alert('Request failed.  Returned status of ' + xhr.status);
    }
  };
  xhr.send()
}

function httpPost(url, contentType, data, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/backend/' + url);
  contentType ? xhr.setRequestHeader('Content-Type', contentType) : null;
  xhr.onload = function () {
    if (xhr.status === 200) {
      cb(xhr.response);
    } else if (xhr.status == 401) {
      document.write("NOT ALLOWED ");
    } else if (xhr.status == 413) {
      alert("File too big dong! ")
    } else if (xhr.status !== 200) {
      alert('Request failed.  Returned status of ' + xhr.status);
    }

  };
  xhr.send(data);
}