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