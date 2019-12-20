var isSmall;
var ham = document.getElementsByClassName('ham');
var navLinks = document.getElementsByClassName('nav-li');

// Inital load.
(function () {
  var styleScroll = 250;
  var careScroll = 700;
  var aboutScroll = 1050;

  if (window.innerWidth < 976) {
    styleScroll = 400;
    careScroll = 1899;
    aboutScroll = 2499;
  }
  $('.nav-li').click(function () {
    var whereTo = $(`#${$(this).attr('data-to')}`);
    $('html, body').animate({
      scrollTop: whereTo.offset().top - 25
    }, 600)
  })

  $('[data-toggle="popover"]').popover({trigger: "manual"})

  document.addEventListener('scroll', function () {
    var scrollTop = document.getElementsByTagName('html')[0].scrollTop;
    var careImg = document.querySelectorAll('.slideInRight.out')[0];
    var aboutImg = document.querySelectorAll('.slideInLeft.out')[0];
    if (scrollTop > styleScroll) {
      var currentStyles = document.getElementById('currentStyles');
      currentStyles.classList.add('show')
    }
    if (scrollTop > careScroll && careImg) {
      careImg.classList.remove('out');
      careImg.classList.add('in');
    }
    if (scrollTop > aboutScroll && aboutImg) {
      aboutImg.classList.remove('out');
      aboutImg.classList.add('in');
    }
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
  });

})();

document.getElementById("contactSubmit").addEventListener('click', function (e) {
  e.preventDefault();
  $('#contactSubmit').popover('show');
  var data = {}
  data.name = document.getElementById('Contact-name').value;
  data.email = document.getElementById('Contact-email').value;
  data.sub = document.getElementById('Contact-subject').value;
  data.message = document.getElementById('Contact-message').value;

  $.post("/backend/contact-submit", data, function (res) {
    console.log(res)
    if(res.status == "error"){
      alert("Something went wrong...")
    } else {
      $('.popover-body').text("Message Sent!");
      setTimeout(() => { 
        $('#contactSubmit').popover('hide');
      }, 2000);
    }
  });
  httpPost('contact-submit', '', data);
})

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
      `<div class='currentStyles col-md-${col} col-6 text-center'>
	    <div class='imageWrap'>
     		<img src='currentStyles/${photo.path}'/>
	    </div>
      <p>${photo.name}</p>
      <p>${photo.size}</p>
      <a href='${photo.link}' target='_blank'><button class='btn btnShadow'>Buy Now</button></a>
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
    pos = "translateY(-300px)";
    setTimeout(() => {
      nav.style.boxShadow = "0px 2px 4px 0px #4c4c4c42";
    }, 200)
  }
  navMobile.style.transform = pos;
};
