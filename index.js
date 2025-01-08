window.addEventListener('load',function(){

    window._ = new Glider(document.querySelector('.glider'), {
        slidesToShow: 1, //'auto',
        slidesToScroll: 1,
        itemWidth: 424,
        draggable: true,
        scrollLock: false,
        rewind: true,
        dots: false,
        arrows: false,
        responsive: [
            {
                breakpoint: 800,
                settings: {
                    slidesToScroll: 1,
                    itemWidth: 424,
                    slidesToShow: 1,
                    exactWidth: true
                }
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToScroll: 1,
                    slidesToShow: 1,
                    exactWidth: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToScroll: 1,
                    slidesToShow: 1,
                    exactWidth: true
                }
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToScroll: 1,
                    slidesToShow: 1,
                    scrollLock: true
                }
            }
        ]
    });
  });