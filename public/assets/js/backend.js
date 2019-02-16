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
    console.log(photoArray)
    var imgHolder = document.getElementById('currentImgs');
    var imgs = document.createDocumentFragment();
    imgHolder.innerHTML = '';
    photoArray.forEach(el => {
      buildImgDivs(imgs, el)
    })
    imgHolder.appendChild(imgs);
  })
}



function deleteBtnClick(e) {
  var src = e.target.previousSibling.getAttribute('src');
  var modalImg = document.getElementById('modalImg');
  modalImg.setAttribute('src', src);
  src = JSON.stringify({ src: src })
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


function buildImgDivs(imgs, el) {
  var imgDiv = document.createElement('div');
  var img = document.createElement('img');
  var deleteBtn = document.createElement('button');
  var saveBtn = document.createElement('button');
  var nameInput = document.createElement('input');
  var sizeInput = document.createElement('input');
  var linkInput = document.createElement('input');

  nameInput.setAttribute('id', 'nameInput');
  sizeInput.setAttribute('id', 'sizeInput');
  linkInput.setAttribute('id', 'linkInput');
  nameInput.value = el.name;
  sizeInput.value = el.size;
  linkInput.value = el.link;

  saveBtn.classList = 'btn btn-success';
  saveBtn.innerText = 'Save';
  deleteBtn.classList = "btn btn-danger ";
  deleteBtn.innerText = "Delete ";
  deleteBtn.addEventListener('click', deleteBtnClick);
  deleteBtn.setAttribute('data-toggle', 'modal');
  deleteBtn.setAttribute('data-target', '#deleteModal');
  img.setAttribute('src', `/currentStyles/${el.path}`);
  imgDiv.appendChild(img);
  imgDiv.appendChild(nameInput);
  imgDiv.appendChild(sizeInput);
  imgDiv.appendChild(linkInput);
  imgDiv.appendChild(deleteBtn);
  imgDiv.appendChild(saveBtn);
  imgs.appendChild(imgDiv);
}

function showBackend() {
  document.getElementById("enter").style.display = 'none';
  document.getElementById("backendHeader").style.display = 'block';
  document.getElementById('mainBackend').style.display = 'block';
}

