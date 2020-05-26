$(document).ready(function() {

    // AOS Element animation on scroll preferences

    AOS.init({

    });
    $('[data-bs-hover-animate]')
        .mouseenter(function() {
            var elem = $(this);
            elem.addClass('infront animated ' + elem.attr('data-bs-hover-animate'))
        })
        .mouseleave(function() {
            var elem = $(this);
            elem.removeClass('infront animated ' + elem.attr('data-bs-hover-animate'))
        });


    // Navbar hide on scroll down and show on scrollup
    var position = $(window).scrollTop();
    $(window).scroll(function() {

        var scroll = $(window).scrollTop();
        if (scroll > position) {
            $('#navbar').addClass('away');
        } else {
            $('#navbar').removeClass('away');
        }
        $('#navbar .collapse').removeClass('show');
        position = scroll;

    });

    // 1) Page scroll on clicking navigation link and
    // 2) Navigation active status updation on page scroll
    $(document).on("scroll", onScroll);
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        $(document).off("scroll");

        $('#navbar ul li a').each(function() {
            $(this).removeClass('active');
        })
        $(this).addClass('active');

        var target = this.hash,
            menu = target;
        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top + 2
        }, 500, 'swing', function() {
            window.location.hash = target;
            $(document).on("scroll", onScroll);
        });
    });

    // Avoiding glitch in carousel slide transition due to undefined height
    const height = $('.carousel-inner').css("height");
    const width = $('.carousel-inner').css("width");
    $('.carousel-item img').css("width", width);
    $('.carousel-item img').css("height", height);
});


function onScroll(event) {
    var scrollPos = $(document).scrollTop();
    $('#navbar ul li a').each(function() {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $('#navbar ul li a').removeClass("active");
            currLink.addClass("active");
        } else {
            currLink.removeClass("active");
        }
    });
}