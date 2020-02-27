var btn = document.getElementById('submit');
var upload = document.getElementById('customFile');
var imgToDelete = {};
var modalDelete = document.getElementById('modalDelete');
var blog = [];
var isUpdate = false;
var updateBlog = {};

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
      `<div class='text-left col-md-2'>
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


var quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'align': [] }],
      ['clean']                                         // remove formatting button
    ]
  }
});

httpGet("blog", blogToDom);

function blogToDom(res) {
  const parsed = JSON.parse(res);
  blog = parsed;
  const div = document.getElementById('prevPosts');
  const html = blog.map((post, i) => {
    return `<li onclick="loadBlog(${i})">"${post.title}"<br/> ${post.date}</li>`
  }).join("");
  div.innerHTML = html;
}


document.getElementById("cancelBlog").addEventListener("click", freshBlog);
document.getElementById("deleteBlog").addEventListener("click", () => {
  let del = confirm("Are you sure you want to delete this post?");
  if (del) {
    deleteBlog();
  }
});


document.getElementById("submitBlog").addEventListener("click", () => {
  const newBody = quill.root.innerHTML;
  const title = document.getElementById("blogTitle").value;

  if (isUpdate) {
    blog[updateBlog.num].body = newBody
    blog[updateBlog.num].title = title
  } else {
    const newPost = {
      "date": new Date().toUTCString(),
      "title": title,
      "body": newBody,
      "id": makeSudoGUID()
    }
    blog.push(newPost);
  }

  httpPost("blog", "application/json", JSON.stringify(blog), () => {
    alert(isUpdate ? "Post Updated" : "New post submitted");
    freshBlog();
    httpGet("blog", blogToDom);
  })
})

function freshBlog() {
  document.getElementById('submitBlog').innerText = "Submit";
  isUpdate = false;
  updateBlog = {};
  quill.root.innerHTML = "What's on your mind?";
  document.getElementById('blogTitle').value = "";
  document.getElementById('cancelBlog').style.display = "none";
  document.getElementById('deleteBlog').style.display = "none";
}

function loadBlog(i) {
  document.getElementById('submitBlog').innerText = "Update";
  document.getElementById('cancelBlog').style.display = "inline-block";
  document.getElementById('deleteBlog').style.display = "inline-block";
  document.getElementById('blogTitle').value = blog[i].title;
  isUpdate = true;

  updateBlog = { num: i, post: blog[i] };
  quill.root.innerHTML = blog[i].body;
}

function deleteBlog() {
  blog.splice(updateBlog.num, 1);
  httpPost("blog", "application/json", JSON.stringify(blog), () => {
    alert("Post Deleted");
    freshBlog();
    httpGet("blog", blogToDom);
  })
}


function makeSudoGUID() {
  let newGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  return newGuid;
}