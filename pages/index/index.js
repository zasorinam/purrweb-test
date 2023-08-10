const modalForm = document.getElementById('modalForm');
const modalCookie = document.getElementById('cookies');
const formContact = document.getElementById('formContact');
const header = document.querySelector('.header');

const unsedCodes = Array(907, 935, 943, 944, 945, 946, 947, 948, 949, 959, 972, 973, 974, 975, 976, 990);

function modalClose(modal) {
    modal.classList.add('modal_disabled');
}

function modalOpen(modal) {
    modal.classList.remove('modal_disabled');
}

function setInputError(input, errorText = 'This field is required.') {
    let errLblId = '.form__errorLebel[data-input=' + input.id + ']';
    let errLbl = document.querySelector(errLblId);

    errLbl.classList.remove('form__errorLebel_disabled');
    errLbl.innerText = errorText;
    input.classList.add('form__input_error');
    input.dataset.valid = 'false';
}

function makeInputValid(input) {
    let errLblId = '.form__errorLebel[data-input=' + input.id + ']';
    let errLbl = document.querySelector(errLblId);

    errLbl.classList.add('form__errorLebel_disabled');
    input.classList.remove('form__input_error');
    input.dataset.valid = 'true';
}

function validateSubmition(form) {
    let valid = true;
    let errNote = form.querySelector('.form__errNote');

    Array.from(form.querySelectorAll('[required]')).forEach(
        (input) => {
            if (input.dataset.valid === 'false') {
                valid = false;
            }
        }
    );

    if (valid === true) {
        errNote.classList.add('form__errNote_disabled');
    } else {
        errNote.classList.remove('form__errNote_disabled');
    }
    form.querySelector('[type="submit"]').disabled = !valid;
}

function validateTextInput(input) {
    if (input.value.length === 0) {
        setInputError(input);
    } else {
        makeInputValid(input);
    }
}

function validateTelInput(input) {
    let re = /^\+7 \((\d{3})\)? (\d{3})-(\d{2})-(\d{2})$/;
    let x = input.value.replace(/\D/g, '').match(/(\d?)(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
    let maskedValue = '';

    if (x[0].length > 0) {
        maskedValue = '+7';
    }
    if (x[0].length === 1 &&  x[1] !== '7') {
        maskedValue = maskedValue.concat(' (', x[1]);
    }
    if (x[0].length > 1) {
        maskedValue = maskedValue.concat(' (', x[2]);
    }
    if (x[0].length > 4) {
        maskedValue = maskedValue.concat(') ', x[3]);
    }
    if (x[0].length > 7) {
        maskedValue = maskedValue.concat('-', x[4]);
    }
    if (x[0].length > 9) {
        maskedValue = maskedValue.concat('-', x[5]);
    }

    input.value = maskedValue;
    if (unsedCodes.includes(Number(x[2]))) {
        setInputError(input, 'Invalid operator code.');
    } else {
        if ( re.test(input.value) === false){
            setInputError(input, 'Invalid phone number.');
        } else {
            makeInputValid(input);
        }
    }
}

function validateInput(input) {
    switch (input.type) {
        case 'tel':
            validateTelInput(input);
            break;
        default:
            validateTextInput(input);
            break;
    }
}

function validateHandler(event) {
    let input = event.currentTarget
    validateInput(input);
    validateSubmition(input.closest('form'));
}

function validateForm(form) {
    Array.from(form.querySelectorAll('[required]'))
        .forEach((input) => {validateInput(input);});

    validateSubmition(form);
}

function setFormInitialState(form) {
    let errNote = form.querySelector('.form__errNote');

    validateForm(form);

    Array.from(formContact.querySelectorAll('[required]'))
        .forEach((input) => {
            let errLblId = '.form__errorLebel[data-input=' + input.id + ']';
            let errLbl = document.querySelector(errLblId);

            if ( !input.value) {
                errLbl.classList.add('form__errorLebel_disabled');
                input.classList.remove('form__input_error');
            }
        });

    errNote.classList.add('form__errNote_disabled');
}

function initTicker(ticker) {
    let docWidth = document.body.clientWidth;
    let tickerItems = Array.from(ticker.querySelectorAll('.ticker__items'));
    let tickerItemsWidth = tickerItems[0].offsetWidth;
    let itemsCount = 2 * Math.ceil(docWidth / tickerItemsWidth);

    if ( tickerItems.length === itemsCount ) {
        return;
    }
    if ( tickerItems.length > itemsCount ) {
        for (let i = itemsCount; i < tickerItems.length; i++) {
            tickerItems[i].remove();
        }
    } else {
        for (let i = tickerItems.length; i < itemsCount; i++) {
            tickerItems[0].parentElement.appendChild(tickerItems[0].cloneNode(true));
        }
    }
}

function initTickers() {
    Array.from(document.querySelectorAll('.ticker'))
        .forEach((ticker) => { initTicker(ticker); });
}

function onresizeWindowHandler() {
    initTickers();
}

function initPage () {
    // Event listeners for open contact form
    Array.from(document.querySelectorAll('.btn__openForm')).forEach((btn) => {
            btn.onclick = () => {
                document.getElementById('header__checkbox').checked = false;
                modalOpen(modalForm);
            };
        });

    // Event listeners for close modals
    Array.from(document.querySelectorAll('.modal__close'))
        .forEach((btn) => {
            btn.onclick = (event) => {
                modalClose(document.getElementById(event.currentTarget.dataset.modal));
            };
        });

    // Event listeners for close cookie without saving state
    Array.from(document.querySelectorAll('.modal__cookiesBtn'))
        .forEach((btn) => {
            btn.onclick = () => {
                modalClose(modalCookie);
            };
        });

    // Event listener for required input form
    Array.from(formContact.querySelectorAll('[required]'))
        .forEach((input) => {
            input.addEventListener('input', validateHandler);
            input.addEventListener('blur', validateHandler);
        });

    setFormInitialState(formContact);

    // Event listener for submit form
    formContact.querySelector('[type="submit"]').onclick = (event) => {
        event.preventDefault();

        modalClose(modalForm);
        modalOpen(document.getElementById('thankyou'));
    };

    // Event listener for scroll
    document.addEventListener("scroll", () => {
        if (scrollY > 1) {
            header.classList.add('header_scrolled');
        }
        else {
            header.classList.remove('header_scrolled');
        }
    });

    // Show cookie
    setTimeout(modalOpen, 2000, modalCookie);


    // Setup tickers for animation
    initTickers();
    window.addEventListener("resize", onresizeWindowHandler);
}

initPage();
