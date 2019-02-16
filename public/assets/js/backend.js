var btn = document.getElementById('submit');
var upload = document.getElementById('customFile');
var imgToDelete = {};
var modalDelete = document.getElementById('modalDelete');

modalDelete.addEventListener('click', function () {
  httpPost('deleteImg', 'application/json', imgToDelete, (res) => {
    imgToDelete = {};
    getCurrent();
  })
});

upload.addEventListener('input', function () {
  uploadPic();
})

btn.addEventListener('click', function (e) {
  sendPass();
})

function sendPass() {
  var pass = document.getElementById('pass').value;
  pass = JSON.stringify({ pass: btoa(pass) })
  httpPost('pass', 'application/json', pass, (res) => {
    showBackend();
    getCurrent();
  });
}

function getCurrent() {
  httpGet('photos', (photos) => {
    var photoArray = JSON.parse(photos);
    var imgHolder = document.getElementById('currentImgs');
    var imgs = buildImgDivs(photoArray)
    imgHolder.innerHTML = imgs;
  })
}

function saveBtnClick(i) {
  var datObject = {
    data: {
      name: document.getElementById('nameInput' + i).value,
      link: document.getElementById('linkInput' + i).value,
      size: document.getElementById('sizeInput' + i).value,
      path: document.getElementById('img' + i).getAttribute('src').split('/')[2]
    },
    index: i
  }
  console.log(datObject)
  httpPost('newImgData', 'application/json', JSON.stringify(datObject), (res) => {

  })
}

function deleteBtnClick(index) {
  var src = document.getElementById('img' + index).getAttribute('src');
  var modalImg = document.getElementById('modalImg');
  modalImg.setAttribute('src', src);
  src = JSON.stringify({ src: src, index: index })
  imgToDelete = src;
}

function uploadPic(files) {
  var photo = document.getElementById('customFile').files[0];
  var formData = new FormData();
  formData.append('photo', photo);
  httpPost('newPhoto', false, formData, (res) => {
    getCurrent()
  })
}


function buildImgDivs(photoArray) {
  var photos = photoArray.map((el, i) => {
    return (
      `<div class='text-left'>
        <img id='img${i}' src='/currentStyles/${el.path}'/>
        <label> Name</label>
        <input id='nameInput${i}' class='form-control' value='${el.name}'/>
        <label>Size</label>
        <input id='sizeInput${i}' class='form-control' value='${el.size}'/>
        <label>Link</label>
        <input id='linkInput${i}' class='form-control' value='${el.link}'/>
        <button class='btn btn-info' onclick='saveBtnClick(${i})'>Save</button>
        <button class='btn btn-danger' data-toggle='modal' data-target='#deleteModal' onclick='deleteBtnClick(${i})'>Delete</button>
      </div>`
    )
  })
  console.log(photos)
  return photos.join('')
}

function showBackend() {
  document.getElementById("enter").style.display = 'none';
  document.getElementById("backendHeader").style.display = 'block';
  document.getElementById('mainBackend').style.display = 'block';
}

