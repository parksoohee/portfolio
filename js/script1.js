$( document ).ready( function() {
        var jbOffset = $( '#navbar' ).offset();
        /*선택자는 본인 구조에 맞게 수정*/
        $( window ).scroll( function() {
          if ( $( document ).scrollTop() > 860) {//여기 지정된 길이 이후부터 적용됩니다
            $( '#navbar' ).addClass("awake scrolled");
            /*선택자는 본인 구조에 맞게 수정, on클래스 만들어서 변경 원하는 스타일 주세요*/
          }
          else {
            $( '#navbar' ).removeClass("awake scrolled");
            /*선택자는 본인 구조에 맞게 수정, on클래스 만들어서 변경 원하는 스타일 주세요*/
          }
        });
      });
