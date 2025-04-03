document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    initMobileMenu();

    // Модальные окна
    initModals();

    // Кнопка "Наверх"
    setupBackToTop();

    // Плавная прокрутка к якорям
    initSmoothScroll();

    // Анимация шапки при скролле
    initHeaderScroll();

    // FAQ аккордеон
    setupFaqAccordion();

    // Форма обратной связи
    initContactForm();

    // Инициализация слайдера отзывов
    setupReviewsSlider();

    // Инициализация анимации для hero секции
    setupHeroAnimation();

    // Обработка прокрутки для hero-scroll
    setupHeroScroll();

    // Инициализация корректной работы выпадающих меню
    initDropdownMenus();

    // Запускаем проверку скролла и выпадающего меню
    preventScrollIssues();
});

/**
 * Инициализация мобильного меню
 */
function initMobileMenu() {
    const menuButton = document.querySelector('.header__mobile-menu-button');
    const closeButton = document.querySelector('.mobile-menu__close');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const header = document.querySelector('.header');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__services-list a');

    if (!menuButton || !mobileMenu || !header) return;

    // Функция для проверки и устранения скроллов
    function preventScrollIssues() {
        // Фиксим горизонтальный скролл на странице
        if (document.body.scrollWidth > window.innerWidth) {
            document.documentElement.style.overflowX = 'hidden';
            document.body.style.overflowX = 'hidden';
        }

        // Убираем вертикальный скролл в шапке только на мобильных
        const headerElement = document.querySelector('.header');
        if (headerElement && window.innerWidth <= 992) {
            headerElement.style.overflowY = 'hidden';

            // Убедимся, что анимация не нарушена
            const headerServices = headerElement.querySelector('.header__services');
            if (headerServices) {
                // Проверяем, есть ли скролл внутри сервисного меню
                if (headerServices.scrollHeight > headerServices.clientHeight) {
                    // Если есть вертикальный скролл в services_menu - устраняем его
                    headerServices.style.overflow = 'hidden';
                }
            }
        } else if (headerElement && window.innerWidth > 992) {
            // На десктопе обеспечиваем видимость выпадающего меню
            headerElement.style.overflow = 'visible';

            const headerServices = headerElement.querySelector('.header__services');
            if (headerServices) {
                headerServices.style.overflow = 'visible';
            }

            // Проверяем доступность выпадающих меню на десктопе
            const dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
                // Сбрасываем стили, примененные скриптом
                dropdown.style.display = '';
                dropdown.style.opacity = '';
                dropdown.style.visibility = '';
            });
        }
    }

    // Проверяем при загрузке и изменении размеров окна
    window.addEventListener('load', preventScrollIssues);
    window.addEventListener('resize', preventScrollIssues);
    window.addEventListener('scroll', preventScrollIssues);

    function openMenu() {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        header.classList.add('header--mobile-open');
        document.body.classList.add('no-scroll');

        setTimeout(preventScrollIssues, 300); // Проверяем после анимации
    }

    function closeMenu() {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        header.classList.remove('header--mobile-open');
        document.body.classList.remove('no-scroll');

        // Закрываем выпадающие меню при закрытии мобильного меню
        const activeItems = document.querySelectorAll('.services-menu__item.active');
        activeItems.forEach(item => {
            item.classList.remove('active');
        });

        setTimeout(preventScrollIssues, 300);
    }

    menuButton.addEventListener('click', openMenu);

    if (closeButton) {
        closeButton.addEventListener('click', closeMenu);
    }

    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Обработка кликов по выпадающим пунктам меню
    const dropdownItems = document.querySelectorAll('.services-menu__item');

    dropdownItems.forEach(item => {
        const link = item.querySelector('.services-menu__link--dropdown');
        if (!link) return;

        // Добавляем обработчик для десктопа
        if (window.innerWidth > 992) {
            // Очищаем все инлайн-стили, которые могли быть установлены
            const dropdown = item.querySelector('.dropdown');
            if (dropdown) {
                dropdown.style.display = '';
                dropdown.style.opacity = '';
                dropdown.style.visibility = '';
            }
        }

        link.addEventListener('click', function(e) {
            // Проверяем, что мы на мобильном устройстве
            if (window.innerWidth <= 992) {
                e.preventDefault();

                // Закрываем все открытые подменю, кроме текущего
                dropdownItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });

                // Переключаем класс active для текущего пункта
                item.classList.toggle('active');

                // Проверяем скроллы после анимации
                setTimeout(preventScrollIssues, 350);
            }
        });
    });
}

/**
 * Инициализация модальных окон
 */
function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    const modalCloseButtons = document.querySelectorAll('.modal__close');

    // Открытие модального окна
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);

            if (modal) {
                modal.style.display = 'flex';
                document.body.classList.add('modal-open');

                // Анимация появления
                setTimeout(() => {
                    modal.classList.add('modal--visible');
                }, 10);
            }
        });
    });

    // Обработка кликов по кнопке закрытия
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // Закрытие по клику вне модального окна
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });

    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal--visible');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });

    // Открытие модального окна по хешу в URL
    if (window.location.hash) {
        const modalId = window.location.hash.substring(1);
        const modal = document.getElementById(modalId);

        if (modal && modal.classList.contains('modal')) {
            modal.style.display = 'flex';
            document.body.classList.add('modal-open');

            setTimeout(() => {
                modal.classList.add('modal--visible');
            }, 10);
        }
    }

    // Для кнопки "Заказать звонок"
    const callbackButton = document.querySelector('.button--callback');
    if (callbackButton) {
        callbackButton.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = document.getElementById('callbackModal');

            if (modal) {
                modal.style.display = 'flex';
                document.body.classList.add('modal-open');

                // Анимация появления
                setTimeout(() => {
                    modal.classList.add('modal--visible');
                }, 10);
            }
        });
    }

    // Функция закрытия модального окна
    function closeModal(modal) {
        modal.classList.remove('modal--visible');

        // После завершения анимации
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }, 300);
    }
}

/**
 * Инициализация кнопки "Наверх"
 */
function setupBackToTop() {
    const backToTopButton = document.getElementById('backToTop');

    if (!backToTopButton) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Инициализация плавной прокрутки к якорям
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]:not([data-modal])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            // Пропускаем пустые якоря и якоря, которые не указывают на элементы
            if (targetId === '#' || !document.querySelector(targetId)) return;

            e.preventDefault();

            const targetElement = document.querySelector(targetId);
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = targetPosition - headerHeight - 20; // Добавляем дополнительный отступ 20px

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Анимация шапки при скролле
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    const headerBottom = document.querySelector('.header__bottom');

    if (!header) return;

    let lastScrollY = window.scrollY;
    let scrollingDown = false;
    let scrollTimeout;
    let lastState = "";
    const scrollThreshold = 5; // Минимальное изменение скролла для реакции
    let isTransitioning = false; // Флаг для предотвращения множественных изменений
    let isHovering = false; // Флаг для отслеживания наведения на меню

    // Отслеживаем наведение на пункты меню с выпадающими списками
    const menuItems = document.querySelectorAll('.services-menu__item');
    menuItems.forEach(item => {
        if (item.querySelector('.dropdown')) {
            item.addEventListener('mouseenter', () => {
                isHovering = true;
            });

            item.addEventListener('mouseleave', () => {
                isHovering = false;
                // Восстанавливаем состояние шапки после того, как убрали курсор
                updateHeaderState(window.scrollY);
            });
        }
    });

    // Функция для плавного изменения состояния шапки
    function updateHeaderState(currentScrollY) {
        // Если наведен курсор на пункт с выпадающим меню, не меняем состояние
        if (isHovering && window.innerWidth > 992) return;

        scrollingDown = currentScrollY > lastScrollY;

        // Если сейчас идет переход, не обрабатываем новые события скролла
        if (isTransitioning) return;

        // Определяем текущее состояние
        let currentState;

        if (currentScrollY > 80) {
            currentState = "scrolled";
        } else if (currentScrollY > 10) {
            currentState = "scrolling";
        } else {
            currentState = "normal";
        }

        // Если состояние не меняется, не делаем ничего
        if (currentState === lastState) return;

        // Устанавливаем флаг переходного состояния
        isTransitioning = true;

        // Обновляем классы в зависимости от текущего состояния и направления скролла
        if (currentState === "scrolled") {
            // При скролле вниз до порога свернутого состояния
            header.classList.add('scrolled');
            header.classList.remove('scrolling');
        } else if (currentState === "scrolling") {
            // Промежуточное состояние
            header.classList.add('scrolling');

            // При скролле вниз добавляем scrolled, при скролле вверх убираем
            if (scrollingDown && lastState === "normal") {
                setTimeout(() => {
                    if (window.scrollY > 10) header.classList.add('scrolled');
                    setTimeout(() => { isTransitioning = false; }, 300);
                }, 150);
                return; // Важно: прерываем выполнение здесь
            } else if (!scrollingDown && lastState === "scrolled") {
                header.classList.remove('scrolled');
            }
        } else {
            // Нормальное состояние
            header.classList.remove('scrolled');

            // Плавно убираем scrolling при возврате наверх
            if (lastState === "scrolling") {
                setTimeout(() => {
                    if (window.scrollY <= 10) header.classList.remove('scrolling');
                    setTimeout(() => { isTransitioning = false; }, 300);
                }, 100);
                return; // Важно: прерываем выполнение здесь
            } else {
                header.classList.remove('scrolling');
            }
        }

        lastState = currentState;

        // Сбрасываем флаг переходного состояния после задержки
        setTimeout(() => {
            isTransitioning = false;
        }, 200);
    }

    // Дебаунс функция для более плавной обработки скролла
    function debounceScroll() {
        const currentScrollY = window.scrollY;

        // Проверяем, есть ли существенное изменение положения скролла
        if (Math.abs(currentScrollY - lastScrollY) < scrollThreshold) return;

        lastScrollY = currentScrollY;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateHeaderState(currentScrollY);
        }, 15);
    }

    window.addEventListener('scroll', debounceScroll, { passive: true });

    // Начальная инициализация
    updateHeaderState(window.scrollY);
}

/**
 * Инициализация аккордеона для FAQ
 */
function setupFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq__item');

    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Закрываем все активные элементы
            document.querySelectorAll('.faq__item.active').forEach(activeItem => {
                if (activeItem !== item) {
                    activeItem.classList.remove('active');
                }
            });

            // Переключаем состояние текущего элемента
            item.classList.toggle('active', !isActive);
        });
    });

    // Открываем первый элемент по умолчанию
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }
}

/**
 * Инициализация форм обратной связи
 */
function initContactForm() {
    const forms = document.querySelectorAll('.form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Здесь должна быть логика отправки формы на сервер
            // Для демонстрации просто покажем успешное сообщение

            // Собираем данные формы
            const formData = new FormData(form);
            const formValues = {};

            for (let [key, value] of formData.entries()) {
                formValues[key] = value;
            }

            console.log('Отправка формы:', formValues);

            // Очищаем форму
            form.reset();

            // Показываем сообщение об успешной отправке
            const successMessage = document.createElement('div');
            successMessage.className = 'form__success';
            successMessage.textContent = 'Спасибо! Ваша заявка успешно отправлена.';

            form.appendChild(successMessage);

            // Удаляем сообщение через 3 секунды
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        });
    });
}

/**
 * Инициализация слайдера отзывов
 */
function setupReviewsSlider() {
    const reviewsSlider = document.querySelector('.reviews__slider');
    if (!reviewsSlider) return;

    const reviewCards = reviewsSlider.querySelectorAll('.review-card');
    if (reviewCards.length <= 1) return;

    let currentIndex = 0;
    let isAnimating = false;
    let autoplayInterval;
    const animationDuration = 500; // ms

    // Добавляем навигацию для слайдера
    const sliderNav = document.createElement('div');
    sliderNav.className = 'reviews__slider-nav';

    // Создаем кнопки "Предыдущий" и "Следующий"
    const prevButton = document.createElement('button');
    prevButton.className = 'reviews__slider-button reviews__slider-button--prev';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';

    const nextButton = document.createElement('button');
    nextButton.className = 'reviews__slider-button reviews__slider-button--next';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';

    // Добавляем точки навигации
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'reviews__slider-dots';

    reviewCards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'reviews__slider-dot';
        if (index === 0) dot.classList.add('active');

        dot.addEventListener('click', () => {
            if (isAnimating || index === currentIndex) return;
            showSlide(index);
        });

        dotsContainer.appendChild(dot);
    });

    // Добавляем навигацию к слайдеру
    sliderNav.appendChild(prevButton);
    sliderNav.appendChild(dotsContainer);
    sliderNav.appendChild(nextButton);
    reviewsSlider.appendChild(sliderNav);

    // Инициализация стилей слайдера
    reviewsSlider.style.position = 'relative';
    reviewsSlider.style.overflow = 'hidden';

    // Настраиваем контейнер для слайдов
    const sliderTrack = document.createElement('div');
    sliderTrack.className = 'reviews__slider-track';
    sliderTrack.style.display = 'flex';
    sliderTrack.style.transition = `transform ${animationDuration}ms ease`;

    // Перемещаем карточки в трек
    reviewCards.forEach(card => {
        card.style.flex = '0 0 100%';
        card.style.boxSizing = 'border-box';
        sliderTrack.appendChild(card);
    });

    // Заменяем содержимое слайдера на трек
    reviewsSlider.innerHTML = '';
    reviewsSlider.appendChild(sliderTrack);
    reviewsSlider.appendChild(sliderNav);

    // Функция показа слайда
    function showSlide(index) {
        if (isAnimating) return;
        isAnimating = true;

        const dots = dotsContainer.querySelectorAll('.reviews__slider-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        sliderTrack.style.transform = `translateX(-${index * 100}%)`;
        currentIndex = index;

        setTimeout(() => {
            isAnimating = false;
        }, animationDuration);

        // Сбрасываем таймер автопрокрутки
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    // Обработчики для кнопок
    prevButton.addEventListener('click', () => {
        if (isAnimating) return;
        const prevIndex = (currentIndex - 1 + reviewCards.length) % reviewCards.length;
        showSlide(prevIndex);
    });

    nextButton.addEventListener('click', () => {
        if (isAnimating) return;
        const nextIndex = (currentIndex + 1) % reviewCards.length;
        showSlide(nextIndex);
    });

    // Автопрокрутка
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % reviewCards.length;
            showSlide(nextIndex);
        }, 5000); // Каждые 5 секунд
    }

    // Останавливаем автопрокрутку при наведении
    reviewsSlider.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    reviewsSlider.addEventListener('mouseleave', () => {
        startAutoplay();
    });

    // Запускаем автопрокрутку
    startAutoplay();

    // Адаптивность слайдера
    window.addEventListener('resize', () => {
        sliderTrack.style.transition = 'none';
        sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        setTimeout(() => {
            sliderTrack.style.transition = `transform ${animationDuration}ms ease`;
        }, 50);
    });
}

/**
 * Функция для подсветки активного пункта меню при скролле
 */
function highlightActiveMenuItem() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__menu a');

    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.pageYOffset;
        const headerHeight = document.querySelector('.header').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = '#' + section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === current) {
                link.classList.add('active');
            }
        });
    });
}

// Заменяем оригинальную функцию setupHeroAnimation
function setupHeroAnimation() {
    const heroSection = document.querySelector('.hero--modern');
    if (!heroSection) return;

    // Анимация текста заголовка
    const titleEl = heroSection.querySelector('.hero__title');
    if (titleEl && !titleEl.classList.contains('initialized')) {
        const text = titleEl.textContent;
        const words = text.split(' ');

        let newHtml = '';
        words.forEach((word, index) => {
            if (index === words.length - 2) {
                newHtml += `<span class="hero__title-word" style="animation-delay: ${index * 0.2}s">${word} </span>`;
            } else if (index === words.length - 1) {
                newHtml += `<span class="hero__title-highlight hero__title-word" style="animation-delay: ${index * 0.2}s">${word}</span>`;
            } else {
                newHtml += `<span class="hero__title-word" style="animation-delay: ${index * 0.2}s">${word} </span>`;
            }
        });

        titleEl.innerHTML = newHtml;
        titleEl.classList.add('initialized'); // Добавляем класс, чтобы не повторять анимацию
    }

    // Параллакс эффект для фона при скролле
    window.addEventListener('scroll', function() {
        const scrollValue = window.scrollY;
        const parallaxBg = heroSection.querySelector('.hero__bg-parallax');
        if (parallaxBg && scrollValue > 0) {
            parallaxBg.style.transform = `translateY(${scrollValue * 0.2}px)`;
        }
    });
}

/**
 * Обработка прокрутки для hero-scroll
 */
function setupHeroScroll() {
    const heroScrollButton = document.querySelector('.hero__scroll');
    if (!heroScrollButton) return;

    // Добавляем обработчик клика на кнопку прокрутки вниз
    heroScrollButton.addEventListener('click', function() {
        // Находим первую секцию после hero
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        // Находим следующую секцию после hero
        let nextSection = heroSection.nextElementSibling;

        // Если следующей секции нет, прокручиваем на 100vh
        if (!nextSection) {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
            return;
        }

        // Прокручиваем к следующей секции с учетом высоты шапки
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;
        const offsetPosition = nextSection.offsetTop - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });

    // Анимация кнопки прокрутки при скролле
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            heroScrollButton.classList.add('hidden');
        } else {
            heroScrollButton.classList.remove('hidden');
        }
    });
}

/**
 * Инициализация выпадающих меню
 */
function initDropdownMenus() {
    // Обеспечиваем правильное отображение выпадающего меню
    function ensureDropdownVisibility() {
        // На десктопе
        if (window.innerWidth > 992) {
            // Сбрасываем инлайн-стили для выпадающих меню
            const dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
                // Убираем свойства, которые могут мешать отображению
                dropdown.style.display = '';
                dropdown.style.opacity = '';
                dropdown.style.visibility = '';
                dropdown.style.maxHeight = '';
                // Добавляем свойства, помогающие избежать горизонтального скролла
                dropdown.style.width = '';
                dropdown.style.minWidth = '';
                dropdown.style.maxWidth = '';
            });

            // Фиксим стили длинных ссылок в выпадающем меню
            const dropdownLinks = document.querySelectorAll('.dropdown__link');
            dropdownLinks.forEach(link => {
                link.style.whiteSpace = '';
                link.style.wordWrap = '';
                link.style.wordBreak = '';
            });

            // Убираем active-классы с мобильных меню
            const activeItems = document.querySelectorAll('.services-menu__item.active');
            activeItems.forEach(item => {
                if (!item.querySelector(':hover')) {
                    item.classList.remove('active');
                }
            });
        } else {
            // На мобильных устройствах
            const servicesItems = document.querySelectorAll('.services-menu__item');
            servicesItems.forEach(item => {
                // Добавляем обработчик клика для мобильных устройств (если еще не добавлен)
                if (!item.dataset.mobileInitialized && item.querySelector('.dropdown')) {
                    item.dataset.mobileInitialized = 'true';

                    item.addEventListener('click', function(e) {
                        // Если уже активно, то переходим по ссылке
                        if (item.classList.contains('active') && e.target.tagName === 'A' && !e.target.closest('.dropdown')) {
                            return;
                        }

                        // Иначе переключаем активное состояние
                        e.preventDefault();

                        // Закрываем все другие выпадающие меню
                        servicesItems.forEach(otherItem => {
                            if (otherItem !== item) {
                                otherItem.classList.remove('active');
                            }
                        });

                        // Переключаем текущее
                        item.classList.toggle('active');
                    });
                }
            });
        }
    }

    // Запускаем немедленно и при загрузке страницы
    ensureDropdownVisibility();
    window.addEventListener('load', ensureDropdownVisibility);
    window.addEventListener('resize', ensureDropdownVisibility);

    // Добавляем обработчики наведения для пунктов меню на десктопе
    const menuItems = document.querySelectorAll('.services-menu__item');
    menuItems.forEach(item => {
        if (item.querySelector('.dropdown')) {
            // При наведении на пункт меню
            item.addEventListener('mouseenter', function() {
                if (window.innerWidth > 992) {
                    // Устанавливаем overflow: visible для header если он в состоянии scrolling или scrolled
                    const header = document.querySelector('.header');
                    if (header && (header.classList.contains('scrolling') || header.classList.contains('scrolled'))) {
                        header.style.overflow = 'visible';

                        const headerServices = header.querySelector('.header__services');
                        if (headerServices) {
                            headerServices.style.overflow = 'visible';
                        }
                    }

                    // Делаем dropdown видимым с использованием CSS классов вместо инлайн-стилей
                    item.classList.add('hover-active');
                }
            });

            // При уходе с пункта меню
            item.addEventListener('mouseleave', function() {
                if (window.innerWidth > 992) {
                    // Удаляем класс hover-active
                    item.classList.remove('hover-active');

                    // Возвращаем оригинальные стили для header с небольшой задержкой
                    setTimeout(() => {
                        // Если в данный момент ни на один пункт не наведен курсор
                        if (!document.querySelector('.services-menu__item:hover')) {
                            const header = document.querySelector('.header');
                            if (header && (header.classList.contains('scrolling') || header.classList.contains('scrolled'))) {
                                header.style.overflow = '';

                                const headerServices = header.querySelector('.header__services');
                                if (headerServices) {
                                    headerServices.style.overflow = '';
                                }
                            }
                        }
                    }, 100);
                }
            });
        }
    });
}

/**
 * Предотвращение проблем со скроллом
 */
function preventScrollIssues() {
    // Проверяем наличие горизонтального скролла
    function checkHorizontalScroll() {
        if (document.body.offsetWidth < document.body.scrollWidth) {
            document.body.style.overflowX = 'hidden';
        }
    }

    // Исправляем проблемы с выпадающим меню на десктопе
    function fixDropdownMenu() {
        if (window.innerWidth > 992) {
            // На десктопе проверяем, если шапка в состоянии scrolling или scrolled
            const header = document.querySelector('.header');
            if (header && (header.classList.contains('scrolling') || header.classList.contains('scrolled'))) {
                // Находим меню, на которое наведен курсор
                const hoveredItem = document.querySelector('.services-menu__item:hover');
                if (hoveredItem && hoveredItem.querySelector('.dropdown')) {
                    header.style.overflow = 'visible';

                    const headerServices = header.querySelector('.header__services');
                    if (headerServices) {
                        headerServices.style.overflow = 'visible';
                    }
                } else {
                    header.style.overflow = 'hidden';

                    const headerServices = header.querySelector('.header__services');
                    if (headerServices) {
                        headerServices.style.overflow = '';
                    }
                }
            }
        }
    }

    // Запускаем проверки при загрузке, скролле и изменении размера окна
    window.addEventListener('load', checkHorizontalScroll);
    window.addEventListener('resize', checkHorizontalScroll);
    window.addEventListener('scroll', checkHorizontalScroll);

    // Запускаем проверку выпадающего меню
    window.addEventListener('mousemove', fixDropdownMenu);

    // Проверяем сейчас
    checkHorizontalScroll();
}