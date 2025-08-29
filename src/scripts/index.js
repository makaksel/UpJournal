document.addEventListener('DOMContentLoaded', function () {
    /**
     * Конвертация числа цены в строку
     */
    const convertToPriceString = (number) => number ? number.toLocaleString() : null;


    /**
     * Валидация формы
     */
    const validateForm = (form) => {
        const reqTextInputs = form.querySelectorAll('input[required][type="text"]');
        const reqCheckboxInputs = form.querySelectorAll('input[required][type="checkbox"]');
        const invalidRequiredTextInput = Array.from(reqTextInputs).filter((input) => !input.value);
        const invalidRequiredCheckInput = Array.from(reqCheckboxInputs).filter((input) => !input.checked);


        invalidRequiredCheckInput.forEach((checkbox, index) => {
            const inputController = checkbox.closest('.checkbox');

            inputController.classList.add('error');

            checkbox.addEventListener('change', () => {
                inputController?.classList.remove('error');
                inputController.querySelector('.text-input__error-text')?.remove();
            })
        })

        invalidRequiredTextInput.forEach((input, index) => {

            const inputController = input.closest('.text-input');

            if (index === 0) {
                input.focus()
            }

            if (inputController.classList.contains('error')) return;

            const errorRequired = document.createElement("span");
            errorRequired.classList.add('text-input__error-text');
            errorRequired.append('Поле не заполнено');

            inputController?.classList.add('error');
            inputController.append(errorRequired);

            input.addEventListener('input', () => {
                inputController?.classList.remove('error');
                inputController.querySelector('.text-input__error-text')?.remove();
            })
        })


        return invalidRequiredTextInput.length === 0 && invalidRequiredCheckInput.length === 0;
    }

    const stringToHSA256 = async (text) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hash = await crypto?.subtle?.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hash));
        const hashHex = hashArray
            .map((bytes) => bytes.toString(16).padStart(2, '0'))
            .join('');
        return hashHex;
    };

    const publishForm = document.getElementById("publish-form");
    const publishConsultationBtn = document.getElementById("btn-consultation");
    const publishBtn = document.getElementById("btn-publish");

    const contactsForm = document.getElementById("contacts-form");
    const contactFormConsultationBtn = document.getElementById("contact-form_consultation");
    const contactFormSendBtn = document.getElementById("contact-form_send");


    /**
     * Валидация выбора публикации
     */
    const validatePublishServices = () => {
        const publishServicesCards = document.querySelectorAll('.publish .service-card');
        const publishServicesCardsActive = document.querySelectorAll('.publish .service-card.active');

        if (publishServicesCardsActive && publishServicesCardsActive.length !== 0) {
            const publishServicesError = document.querySelector('.publish .services-publish .services-publish__error-text');
            publishServicesError?.remove();
            publishServicesCards.forEach((card) => card.classList.remove('error'))
        }
    }

    /**
     * Валидация выбора формата публикации
     */
    const validatePublishService = () => {
        const publishServicesCards = document.querySelectorAll('.publish .service-card');
        const publishServicesCardsActive = document.querySelectorAll('.publish .service-card.active');
        const publishError = !publishServicesCardsActive || publishServicesCardsActive.length === 0;

        if (publishError) {
            publishServicesCards.forEach((card) => card.classList.add('error'))
            const errorText = document.querySelector('.services-publish__error-text');

            if (errorText) return;

            const servicesPublish = document.querySelector('.publish .services-publish');

            const errorRequired = document.createElement("span");
            errorRequired.classList.add('services-publish__error-text');
            errorRequired.append('Выберите формат публикации');

            servicesPublish.append(errorRequired);
        }

        return !publishError;
    }

    /**
     * Сабмит публикации
     */
    const submitPublishForm = async (event) => {
        event.preventDefault();
        validateForm(publishForm);


        const isValidForm = validateForm(publishForm);
        const isValidPublishService = validatePublishService();

        if (!isValidForm || !isValidPublishService) return;
        publishBtn.classList.remove('success');
        publishBtn.classList.add('loading');

        const response = new Promise((resolve) => {
            setTimeout(() => {
                return resolve()
            }, 500)
        })

        try {
            await response
        } catch (e) {
            console.error(e)
        }

        publishBtn.classList.remove('loading');
        publishBtn.classList.add('success');
    }

    publishBtn?.addEventListener('click', submitPublishForm)

    /**
     * Сабмит публикации для консультации
     */
    const submitPublishConsultationForm = async (form, title) => {
        const isValidForm = validateForm(form);

        if (!isValidForm) return;


        const inputs = form.querySelectorAll('.text-input__input');
        const comment = form.querySelector('.text-area__input')?.value;

        const data = Array.from(inputs).reduce((acc, cur) => ({
            ...acc,
            [cur.name]: cur.value,
        }), {});

        const message = `#upJournal
*${title || 'Заказ консультации'}*

Имя: ${data?.name};
Телефон: ${data?.phone};
E-mail: ${data?.email};
${comment && `Комментарий: ${comment};`}`

        return new Promise((resolve) => {
            setTimeout(() => {
                return resolve()
            }, 500)
        })
    }

    const btnForms = [
        {
            btn: publishConsultationBtn,
            form: publishForm,
        },
        {
            btn: contactFormConsultationBtn,
            form: contactsForm,
        },
        {
            btn: contactFormSendBtn,
            form: contactsForm,
            title: 'Отправка статьи'
        }
    ]

    /**
     * Слушатели для форм
     */
    btnForms.forEach(({btn, form, title = ''}) => {
        btn?.addEventListener('click', async () => {
            btn.classList.remove('success');
            btn.classList.add('loading');
            try {
                await submitPublishConsultationForm(form, title);
            } catch (e) {
                console.error(e)
            }
            btn.classList.remove('loading');
            btn.classList.add('success');
        });
    })


    /**
     * Обновление итоговых цен
     */
    const priceFooter = document.querySelector('.publish .publish__form-actions .price .price__text');

    const updateFooterPrice = (newPrice) => {
        const priceValueString = convertToPriceString(newPrice) ? `${convertToPriceString(newPrice)} ₽` : '';

        priceFooter.innerHTML = priceValueString;
    }

    /**
     * Обновление значения формы оплаты
     */
    const updatePaymentAmount = () => {
        const amountInput = document.getElementById('publish-amount');
        const allPrices = document.querySelectorAll('.publish .service-card.active .service-card__badge');

        const resultAmount = Array.from(allPrices).reduce((acc, cur) => {
            const priceString = cur.innerHTML
            const priceNumber = parseInt(priceString.replace(/ /g, ''));
            return acc += priceNumber
        }, 0)

        publishBtn.disabled = !resultAmount;

        amountInput.value = resultAmount;
        updateFooterPrice(resultAmount);
    }

    /**
     * Переключение активности карточки сервиса
     */
    const servicesCard = document.querySelectorAll('.service-card');
    const servicesCardActiveToggle = ({currentTarget}) => {
        const card = currentTarget.closest('.service-card');
        const btn = card.querySelector('.service-card__btn');

        card.classList.toggle('active');

        if (card.classList.contains('active')) {
            btn.innerHTML = 'Выбрано'
        } else {
            btn.innerHTML = 'Выбрать'
        }
        updatePaymentAmount();
        validatePublishServices();
    }

    servicesCard.forEach((card) => card.addEventListener('click', servicesCardActiveToggle));


    /**
     * Бургер меню
     */
    const burgerBtn = document.querySelector('.header .btn.header__burger')
    const burgerMenu = document.querySelector('.header .header__burger-menu')

    const toggleShowBurger = () => {
        const useElement = burgerBtn.querySelector('use')
        burgerMenu.classList.toggle('show');
        burgerBtn.classList.toggle('blue');

        let icon = ""

        if (burgerMenu.classList.contains('show')) {
            document.body.style.overflow = 'hidden';
            icon = "#close"
        } else {
            document.body.style.overflow = '';
            icon = '#burger'
        }

        useElement.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', icon)
    }

    burgerBtn?.addEventListener('click', toggleShowBurger);

})
