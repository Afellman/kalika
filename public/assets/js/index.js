var isSmall;
var ham = document.getElementsByClassName('ham');
var navLinks = document.getElementsByClassName('nav-li');

// Inital load.
(function () {

  $('.nav-li').click(function () {
    var whereTo = $(`#${$(this).attr('data-to')}`);
    $('html, body').animate({
      scrollTop: whereTo.offset().top - 25
    }, 600)
  })

  ham[0].addEventListener("click", function (e) {
    if (!ham[0].classList.contains('clicked')) {
      showHideMobileNav("show");
      ham[0].classList.add("clicked")
    } else {
      ham[0].classList.remove("clicked");
      showHideMobileNav("hide");
    }
  })

  httpGet('photos', (res) => {
    buildImages(res);
  })

})();

function buildImages(res) {
  var photoHolder = document.getElementById('currentStyles');
  var photoArray = JSON.parse(res);
  var length = photoArray.length
  var colMap = {
    1: 12,
    2: 6,
    3: 4,
    4: 3
  }
  var col = length > 4 ? 3 : colMap[length];
  var photoDivs = photoArray.map((photo, i) => {
    return (
      `<div class='currentStyles col-md-${col} text-center'>
      <img src='currentStyles/${photo.path}'/>
      <p>${photo.name}</p>
      <p>${photo.size}</p>
      <a href='${photo.link}' target='_blank'>Buy Now</a>
      </div>`
    )
  })
  photoHolder.innerHTML = photoDivs.join('');

}
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
