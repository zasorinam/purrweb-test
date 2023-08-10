
function slideToRight(slider, newIndex) {
    let slideCount = Number(slider.dataset.slides);
    let slideIndex = Number(slider.dataset.index);
    let slides = Array.from(slider.querySelectorAll('.slider__item'));
    let list = slider.querySelector('.slider__list');
    let track = slider.querySelector('.slider__track');

    newIndex = (newIndex + slideCount) % slideCount;

    let curSlide = slides[slideIndex];
    let newSlide = slides[newIndex];

    if (slideIndex - 1 < 0) {
        newSlide = newSlide.cloneNode(true);
        newSlide.classList.add('slider__cloned');
        track.insertBefore(newSlide, curSlide);
    }

    newSlide.classList.add('slider__item_active');
    track.style.width = curSlide.offsetWidth + newSlide.offsetWidth + 'px';
    track.style.left = -newSlide.offsetWidth + 'px';
    list.style.height = track.offsetHeight + 'px';

    let animSpeed = 1000 * Number(slider.dataset.speed);
    let step = 20;
    let progress = curSlide.offsetWidth / step;
    slider.classList.add('slider_animated');
    let animation = setInterval(
        function () {
            let left = track.offsetLeft + progress;
            if ( left > 0) {
                clearInterval(animation);
                slider.dataset.index = newIndex;
                slider.classList.remove('slider_animated');
                updateSlider(slider);
            } else {
                track.style.left = left + 'px';
            }
        }
        , animSpeed / step);
}


function slideToLeft(slider, newIndex) {
    let slideCount = Number(slider.dataset.slides);
    let slideIndex = Number(slider.dataset.index);
    let slides = Array.from(slider.querySelectorAll('.slider__item'));
    let list = slider.querySelector('.slider__list');
    let track = slider.querySelector('.slider__track');

    newIndex = newIndex % slideCount;

    let curSlide = slides[slideIndex];
    let newSlide = slides[newIndex];

    if (slideIndex + 1 === slideCount) {
        newSlide = newSlide.cloneNode(true);
        newSlide.classList.add('slider__cloned');
        track.appendChild(newSlide);
    }

    newSlide.classList.add('slider__item_active');
    track.style.width = curSlide.offsetWidth + newSlide.offsetWidth + 'px';
    list.style.height = track.offsetHeight + 'px';

    let animSpeed = 1000 * Number(slider.dataset.speed);
    let step = 20;
    let progress = curSlide.offsetWidth / step;
    slider.classList.add('slider_animated');
    let animation = setInterval(
        function () {
            let left = track.offsetLeft - progress;
            if ( left < -curSlide.offsetWidth) {
                clearInterval(animation);
                slider.dataset.index = newIndex;
                slider.classList.remove('slider_animated');
                updateSlider(slider);
            } else {
                track.style.left = left + 'px';
            }
        }
        , animSpeed/step);
}
function showNextSlide(event) {
    let slider = event.currentTarget.closest('.slider');
    if (slider.classList.contains('slider_animated')) {
        return false;
    }

    slideToLeft(slider, Number(slider.dataset.index) + 1);
}

function showPreviousSlide(event) {
    let slider = event.currentTarget.closest('.slider');
    if (slider.classList.contains('slider_animated')) {
        return false;
    }

    slideToRight(slider, Number(slider.dataset.index) - 1);
}

function changeSlide(event) {
    let slider = event.currentTarget.closest('.slider');
    let slideIndex = Number(slider.dataset.index);

    if (slider.classList.contains('slider_animated')) {
        return false;
    }

    let newIndex = Number(event.currentTarget.getAttribute('data-slider-id'));
    if (newIndex === slideIndex) { return false; }
    if (newIndex > slideIndex) {
        slideToLeft(slider, newIndex);
    } else {
        slideToRight(slider, newIndex);
    }
}

function updateSlider(slider) {
    let slides = Array.from(slider.querySelectorAll('.slider__item'));
    let dots = Array.from(slider.querySelectorAll('.slider__dot'));
    let list = slider.querySelector('.slider__list');
    let track = slider.querySelector('.slider__track');
    let slideIndex = Number(slider.dataset.index);

    dots.forEach((dot, index) => {
        if (index === slideIndex) {
            slides[index].classList.add('slider__item_active');
            dot.classList.add('slider__dot_active');
        } else {
            slides[index].classList.remove('slider__item_active');
            dot.classList.remove('slider__dot_active');
        }
    });

    let cloned = document.querySelector('.slider__cloned');
    if (cloned !== null) {
        cloned.remove();
    }
    track.removeAttribute('style');
    list.style.height = track.offsetHeight + 'px';
}

function initSlider(slider) {
    let prevButton = slider.querySelector('.slider__prevButton');
    let nextButton = slider.querySelector('.slider__nextButton');
    let dot = slider.querySelector('.slider__dot');
    let dotParent = dot.parentElement;

    let slideCount = Array.from(slider.querySelectorAll('.slider__item')).length;

    slider.dataset.index = '0';
    slider.dataset.slides = String(slideCount);

    prevButton.addEventListener('click', showPreviousSlide);
    nextButton.addEventListener('click', showNextSlide);

    dot.remove();

    for (let i = 0; i < slideCount; i++) {
        let newDot = dot.cloneNode(true);
        newDot.setAttribute('data-slider-id', i);
        newDot.addEventListener('click', changeSlide);
        dotParent.appendChild(newDot);
    }

    updateSlider(slider)
}


Array.from(document.querySelectorAll('.slider'))
    .forEach((slider) => {
        initSlider(slider);
    });
