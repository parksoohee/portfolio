const swiper = new Swiper(".swiper-container", {
  slidesPerView: 'auto',
  spaceBetween: 8,
  // breakpoints: {
  //   440: {
  //     slidesPerView: 'auto',
  //   },
  //   890: {
  //     slidesPerView: 'auto',
  //   },
  //   1086: {
  //     slidesPerView: 'auto',
  //   }
  // }
});

const buttons = document.querySelectorAll('.tabs button');
    
buttons.forEach(button => {
    button.addEventListener('click', () => {
        // 모든 버튼에서 'on' 클래스 제거
        buttons.forEach(btn => btn.classList.remove('on'));
        // 클릭한 버튼에 'on' 클래스 추가
        button.classList.add('on');
    });
  });