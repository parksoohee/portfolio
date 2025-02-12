// const msnry = new Masonry('.grid', {
//   itemSelector: '.grid-item',
//   percentPosition: true,
//   gutter: 19
// });

// let maxHeight = 1280;  // 처음에 보여지는 높이
// const gridGallery = document.querySelector('.grid-gallery');
// const gradientOverlay = document.querySelector('.gradient-overlay');
// const moreBtn = document.querySelector('.more-btn');

// // 처음에는 일정 높이만큼 보이게 설정
// gridGallery.style.maxHeight = `${maxHeight}px`;

// document.querySelectorAll('.grid-item').forEach((item, index) => {
//   item.classList.add('show');  // 모든 아이템 보이기
// });

// // 더보기 버튼 클릭 이벤트
// moreBtn.addEventListener('click', () => {
//   const gridItems = document.querySelectorAll('.grid-item');
//   const lastVisibleItem = gridItems[gridItems.length - 1];

//   // 마지막 아이템의 높이를 계산하여 max-height 증가
//   const lastItemHeight = lastVisibleItem.offsetHeight;

//   // max-height를 lastItemHeight만큼 더 증가
//   maxHeight += lastItemHeight;

//   // 새로운 max-height 설정
//   gridGallery.style.maxHeight = `${maxHeight}px`;

//   // Masonry 레이아웃 재정렬
//   setTimeout(() => {
//       msnry.reloadItems();
//       msnry.layout();
//   }, 350);

//   // 모든 그리드 아이템이 보이면 더보기 버튼과 그라디언트 오버레이 숨기기
//   if (gridItems.length === document.querySelectorAll('.grid-item.show').length) {
//       moreBtn.style.display = 'none';  // 모든 항목을 다 보여줬다면 더보기 버튼 숨기기
//       gradientOverlay.style.display = 'none'; // 그라디언트 오버레이도 숨기기
//   }
// });

// // 필터 버튼 클릭 이벤트
// document.querySelectorAll('.tabs button').forEach(button => {
//   button.addEventListener('click', () => {
//       const filterValue = button.getAttribute('data-filter');

//       // 각 그리드 아이템을 필터링
//       document.querySelectorAll('.grid-item').forEach(item => {
//           if (filterValue === '*' || item.classList.contains(filterValue.substring(1))) {
//               item.classList.remove('hide');  // 조건에 맞는 항목 보이기
//           } else {
//               item.classList.add('hide');  // 조건에 맞지 않으면 숨기기
//           }
//       });

//       // 필터 후 Masonry가 다시 레이아웃을 계산하도록
//       setTimeout(() => {
//           msnry.reloadItems();  // 새로 추가된 아이템을 Masonry에 반영
//           msnry.layout();  // 레이아웃 재정렬
//       }, 350);

      
//   });
// });
const msnry = new Masonry('.grid', {
    itemSelector: '.grid-item',
    percentPosition: true,
    gutter: 19,
    transitionDuration: '0.3s',
    initLayout: false, // 초기 레이아웃 자동 실행 방지
});

let maxHeight = 1280;
const gridGallery = document.querySelector('.grid-gallery');
const gradientOverlay = document.querySelector('.gradient-overlay');
const moreBtn = document.querySelector('.more-btn');

// 🔹 실제 그리드 콘텐츠의 전체 높이를 계산하는 함수
function getActualGridHeight() {
    const visibleItems = document.querySelectorAll('.grid-item.show:not(.hide)');
    let maxBottom = 0;
    
    visibleItems.forEach(item => {
        const bottom = item.offsetTop + item.offsetHeight;
        maxBottom = Math.max(maxBottom, bottom);
    });
    
    return maxBottom;
}

// 🔹 더보기 버튼 표시 여부를 업데이트하는 함수
function updateMoreButtonVisibility() {
    const actualHeight = getActualGridHeight();
    const currentMaxHeight = parseInt(gridGallery.style.maxHeight);
    
    if (actualHeight > currentMaxHeight) {
        moreBtn.style.display = 'block';
        gradientOverlay.style.display = 'block';
    } else {
        moreBtn.style.display = 'none';
        gradientOverlay.style.display = 'none';
    }
}

// 🔹 이미지 로딩 Promise를 생성하는 함수
function createImageLoadPromise(img) {
    return new Promise((resolve) => {
        if (img.complete) {
            resolve();
        } else {
            img.onload = resolve;
        }
    });
}

// 🔹 그리드 레이아웃을 업데이트하는 함수
async function updateGridLayout() {
    const visibleImages = document.querySelectorAll('.grid-item.show:not(.hide) img');
    const imagePromises = Array.from(visibleImages).map(createImageLoadPromise);
    
    await Promise.all(imagePromises);
    
    return new Promise(resolve => {
        msnry.once('layoutComplete', () => {
            updateMoreButtonVisibility();
            resolve();
        });
        
        msnry.layout();
    });
}

// 처음에는 일정 높이만큼 보이게 설정
gridGallery.style.maxHeight = `${maxHeight}px`;

document.querySelectorAll('.grid-item').forEach(item => {
    item.classList.add('show');
});

// 더보기 버튼 클릭 이벤트
moreBtn.addEventListener('click', async () => {
    maxHeight += 1280;
    gridGallery.style.maxHeight = `${maxHeight}px`;
    await updateGridLayout();
    updateMoreButtonVisibility();
});

// 필터 버튼 클릭 이벤트
document.querySelectorAll('.tabs button').forEach(button => {
    button.addEventListener('click', async () => {
        const filterValue = button.getAttribute('data-filter');
        
        // 현재 보이는 아이템들 페이드 아웃
        const currentItems = document.querySelectorAll('.grid-item.show:not(.hide)');
        currentItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transition = 'opacity 0.2s ease-out';
        });
        
        // 페이드 아웃 완료 대기
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // 필터링 적용
        document.querySelectorAll('.grid-item').forEach(item => {
            if (filterValue === '*' || item.classList.contains(filterValue.substring(1))) {
                item.classList.remove('hide');
                item.classList.add('show');
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                item.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
            } else {
                item.classList.add('hide');
                item.classList.remove('show');
            }
        });

        // 필터링 후 초기화
        maxHeight = 1280;
        gridGallery.style.maxHeight = `${maxHeight}px`;
        
        // 레이아웃 업데이트
        msnry.reloadItems();
        await updateGridLayout();
        
        // 필터링된 아이템들 페이드 인
        document.querySelectorAll('.grid-item.show:not(.hide)').forEach(item => {
            requestAnimationFrame(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            });
        });
// 전체 필터 선택 시 더보기 버튼과 오버레이 활성화
if (filterValue === '*') {
    moreBtn.style.display = 'block';
    gradientOverlay.style.display = 'block';
} else {
    // 실제 높이에 맞춰 maxHeight 조정
    const actualHeight = getActualGridHeight();
    if (actualHeight > maxHeight) {
        maxHeight = actualHeight;
        gridGallery.style.maxHeight = `${maxHeight}px`;
    }
    // 더보기 버튼 표시 여부 업데이트
    updateMoreButtonVisibility();
}
    });
});

// 반응형 사이즈 변경 시 처리
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(async () => {
        await updateGridLayout();
        updateMoreButtonVisibility();
    }, 250);
});

// 초기 로드 시 레이아웃 설정
document.addEventListener('DOMContentLoaded', async () => {
    const allImages = document.querySelectorAll('.grid-item img');
    const allImagePromises = Array.from(allImages).map(createImageLoadPromise);
    
    await Promise.all(allImagePromises);
    await updateGridLayout();
    updateMoreButtonVisibility();
});

// 이미지 로드 완료 시 레이아웃 업데이트
msnry.on('layoutComplete', () => {
    document.querySelectorAll('.grid-item.show:not(.hide)').forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    });
    updateMoreButtonVisibility();
});