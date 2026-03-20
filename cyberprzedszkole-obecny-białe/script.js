/* ================= MOBILE MENU ================= */

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMain = document.querySelector('.nav-main');
    const navLinks = document.querySelectorAll('.nav-list a');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMain.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMain.classList.remove('active');
            });
        });
    }

    /* ================= FAQ ACCORDION ================= */
    const faqBtns = document.querySelectorAll('.faq-btn');

    faqBtns.forEach(btn => {
        btn.setAttribute('type', 'button');
        btn.setAttribute('aria-expanded', 'false');

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const faqItem = this.closest('.faq-item');
            const isOpen = faqItem.classList.contains('open');

            // Zamknij wszystkie inne elementy FAQ
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('open');
            });
            document.querySelectorAll('.faq-btn').forEach(button => {
                button.setAttribute('aria-expanded', 'false');
            });

            // Otwórz / zamknij aktualny
            if (!isOpen) {
                faqItem.classList.add('open');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Rejestracja Service Workera (PWA)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker zarejestrowany:', reg.scope))
            .catch(err => console.warn('Błąd rejestracji Service Workera:', err));
    }
});

/* ================= FORM HANDLING ================= */

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

const newsletterForm = document.getElementById('newsletterForm');
const newsletterMessage = document.getElementById('newsletterMessage');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = this.name.value.trim();
        const email = this.email.value.trim();
        const phone = this.phone.value.trim();
        const organization = this.organization.value.trim();

        if (!name || !email || !phone || !organization) {
            showFormMessage('Proszę wypełnić wszystkie wymagane pola', 'error', formMessage);
            return;
        }

        if (!validateEmail(email)) {
            showFormMessage('Niepoprawny adres email', 'error', formMessage);
            return;
        }

        const auditEmail = 'audyt@cyberprzedszkole.com';
        const backendApi = ''; // Wstaw URL API jeśli posiadasz (np. https://twojadomena.pl/api/audit)
        const messageText = `Imię i nazwisko: ${name}\nEmail: ${email}\nTelefon: ${phone}\nNazwa placówki: ${organization}\nWiadomość: ${this.message.value.trim()}`;

        if (backendApi) {
            fetch(backendApi, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name, email, phone, organization, message: this.message.value.trim()}),
            })
            .then(response => {
                if (response.ok) {
                    showFormMessage('Dziękujemy! Zgłoszenie odebrane, wkrótce się skontaktujemy.', 'success', formMessage);
                    this.reset();
                } else {
                    throw new Error('Błąd serwera');
                }
            })
            .catch(() => {
                showFormMessage('Wystąpił błąd podczas wysyłania. Spróbuj ponownie lub użyj klienta poczty.', 'error', formMessage);
            });
        } else {
            const subject = encodeURIComponent(`Zamówienie audytu - ${organization}`);
            const body = encodeURIComponent(messageText);
            const mailtoLink = `mailto:${auditEmail}?subject=${subject}&body=${body}`;
            showFormMessage('Otwieram klienta poczty. Zatwierdź wysyłkę w aplikacji e-mail.', 'success', formMessage);
            window.location.href = mailtoLink;
            this.reset();
        }
    });
}

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = this.newsletter_email.value.trim();

        if (!email) {
            showFormMessage('Proszę wpisać adres email', 'error', newsletterMessage);
            return;
        }

        if (!validateEmail(email)) {
            showFormMessage('Niepoprawny adres email', 'error', newsletterMessage);
            return;
        }

        showFormMessage('✅ Dziękujemy za subskrypcję! Potwierdzenie wysłane na Twój email.', 'success', newsletterMessage);
        this.reset();
    });
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showFormMessage(message, type, element) {
    if (!element) return;
    element.textContent = message;
    element.style.color = type === 'success' ? '#10b981' : '#ef4444';
    setTimeout(() => {
        element.textContent = '';
    }, 5000);
}

/* ================= BACK TO TOP BUTTON ================= */

const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

/* ================= SMOOTH SCROLL FOR ANCHOR LINKS ================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

/* ================= SCROLL ANIMATIONS ================= */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.process-card, .pillar, .testimonial, .contact-info').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

/* ================= BLOG ARTICLE EXPAND/COLLAPSE ================= */
document.querySelectorAll('.read-more-btn').forEach(button => {
    button.addEventListener('click', () => {
        const article = button.closest('.article');
        const content = article.querySelector('.article-content');

        if (content.classList.contains('open')) {
            content.classList.remove('open');
            button.textContent = 'Czytaj więcej ↓';
        } else {
            content.classList.add('open');
            button.textContent = 'Zwróć stronę ↑';
        }
    });
});