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
// Masonry 인스턴스 생성
const MasonryGrid = (function() {
    // 상수 정의
    const INITIAL_MAX_HEIGHT = 1280;
    const HEIGHT_INCREMENT = 1280;
    const RESIZE_DEBOUNCE_TIME = 250;
    const FADE_OUT_DURATION = 200;
    
    // 주요 DOM 요소
    const elements = {
        gridGallery: document.querySelector('.grid-gallery'),
        gradientOverlay: document.querySelector('.gradient-overlay'),
        moreBtn: document.querySelector('.more-btn')
    };
    
    // Masonry 인스턴스
    const msnry = new Masonry('.grid', {
        itemSelector: '.grid-item',
        percentPosition: true,
        gutter: 19,
        transitionDuration: '0.3s',
        initLayout: false
    });
    
    // 상태 관리
    let state = {
        maxHeight: INITIAL_MAX_HEIGHT,
        resizeTimeout: null
    };

    // CSS 클래스 정의
    const cssClasses = {
        fadeIn: {
            opacity: '1',
            transform: 'translateY(0)',
            transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
        },
        fadeOut: {
            opacity: '0',
            transform: 'translateY(20px)',
            transition: 'opacity 0.2s ease-out'
        }
    };

    // 유틸리티 함수
    function applyStyles(element, styles) {
        Object.assign(element.style, styles);
    }

    function getActualGridHeight() {
        const visibleItems = document.querySelectorAll('.grid-item.show:not(.hide)');
        return Array.from(visibleItems).reduce((maxBottom, item) => {
            const bottom = item.offsetTop + item.offsetHeight;
            return Math.max(maxBottom, bottom);
        }, 0);
    }

    function createImageLoadPromise(img) {
        return new Promise((resolve, reject) => {
            if (img.complete) {
                resolve();
            } else {
                img.onload = resolve;
                img.onerror = () => reject(new Error(`Failed to load image: ${img.src}`));
            }
        });
    }

    // 상태 업데이트 함수
    function updateMoreButtonVisibility() {
        const actualHeight = getActualGridHeight();
        const currentMaxHeight = parseInt(elements.gridGallery.style.maxHeight);
        
        elements.moreBtn.style.display = actualHeight > currentMaxHeight ? 'block' : 'none';
        elements.gradientOverlay.style.display = actualHeight > currentMaxHeight ? 'block' : 'none';
    }

    async function updateGridLayout() {
        try {
            const visibleImages = document.querySelectorAll('.grid-item.show:not(.hide) img');
            await Promise.all(Array.from(visibleImages).map(createImageLoadPromise));
            
            return new Promise(resolve => {
                const layoutHandler = () => {
                    updateMoreButtonVisibility();
                    msnry.off('layoutComplete', layoutHandler);
                    resolve();
                };
                
                msnry.on('layoutComplete', layoutHandler);
                msnry.layout();
            });
        } catch (error) {
            console.error('Error updating grid layout:', error);
            throw error;
        }
    }

    // 이벤트 핸들러
    async function handleMoreButtonClick() {
        try {
            state.maxHeight += HEIGHT_INCREMENT;
            elements.gridGallery.style.maxHeight = `${state.maxHeight}px`;
            await updateGridLayout();
            updateMoreButtonVisibility();
        } catch (error) {
            console.error('Error handling more button click:', error);
        }
    }

    async function handleFilterButtonClick(filterValue) {
        try {
            // 현재 보이는 아이템들 페이드 아웃
            const currentItems = document.querySelectorAll('.grid-item.show:not(.hide)');
            currentItems.forEach(item => applyStyles(item, cssClasses.fadeOut));
            
            await new Promise(resolve => setTimeout(resolve, FADE_OUT_DURATION));
            
            // 필터링 적용
            document.querySelectorAll('.grid-item').forEach(item => {
                const shouldShow = filterValue === '*' || item.classList.contains(filterValue.substring(1));
                item.classList.toggle('hide', !shouldShow);
                item.classList.toggle('show', shouldShow);
                
                if (shouldShow) {
                    applyStyles(item, cssClasses.fadeOut);
                }
            });

            // 필터링 후 초기화 및 레이아웃 업데이트
            state.maxHeight = filterValue === '*' ? INITIAL_MAX_HEIGHT : getActualGridHeight();
            elements.gridGallery.style.maxHeight = `${state.maxHeight}px`;
            
            msnry.reloadItems();
            await updateGridLayout();
            
            // 필터링된 아이템들 페이드 인
            requestAnimationFrame(() => {
                document.querySelectorAll('.grid-item.show:not(.hide)').forEach(item => {
                    applyStyles(item, cssClasses.fadeIn);
                });
            });
            
            // 더보기 버튼 상태 업데이트
            if (filterValue === '*') {
                elements.moreBtn.style.display = 'block';
                elements.gradientOverlay.style.display = 'block';
            } else {
                updateMoreButtonVisibility();
            }
        } catch (error) {
            console.error('Error handling filter button click:', error);
        }
    }

    // 초기화 함수
    async function initialize() {
        try {
            // DOM 요소 확인
            if (!elements.gridGallery || !elements.gradientOverlay || !elements.moreBtn) {
                throw new Error('Required DOM elements not found');
            }

            // 초기 설정
            elements.gridGallery.style.maxHeight = `${state.maxHeight}px`;
            document.querySelectorAll('.grid-item').forEach(item => item.classList.add('show'));

            // 이벤트 리스너 등록
            elements.moreBtn.addEventListener('click', handleMoreButtonClick);
            
            document.querySelectorAll('.tabs button').forEach(button => {
                button.addEventListener('click', () => {
                    const filterValue = button.getAttribute('data-filter');
                    handleFilterButtonClick(filterValue);
                });
            });

            // 리사이즈 이벤트 처리
            window.addEventListener('resize', () => {
                clearTimeout(state.resizeTimeout);
                state.resizeTimeout = setTimeout(async () => {
                    await updateGridLayout();
                    updateMoreButtonVisibility();
                }, RESIZE_DEBOUNCE_TIME);
            });

            // 초기 레이아웃 설정
            const allImages = document.querySelectorAll('.grid-item img');
            await Promise.all(Array.from(allImages).map(createImageLoadPromise));
            await updateGridLayout();
            updateMoreButtonVisibility();

            // Masonry 레이아웃 완료 이벤트 처리
            msnry.on('layoutComplete', () => {
                document.querySelectorAll('.grid-item.show:not(.hide)').forEach(item => {
                    applyStyles(item, cssClasses.fadeIn);
                });
                updateMoreButtonVisibility();
            });
        } catch (error) {
            console.error('Error initializing Masonry grid:', error);
        }
    }

    // 공개 API
    return {
        initialize
    };
})();

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', MasonryGrid.initialize);