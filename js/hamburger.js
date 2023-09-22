$(function () {
  $("#gnb_menu").click(function () {
    if ($("#burgur").hasClass("on")) {
      $("#burgur").removeClass("on");
      $("#slide").removeClass("on");
    } else {
      $("#burgur").addClass("on");
      $("#slide").addClass("on");
    }
  });
  $("#slide ul li a").click(function () {
    if ($("#burgur").hasClass("on")) {
      $("#burgur").removeClass("on");
      $("#slide").removeClass("on");
    } else {
      $("#burgur").addClass("on");
      $("#slide").addClass("on");
    }
  });

  $('a[href*="#"]:not([href="#"])').click(function () {
    if (
      location.pathname.replace(/^\//, "") ==
        this.pathname.replace(/^\//, "") &&
      location.hostname == this.hostname
    ) {
      var target = $(this.hash);
      target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
      if (target.length) {
        $("html, body").animate(
          {
            scrollTop: target.offset().top,
          },
          500
        ); //움직이는 시간 조정
        return false;
      }
    }
  });
});
