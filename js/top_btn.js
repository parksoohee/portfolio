$(window).scroll(function() {
    var height = $(window).scrollTop();
    if (height > 860) {//아이콘이 나타나길 원하는 높이를 설정하세요
        $('#top_btn').fadeIn();//나타날 아이콘 클래스 수정!
    } else {
        $('#top_btn').fadeOut();//나타날 아이콘 클래스 수정!
    }
});