document.addEventListener('DOMContentLoaded', function () {
  document.title = 'Home · ChainGlance';

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

  const planSwitchContainer = document.getElementById('plan-switch-container');
  planSwitchContainer.addEventListener('click', toggle);

  function toggle() {
    const planSwitch = document.getElementById('plan-switch');
    const plan = planSwitch.checked;
    planSwitch.checked = !plan;
  }

  function toggleAccordion(elementId) {
    var element = document.getElementById(elementId);
    element.classList.toggle('show');
  }

  var swiper = new Swiper('.mySwiper2', {
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

  var acc = document.getElementsByClassName('accordion');
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener('click', function () {
      this.classList.toggle('active');
      var panel = this.nextElementSibling;
      if (panel.style.display === 'block') {
        panel.style.display = 'none';
      } else {
        panel.style.display = 'block';
      }
    });
  }

  document.getElementById('back-to-top').addEventListener('click', toTop);
});
