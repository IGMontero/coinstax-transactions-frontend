document.addEventListener('DOMContentLoaded', function () {
  document.title = 'Coinstax | Home';

  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    const element = document.getElementById('back-to-top');
    if (element) {
      if (
        document.body.scrollTop > 100 ||
        document.documentElement.scrollTop > 100
      ) {
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
    }
  }

  function toTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  var nav = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (document.documentElement.scrollTop > 50) {
      nav.classList.add('is-sticky');
    } else {
      nav.classList.remove('is-sticky');
    }
  });

  var swiper = new Swiper('.mySwiper', {
    spaceBetween: 30,
    effect: 'fade',
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
  });

  document.getElementById('back-to-top').addEventListener('click', toTop);
});
