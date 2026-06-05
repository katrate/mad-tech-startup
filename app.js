// Supabase Configuration
const SUPABASE_URL = (import.meta && import.meta.env) ? import.meta.env.VITE_SUPABASE_URL : null;
const SUPABASE_ANON_KEY = (import.meta && import.meta.env) ? import.meta.env.VITE_SUPABASE_ANON_KEY : null;

// Initialize Supabase only if valid credentials are provided
let supabase;
if (SUPABASE_URL) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Moment.js - Set current year in footer
document.getElementById('current-year').textContent = moment().format('YYYY');

// GSAP Page Load Animations
document.addEventListener("DOMContentLoaded", () => {
    // Global animations
    gsap.from('.logo', { y: -50, opacity: 0, duration: 1, ease: 'power3.out' });
    gsap.from('.nav-links li', { y: -50, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out' });

    // Page specific animations
    if (document.getElementById('home')) {
        gsap.from('#home h1', { x: -50, opacity: 0, duration: 1, delay: 0.3, ease: 'power3.out' });
        gsap.from('#home p', { x: -50, opacity: 0, duration: 1, delay: 0.5, ease: 'power3.out' });
        gsap.from('.cta-buttons', { y: 20, opacity: 0, duration: 1, delay: 0.7, ease: 'power3.out' });
        gsap.from('.orb', { scale: 0, opacity: 0, duration: 1.5, delay: 0.5, ease: 'back.out(1.7)' });
    }

    if (document.getElementById('waitlist') || document.getElementById('contact')) {
        gsap.from('.form-container', { y: 30, opacity: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' });
    }
});

// Popper.js Tooltip Setup
const tooltip = document.getElementById('tooltip');
let popperInstance = null;

function showTooltip(element, message) {
    if (!tooltip) return;
    tooltip.textContent = message;
    tooltip.setAttribute('data-show', '');
    
    if (popperInstance) {
        popperInstance.destroy();
    }
    
    popperInstance = Popper.createPopper(element, tooltip, {
        placement: 'top',
        modifiers: [
            { name: 'offset', options: { offset: [0, 8] } },
        ],
    });
}

function hideTooltip() {
    if (!tooltip) return;
    tooltip.removeAttribute('data-show');
    if (popperInstance) {
        popperInstance.destroy();
        popperInstance = null;
    }
}

// Global click to hide tooltip
document.addEventListener('click', (e) => {
    if (!e.target.matches('input, textarea, button')) {
        hideTooltip();
    }
});

// Form Handling
const waitlistForm = document.getElementById('waitlist-form');
const contactForm = document.getElementById('contact-form');

// Custom Toast Notification Logic
function showToast(title, message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-body">${message}</div>
    `;

    container.appendChild(toast);

    // GSAP Animation
    gsap.fromTo(toast, 
        { x: 100, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );

    // Auto remove after 5 seconds
    setTimeout(() => {
        gsap.to(toast, { 
            x: 100, opacity: 0, duration: 0.5, ease: 'power2.in',
            onComplete: () => toast.remove() 
        });
    }, 5000);
}

async function handleFormSubmit(e, formType) {
    e.preventDefault();
    hideTooltip();

    let isValid = true;
    let data = {};

    if (formType === 'waitlist') {
        const emailInput = document.getElementById('waitlist-email');
        const notificationsInput = document.querySelector('input[name="notifications"]:checked');

        if (!emailInput.value.trim()) {
            showTooltip(emailInput, 'Email cannot be empty.');
            isValid = false;
        } else if (!emailInput.validity.valid) {
            showTooltip(emailInput, 'Please enter a valid email address.');
            isValid = false;
        } else {
            data = {
                email: emailInput.value.trim(),
                notifications: notificationsInput.value
            };
        }
    } else if (formType === 'contact') {
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const messageInput = document.getElementById('contact-message');

        if (!nameInput.value.trim()) {
            showTooltip(nameInput, 'Name cannot be empty.');
            isValid = false;
        } else if (!emailInput.value.trim()) {
            showTooltip(emailInput, 'Email cannot be empty.');
            isValid = false;
        } else if (!emailInput.validity.valid) {
            showTooltip(emailInput, 'Please enter a valid email address.');
            isValid = false;
        } else if (!messageInput.value.trim()) {
            showTooltip(messageInput, 'Message cannot be empty.');
            isValid = false;
        } else {
            data = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim()
            };
        }
    }

    if (isValid) {
        // Supabase Integration Logic
        let dbSuccess = false;
        if (supabase) {
            try {
                const table = formType === 'waitlist' ? 'waitlist' : 'contacts';
                const { error } = await supabase.from(table).insert([data]);
                
                if (error) throw error;
                dbSuccess = true;
                console.log(`Saved to Supabase table: ${table}`);
            } catch (err) {
                console.error('Error saving to Supabase:', err.message || err);
                showToast('Database Error', `Failed to save: ${err.message || 'Unknown error'}`);
            }
        } else {
            console.warn('Supabase not initialized.');
            showToast('Setup Required', 'Please configure your .env file with your Supabase credentials.');
        }

        // Show friendly success message instead of JSON if DB succeeded (or if testing locally without DB)
        if (dbSuccess || !supabase) {
            if (formType === 'waitlist') {
                showToast('Welcome to the Future!', `Thanks for joining! We'll send updates to ${data.email}.`);
            } else {
                showToast('Message Received', `Thanks for reaching out, ${data.name || 'friend'}. We'll get back to you soon.`);
            }
        }

        // Reset form
        e.target.reset();
    }
}

if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => handleFormSubmit(e, 'waitlist'));
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => handleFormSubmit(e, 'contact'));
}

// Custom validation events for tooltip
const inputs = document.querySelectorAll('input, textarea');
inputs.forEach(input => {
    input.addEventListener('invalid', (e) => {
        e.preventDefault(); // Prevent native tooltip
        showTooltip(input, input.validationMessage || 'This field is required.');
    });
});

// Hacker News API Integration
async function fetchTechNews() {
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) return; // Only run on news page

    try {
        const response = await fetch('https://hn.algolia.com/api/v1/search?query=technology&tags=story&hitsPerPage=9');
        const data = await response.json();
        
        newsContainer.innerHTML = ''; // Clear loader
        
        if (data.hits && data.hits.length > 0) {
            data.hits.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'news-card';
                card.innerHTML = `
                    <h3><a href="${item.url || '#'}" target="_blank" rel="noopener noreferrer">${item.title}</a></h3>
                    <div class="news-meta">
                        <span>By ${item.author}</span>
                        <span>${moment(item.created_at).fromNow()}</span>
                    </div>
                `;
                newsContainer.appendChild(card);
            });
            
            // Animate cards in
            gsap.from('.news-card', { y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' });
        } else {
            newsContainer.innerHTML = '<p>No news found at the moment.</p>';
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        newsContainer.innerHTML = '<p>Failed to load the latest tech advancements. Please try again later.</p>';
    }
}

// Call fetch on load if on news page
if (document.getElementById('news')) {
    fetchTechNews();
}
