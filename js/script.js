// Расширенная база данных (12 товаров для красивого скролла)
const database = [
    { id: 1, title: "Капитанская дочка", author: "Александр Пушкин", genre: "fiction", price: 450, oldPrice: 590, sale: true, instock: true, annotation: "Исторический роман о временах Пугачевского восстания, чести, верности и любви на фоне бурных исторических событий." },
    { id: 2, title: "Основы алгоритмов и структур данных", author: "Томас Кормен", genre: "study", price: 1200, oldPrice: null, sale: false, instock: true, annotation: "Фундаментальное руководство по программированию, подробно описывающее эффективные алгоритмы и структуры данных." },
    { id: 3, title: "Преступление и наказание", author: "Фёдор Достоевский", genre: "fiction", price: 490, oldPrice: 650, sale: true, instock: true, annotation: "Глубокий философский и психологический роман о границах человеческой свободы, грехе и последующем искуплении." },
    { id: 4, title: "Набор гелевых ручек премиум класса", author: "БукСтраница", genre: "stationery", price: 250, oldPrice: null, sale: false, instock: true, annotation: "Набор из 3 эргономичных ручек с мягким письмом и быстросохнущими синими чернилами." },
    { id: 5, title: "Тайны эффективного тайм-менеджмента", author: "Брайан Трейси", genre: "study", price: 680, oldPrice: 850, sale: true, instock: true, annotation: "Практическое руководство по управлению личным временем, расстановке приоритетов и достижению больших целей." },
    { id: 6, title: "Блокнот для творчества А5 на спирали", author: "БукСтраница", genre: "stationery", price: 190, oldPrice: null, sale: false, instock: true, annotation: "Стильный блокнот с плотными тонированными листами в точку, идеальный для зарисовок, конспектов и ведения планов." },
    { id: 7, title: "Мастер и Маргарита", author: "Михаил Булгаков", genre: "fiction", price: 520, oldPrice: null, sale: false, instock: false, annotation: "Бессмертный шедевр русской литературы, сочетающий в себе мистику, сатиру, философию и великую историю любви." },
    { id: 8, title: "Высшая математика в задачах и примерах", author: "Игорь Краснов", genre: "study", price: 890, oldPrice: 1100, sale: true, instock: true, annotation: "Учебное пособие со всеми необходимыми формулами, подробными разборами типовых задач по матанализу и алгебре." },
    { id: 9, title: "Набор профессиональных маркеров", author: "БукСтраница", genre: "stationery", price: 430, oldPrice: 580, sale: true, instock: true, annotation: "12 ярких цветов с двусторонними наконечниками для скетчинга, рисования, каллиграфии и выделения важных тезисов." },
    { id: 10, title: "Евгений Онегин", author: "Александр Пушкин", genre: "fiction", price: 380, oldPrice: null, sale: false, instock: true, annotation: "Энциклопедия русской жизни в стихах, вечная история неразделённой любви, светских условностей и драмы." },
    { id: 11, title: "Маркетинг без бюджета", author: "Игорь Манн", genre: "study", price: 950, oldPrice: null, sale: false, instock: true, annotation: "Ценнейшие инструменты маркетинга, которые можно запустить прямо сейчас с минимальными финансовыми вложениями." },
    { id: 12, title: "Органайзер настольный деревянный", author: "БукСтраница", genre: "stationery", price: 750, oldPrice: 990, sale: true, instock: false, annotation: "Экологичный сборный органайзер для хранения канцелярии, писем и мелочей. Сделает рабочее место уютным." }
];

// Корзина из LocalStorage
let cart = JSON.parse(localStorage.getItem('book_cart')) || [];

function saveCart() {
    localStorage.setItem('book_cart', JSON.stringify(cart));
    const el = document.getElementById('cart-count');
    if (el) el.innerText = cart.length;
}

document.addEventListener("DOMContentLoaded", () => {
    // Первичная синхронизация счетчика корзины
    if (document.getElementById('cart-count')) {
        document.getElementById('cart-count').innerText = cart.length;
    }

    // ЛОГИКА ДЛЯ ГЛАВНОЙ СТРАНИЦЫ (Вывод акционных товаров)
    if (document.getElementById('sale-grid')) {
        const saleGrid = document.getElementById('sale-grid');
        const saleItems = database.filter(b => b.sale);

        saleItems.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card';
            card.innerHTML = `
                <div class="sale-badge">Скидка!</div>
                <img src="img/book-${book.id}.png" alt="${book.title}" class="book-img" onerror="this.src='img/logo.png'">
                <div class="book-info-wrapper">
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">${book.author}</div>
                    <div class="book-footer-wrapper">
                        <div class="book-price">
                            <span>${book.price} ₽</span>
                            <span class="old-price">${book.oldPrice} ₽</span>
                        </div>
                        <a href="product.html?id=${book.id}" class="btn btn-secondary">Подробнее</a>
                        <button class="btn btn-accent" onclick="addToCart(${book.id})">В корзину</button>
                    </div>
                </div>
            `;
            saleGrid.appendChild(card);
        });
    }

    // ЛОГИКА ДЛЯ СТРАНИЦЫ КАТАЛОГА (catalog.html)
    if (document.getElementById('catalog-grid')) {
        const grid = document.getElementById('catalog-grid');
        const searchInput = document.getElementById('search-input');
        const genreFilter = document.getElementById('genre-filter');

        // Функция рендеринга карточек
        function render(items) {
            grid.innerHTML = '';
            
            if(items.length === 0) {
                grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Товары не найдены. Попробуйте изменить параметры поиска.</p>';
                return;
            }

            items.forEach(book => {
                const card = document.createElement('div');
                card.className = 'book-card';
                card.innerHTML = `
                    ${book.sale ? '<div class="sale-badge">Скидка!</div>' : ''}
                    <img src="img/book-${book.id}.png" alt="${book.title}" class="book-img" onerror="this.src='img/logo.png'">
                    <div class="book-info-wrapper">
                        <div class="book-title">${book.title}</div>
                        <div class="book-author">${book.author}</div>
                        <div class="book-footer-wrapper">
                            <div class="book-price">
                                <span>${book.price} ₽</span>
                                ${book.oldPrice ? '<span class="old-price">' + book.oldPrice + ' ₽</span>' : ''}
                            </div>
                            <a href="product.html?id=${book.id}" class="btn btn-secondary">Подробнее</a>
                            <button class="btn btn-primary" ${book.instock ? '' : 'disabled style="background:#cbd5e1; color:#94a3b8; cursor:not-allowed;"'} onclick="addToCart(${book.id})">
                                ${book.instock ? 'В корзину' : 'Нет в наличии'}
                            </button>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });
        }

        // Функция живой фильтрации (поиск + жанр)
        function filterCatalog() {
            const searchText = searchInput.value.toLowerCase().trim();
            const selectedGenre = genreFilter.value;

            const filtered = database.filter(book => {
                const matchesSearch = book.title.toLowerCase().includes(searchText) || 
                                      book.author.toLowerCase().includes(searchText);
                const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
                
                return matchesSearch && matchesGenre;
            });

            render(filtered);
        }

        // Слушатели событий ввода
        searchInput.addEventListener('input', filterCatalog);
        genreFilter.addEventListener('change', filterCatalog);

        // Проверяем, пришел ли пользователь с глобального поиска на Главной
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        const categoryParam = urlParams.get('category');

        if (searchParam) {
            searchInput.value = searchParam;
        }
        if (categoryParam) {
            genreFilter.value = categoryParam;
        }

        // Первый запуск каталога
        filterCatalog();
    }

    // ЛОГИКА ДЛЯ ФОРМЫ НА СТРАНИЦЕ "О НАС" (about.html)
    if (document.getElementById('feedback-form')) {
        const phoneInput = document.getElementById('fb-phone');
        const nameInput = document.getElementById('fb-name');
        const messageInput = document.getElementById('fb-message');

        // Живая маска ввода номера телефона
        phoneInput.addEventListener('input', (e) => {
            let input = e.target.value.replace(/\D/g, ''); // Удаляем всё, кроме цифр
            
            if (input.startsWith('7') || input.startsWith('8')) {
                input = input.substring(1);
            }
            
            let formattedValue = '+7 ';
            if (input.length > 0) {
                formattedValue += '(' + input.substring(0, 3);
            }
            if (input.length >= 4) {
                formattedValue += ') ' + input.substring(3, 6);
            }
            if (input.length >= 7) {
                formattedValue += '-' + input.substring(6, 8);
            }
            if (input.length >= 9) {
                formattedValue += '-' + input.substring(8, 11);
            }
            
            e.target.value = input.length === 0 ? '' : formattedValue;
        });

        // Строгая валидация перед отправкой формы
        document.getElementById('feedback-form').onsubmit = function(e) {
            e.preventDefault();
            
            // 1. Проверка имени на пробелы
            if (nameInput.value.trim().length < 2) {
                alert('Пожалуйста, введите корректное имя (не менее 2 символов)!');
                return;
            }

            // 2. Проверка заполненности маски телефона (ровно 18 символов)
            if (phoneInput.value.length < 18) {
                alert('Пожалуйста, введите полный номер телефона в формате +7 (XXX) XXX-XX-XX!');
                return;
            }

            // 3. Проверка сообщения на пустоту/пробелы
            if (messageInput.value.trim().length < 10) {
                alert('Пожалуйста, напишите развернутое сообщение или текст заявки (минимум 10 полезных символов)!');
                return;
            }

            alert('Ваша заявка успешно принята! Наша служба поддержки свяжется с вами в рабочее время с 09:00 до 21:00.');
            this.reset();
        };
    }

    // ЛОГИКА ДЛЯ СТРАНИЦЫ КОРЗИНЫ (cart.html)
    if (document.getElementById('cart-page-list')) {
        const cartList = document.getElementById('cart-page-list');
        const cartTotal = document.getElementById('cart-page-total');
        const orderForm = document.getElementById('orderForm');

        function renderCartPage() {
            cartList.innerHTML = '';
            
            if (cart.length === 0) {
                cartList.innerHTML = `
                    <div style="padding: 40px 0; color: var(--text-muted);">
                        <p style="margin-bottom: 15px;">Ваша корзина пуста.</p>
                        <a href="catalog.html" class="btn btn-secondary" style="max-width: 200px;">Перейти к выбору книг</a>
                    </div>
                `;
                cartTotal.innerText = '0';
                return;
            }

            let totalSum = 0;

            cart.forEach((book, index) => {
                totalSum += book.price;
                const itemRow = document.createElement('div');
                itemRow.className = 'cart-item-card';
                itemRow.innerHTML = `
                    <img src="img/book-${book.id}.png" alt="${book.title}" class="cart-item-img" onerror="this.src='img/logo.png'">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${book.title}</div>
                        <div class="cart-item-author">${book.author}</div>
                    </div>
                    <div class="cart-item-price">${book.price} ₽</div>
                    <button class="btn-delete" onclick="removeFromCart(${index})">Удалить</button>
                `;
                cartList.appendChild(itemRow);
            });

            cartTotal.innerText = totalSum;
        }

        // Глобальная функция удаления элемента из корзины по его индексу
        window.removeFromCart = function(index) {
            cart.splice(index, 1); // Удаляем один элемент
            saveCart(); // Сохраняем и обновляем шапку
            renderCartPage(); // Перерисовываем страницу корзины
        };

        // Обработка отправки заказа
        if (orderForm) {
            orderForm.onsubmit = function(e) {
                e.preventDefault();
                const deliveryType = document.getElementById('cart-delivery').value;
                const msg = deliveryType === 'pickup' 
                    ? 'Бронирование оформлено! Вы можете забрать заказ в магазине по адресу: ул. Тельмана, д. 25 ежедневно с 09:00 до 21:00.'
                    : 'Заказ принят! Наш курьер свяжется с вами для уточнения адреса доставки по г. Энгельс.';
                
                alert(msg);
                cart = []; // Очищаем корзину после заказа
                saveCart();
                renderCartPage();
            };
        }

        // Запуск рендера при открытии страницы
        renderCartPage();
    }
});

// Глобальная функция добавления в корзину
window.addToCart = function(id) {
    const item = database.find(b => b.id === id);
    if(item) {
        if (!item.instock) {
            alert('Извините, данного товара временно нет в наличии!');
            return;
        }
        cart.push(item);
        saveCart();
        alert(`Товар «${item.title}» успешно добавлен в корзину!`);
    }
};

    // БЕЗОПАСНАЯ ЛОГИКА ДЛЯ КАРТОЧКИ ТОВАРА (product.html)
    if (document.getElementById('product-layout-box')) {
        const layoutBox = document.getElementById('product-layout-box');
        const errorBox = document.getElementById('product-error');

        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        const book = database.find(b => b.id === productId);

        if (!book) {
            // Если ID неверный, прячем карточку и показываем блок ошибки
            layoutBox.style.display = 'none';
            errorBox.style.display = 'block';
        } else {
            // Заполняем существующие HTML теги данными
            document.title = book.title + " — ООО «БукСтраница»";
            document.getElementById('p-img').src = "img/book-" + book.id + ".png";
            document.getElementById('p-img').alt = book.title;
            document.getElementById('p-title').innerText = book.title;
            document.getElementById('p-author').innerText = "Автор: " + book.author;
            document.getElementById('p-annotation').innerText = book.annotation;
            document.getElementById('p-price').innerText = book.price + " ₽";

            // Определение категории литературы
            let genreText = "Канцелярия";
            if (book.genre === 'fiction') genreText = "Художественная литература";
            if (book.genre === 'study') genreText = "Учеба и бизнес";
            document.getElementById('p-genre').innerText = genreText;

            // Управление доступностью и кнопкой покупки
            const stockEl = document.getElementById('p-stock');
            const buyBtn = document.getElementById('p-buy-btn');
            if (book.instock) {
                stockEl.innerHTML = '<span style="color: #10b981; font-weight: 600;">В наличии в магазине</span>';
                buyBtn.disabled = false;
                buyBtn.onclick = function() { addToCart(book.id); };
            } else {
                stockEl.innerHTML = '<span style="color: var(--accent); font-weight: 600;">Временно отсутствует</span>';
                buyBtn.disabled = true;
                buyBtn.style.background = '#cbd5e1';
                buyBtn.style.color = '#94a3b8';
                buyBtn.style.cursor = 'not-allowed';
                buyBtn.innerText = 'Нет в наличии';
            }

            // Проверка и вывод старой цены со скидкой
            const oldPriceEl = document.getElementById('p-old-price');
            if (book.oldPrice) {
                oldPriceEl.innerText = book.oldPrice + " ₽";
                oldPriceEl.style.display = 'inline';
            } else {
                oldPriceEl.style.display = 'none';
            }
        }
    }

        // ЛОГИКА ДЛЯ ФОРМЫ РЕГИСТРАЦИИ (register.html)
    if (document.getElementById('reg-page-form')) {
        const regForm = document.getElementById('reg-page-form');
        const passInput = document.getElementById('reg-pass');
        const confirmInput = document.getElementById('reg-pass-confirm');

        regForm.onsubmit = function(e) {
            e.preventDefault();

            // Проверяем совпадение паролей
            if (passInput.value !== confirmInput.value) {
                alert('Ошибка: введенные пароли не совпадают!');
                return;
            }

            alert('Регистрация успешно завершена! Данные сохранены на клиенте.');
            this.reset();
        };
    }
