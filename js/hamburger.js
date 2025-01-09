$(function () {
  $("#slide_open").click(function () {
    if ($("#burger").hasClass("on")) {
      $("#burger").removeClass("on");
      $("#slide").removeClass("on");
      $("header").removeClass("on");
    } else {
      $("#burger").addClass("on");
      $("#slide").addClass("on");
      $("header").addClass("on");
    }
  });
  $("#slide ul li a").click(function () {
    if ($("#burger").hasClass("on")) {
      $("#burger").removeClass("on");
      $("#slide").removeClass("on");
      $("header").removeClass("on");
    } else {
      $("#burger").addClass("on");
      $("#slide").addClass("on");
      $("header").addClass("on");
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
