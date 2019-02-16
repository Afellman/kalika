var isSmall;
var ham = document.getElementsByClassName('ham');


ham[0].addEventListener("click", function (e) {
  if (!ham[0].classList.contains('clicked')) {
    showHideMobileNav("show");
    ham[0].classList.add("clicked")
  } else {
    ham[0].classList.remove("clicked");
    showHideMobileNav("hide");
  }
})

httpGet('allNames', (res) => {
  var photoHolder = document.getElementById('currentStyles');
  var imgs = document.createDocumentFragment();
  var textArray = JSON.parse(res);
  textArray.forEach(photo => {
    var col = document.createElement('div');
    var img = document.createElement('img');
    var a = document.createElement('a');
    var text = document.createElement('p');

    col.classList = 'col-md-4 text-center';
    img.setAttribute('src', 'currentStyles/' + photo);
    img.classList.add('Row-image');
    text.innerText = photo.split('.')[0];
    a.setAttribute('href', '#');

    col.appendChild(img);
    col.appendChild(text);
    imgs.appendChild(col);
  })
  photoHolder.appendChild(imgs);
})

function showHideMobileNav(showHide) {
  var pos;
  var navMobile = document.getElementById('NavMobile');
  var nav = document.getElementById('Nav');
  if (showHide == "show") {
    pos = "translateY(0px)";
    setTimeout(() => {
      nav.style.boxShadow = "none";
    }, 300)
  } else {
    pos = "translateY(-500px)";
    setTimeout(() => {
      nav.style.boxShadow = "0px 2px 4px 0px #4c4c4c42";
    }, 200)
  }
  navMobile.style.transform = pos;
};


// BACK END ---------------------------------

