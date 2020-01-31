var isSmall;
var ham = document.getElementsByClassName('ham');
var navLinks = document.getElementsByClassName('nav-li');

$('.nav-li').click(function () {
    const attr = $(this).attr('data-to');
    location.hash = attr;
    location.pathname = "/"
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
        pos = "translateY(-300px)";
        setTimeout(() => {
            nav.style.boxShadow = "0px 2px 4px 0px #4c4c4c42";
        }, 200)
    }
    navMobile.style.transform = pos;
};

ham[0].addEventListener("click", function (e) {
    if (!ham[0].classList.contains('clicked')) {
        showHideMobileNav("show");
        ham[0].classList.add("clicked");
    } else {
        ham[0].classList.remove("clicked");
        showHideMobileNav("hide");
    }
})

httpGet("blog", blogToDom);

function blogToDom(res) {
    const parsed = JSON.parse(res);
    blog = parsed;
    const div = document.getElementById('Page-container');
    const html = blog.map((post, i) => {
        const cleanedBody = post.body.replace(/style="[a-zA-Z0-9:;\.\s\(\)\-\,]*"/gi, "").replace(/<p><br><\/p>/gi, "");
        return `<div class="Row row"><div class='col-md-10 offset-md-1 blog-post'><h3 class="section-title">${post.title}</h3><div class="blog-body">${cleanedBody}</div></div></div><hr/>`;
    }).join("");
    div.innerHTML = html
}