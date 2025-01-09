gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.matchMedia({

"(min-width:821px)" : function(){

    var imgscroll = gsap.timeline({
        scrollTrigger : {
            trigger : "#img",
            start : "top top",
            pin : true,
            end : "150%",
            scrub : 1,
            invalidateOnRefresh : true,
            //markers:true
        },
        defaults : {
            ease: "power2.out"
        }
    });

    gsap.to('#img .img_in h2', {
    color: "#ffffff",
    ease: "power2.out",
    scrollTrigger: {
        trigger: "#img",
        start: "top 30%",
        end : "65%", // 컬러 애니메이션 시작 지점
        scrub: 1,
        //markers:true
    }
    });

    imgscroll
        .set("#img .img_in .img_box",{
            width: "640",
            height: "323"
        })
        .set('#img .img_in h2:nth-of-type(1)',{
            x : "-20.833vw"
        })
        .set('#img .img_in h2:nth-of-type(2)',{
            x: "20.833vw"
        })
        .to('#img .img_in .img_box',{
            width : "100vw",
            height : "100vh",
        },"my")
        .to('#img .img_in h2:nth-of-type(1)',{
            x : 0
        },"my")
        .to('#img .img_in h2:nth-of-type(2)',{
            x: 0
        },"my")
        .to('#img p',{
        color: "#ffffff"
        },"my")

},
"(max-width:820px)" : function(){

    gsap.set("#img .img_in .img_box",{
            width: "50%",
            height: "40%"
    });
    gsap.set('#img .img_in h2:nth-of-type(1)',{
            x : 0
    });
    gsap.set('#img .img_in h2:nth-of-type(2)',{
            x: 0
    });

    var imgscroll = gsap.timeline({
        scrollTrigger : {
            trigger : "#img",
            start : "40% 40%",
            end : "center top",
            scrub : 1,
            invalidateOnRefresh : true,
            //markers:true
        },
        defaults : {
            ease: "power1.out"
        }
    });
    imgscroll
        .to('#img .img_in .img_box',{
            width : "100%",
            height : "70vw",
        },"my")
        .to('#img .img_in h2:nth-of-type(1)',{
            x : "-100vw",
            color: "#2d2d2d"
        },"my")
        .to('#img .img_in h2:nth-of-type(2)',{
            x: "100vw",
            color: "#2d2d2d"
        },"my")

}

});