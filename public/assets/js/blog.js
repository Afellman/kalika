$('.nav-li').click(function () {
    const attr = $(this).attr('data-to');
    location.hash = attr;
    location.pathname = "/"
})