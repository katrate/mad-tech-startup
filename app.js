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
    // ── Animated stat counters (IntersectionObserver) ──
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length) {
        const animateCount = (el) => {
            const target = parseInt(el.dataset.target, 10);
            const duration = 2000;
            const start = performance.now();
            const update = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(eased * target).toLocaleString();
                if (progress < 1) requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        statNumbers.forEach(el => {
            el.textContent = '0';
            observer.observe(el);
        });
    }

    // ── Hero entrance ──
    gsap.from('.logo', { y: -50, opacity: 0, duration: 1, ease: 'power3.out' });
    gsap.from('.nav-links li', { y: -50, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out' });

    if (document.querySelector('.hero-section')) {
        gsap.from('.hero-badge',      { y: 30, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
        gsap.from('.hero-section h1', { x: -60, opacity: 0, duration: 1,   delay: 0.3, ease: 'power3.out' });
        gsap.from('.hero-section p',  { x: -60, opacity: 0, duration: 1,   delay: 0.5, ease: 'power3.out' });
        gsap.from('.cta-buttons',     { y: 20,  opacity: 0, duration: 1,   delay: 0.7, ease: 'power3.out' });
        gsap.from('.hero-trust',      { y: 20,  opacity: 0, duration: 1,   delay: 0.9, ease: 'power3.out' });
        gsap.from('.hero-img-main',   { scale: 0.85, opacity: 0, duration: 1.2, delay: 0.4, ease: 'back.out(1.7)' });
        gsap.from('.hero-img-top',    { x: 40,  opacity: 0, duration: 1,   delay: 0.7, ease: 'back.out(1.7)' });
        gsap.from('.hero-img-bot',    { x: 40,  opacity: 0, duration: 1,   delay: 0.9, ease: 'back.out(1.7)' });
        gsap.from('.orb',             { scale: 0, opacity: 0, duration: 1.5, delay: 0.5, ease: 'back.out(1.7)' });
    }

    // ── Form pages ──
    if (document.getElementById('waitlist') || document.getElementById('contact')) {
        gsap.from('.form-container', { y: 30, opacity: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' });
    }
});

// ── Interactive Particle Background ─────────────────────────────────────────
(function initParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const PARTICLE_COUNT = 80;
    const CONNECT_DIST = 130;
    const REPEL_DIST = 100;
    const REPEL_FORCE = 2.5;

    let mouse = { x: -999, y: -999 };
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = -999;
        mouse.y = -999;
    });

    class Particle {
        constructor() { this.reset(true); }

        reset(initial = false) {
            this.x = Math.random() * canvas.width;
            this.y = initial ? Math.random() * canvas.height : -10;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = Math.random() * 0.4 + 0.1;
            this.radius = Math.random() * 2 + 1;
            this.alpha = Math.random() * 0.5 + 0.2;
            this.color = Math.random() > 0.5 ? '99,102,241' : '236,72,153'; // indigo or pink
        }

        update() {
            // Cursor repulsion
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < REPEL_DIST) {
                const force = (REPEL_DIST - dist) / REPEL_DIST * REPEL_FORCE;
                this.x += (dx / dist) * force;
                this.y += (dy / dist) * force;
            }

            this.x += this.vx;
            this.y += this.vy;

            if (this.y > canvas.height + 10) this.reset();
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECT_DIST) {
                    const opacity = (1 - dist / CONNECT_DIST) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(99,102,241,${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    // Mouse spotlight glow
    function drawSpotlight() {
        if (mouse.x === -999) return;
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 200);
        grad.addColorStop(0, 'rgba(99,102,241,0.07)');
        grad.addColorStop(1, 'rgba(99,102,241,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSpotlight();
        drawConnections();
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }

    animate();
})();

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
        const notificationsInput = document.querySelector('input[name="notifications"]:checked');
        data = {
            email: window.currentUser.email,
            notifications: notificationsInput.value
        };
    } else if (formType === 'contact') {
        const nameInput = document.getElementById('contact-name');
        const messageInput = document.getElementById('contact-message');

        if (!nameInput.value.trim()) {
            showTooltip(nameInput, 'Name cannot be empty.');
            isValid = false;
        } else if (!messageInput.value.trim()) {
            showTooltip(messageInput, 'Message cannot be empty.');
            isValid = false;
        } else {
            data = {
                name: nameInput.value.trim(),
                email: window.currentUser.email,
                message: messageInput.value.trim()
            };
        }
    }

    if (isValid) {
        // Supabase Integration Logic
        let dbSuccess = false;
        if (supabase) {
            try {
                const table = formType === 'waitlist' ? 'waitlist' : 'messages';
                
                // For messages, we need an authenticated user due to RLS
                if (formType === 'contact') {
                    if (!currentUser) throw new Error("You must be signed in to send a message.");
                    data.user_id = currentUser.id;
                }

                const { error } = await supabase.from(table).insert([data]);
                
                if (error) throw error;
                dbSuccess = true;
                console.log(`Saved to Supabase table: ${table}`);
                
                // If it was a contact message, refresh the messages list
                if (formType === 'contact' && typeof loadMessages === 'function') {
                    loadMessages();
                }
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

// ── AUTHENTICATION & USER MANAGEMENT ─────────────────────────────
window.currentUser = null;

async function checkUser() {
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    window.currentUser = session?.user || null;
    updateNav();
    
    // Protect waitlist and contact pages
    if ((document.getElementById('waitlist') || document.getElementById('contact')) && !window.currentUser) {
        window.location.href = 'auth.html';
    }

    if (document.getElementById('contact') && window.currentUser) {
        loadMessages();
    }
}

function updateNav() {
    const authLinks = document.querySelectorAll('#nav-auth-link');
    authLinks.forEach(link => {
        if (window.currentUser) {
            link.innerHTML = '<i class="fa-solid fa-user"></i>';
        } else {
            link.textContent = 'Sign In';
        }
    });
}

if (supabase) {
    supabase.auth.onAuthStateChange((event, session) => {
        window.currentUser = session?.user || null;
        updateNav();
    });
    checkUser();
}

// Auth Page Handling
const authBox = document.getElementById('auth-box');
const profileBox = document.getElementById('profile-box');
const authForm = document.getElementById('auth-form');
const authToggleBtn = document.getElementById('auth-toggle-btn');
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');
const authSubmit = document.getElementById('auth-submit');
const btnSignout = document.getElementById('btn-signout');
const profileForm = document.getElementById('profile-form');

let isSignUp = false;

if (document.getElementById('auth')) {
    authToggleBtn.addEventListener('click', () => {
        isSignUp = !isSignUp;
        if (isSignUp) {
            authTitle.textContent = 'Sign Up';
            authSubtitle.textContent = 'Create a new account.';
            authSubmitBtn.textContent = 'Sign Up';
            authToggleBtn.innerHTML = 'Already have an account? <span>Sign In</span>';
            document.getElementById('signup-username-group').classList.remove('hidden');
            document.getElementById('auth-email').placeholder = 'hello@example.com';
            document.getElementById('auth-email-label').textContent = 'Email Address';
        } else {
            authTitle.textContent = 'Sign In';
            authSubtitle.textContent = 'Access your account.';
            authSubmitBtn.textContent = 'Sign In';
            authToggleBtn.innerHTML = 'Need an account? <span>Sign Up</span>';
            document.getElementById('signup-username-group').classList.add('hidden');
            document.getElementById('auth-email').placeholder = 'hello@example.com or cool_user';
            document.getElementById('auth-email-label').textContent = 'Email or Username';
        }
    });

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const loginInput = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;

        if (isSignUp) {
            const signupUsername = document.getElementById('auth-username').value.trim();
            if (!loginInput.includes('@')) {
                showToast('Error', 'Please provide a valid email to sign up.');
                return;
            }
            if (!signupUsername) {
                showToast('Error', 'Please provide a username to sign up.');
                return;
            }
            const { data, error } = await supabase.auth.signUp({ email: loginInput, password });
            if (error) showToast('Error', error.message);
            else {
                if (data.user) {
                    await supabase.from('profiles').upsert({
                        id: data.user.id,
                        email: loginInput,
                        username: signupUsername
                    });
                }
                showToast('Success', 'Account created successfully!');
                if (data.session) {
                   showProfileBox();
                   loadProfile(data.user.id);
                }
            }
        } else {
            let loginEmail = loginInput;
            if (!loginEmail.includes('@')) {
                const { data: profileData, error: profileError } = await supabase.from('profiles').select('email').eq('username', loginEmail).single();
                if (profileError || !profileData) {
                    showToast('Error', 'Username not found.');
                    return;
                }
                if (!profileData.email) {
                    showToast('Error', 'Email not linked to username. Please log in with your email and save your profile again to link them.');
                    return;
                }
                loginEmail = profileData.email;
            }
            const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
            if (error) showToast('Error', error.message);
            else {
                showToast('Success', 'Signed in successfully. Redirecting...');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        }
    });

    btnSignout.addEventListener('click', async () => {
        await supabase.auth.signOut();
        showAuthBox();
        showToast('Success', 'Signed out.');
    });

    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('profile-username')?.value;
        const bio = document.getElementById('profile-bio').value;
        const gender = document.getElementById('profile-gender').value;
        
        const { error } = await supabase.from('profiles').upsert({
            id: window.currentUser.id,
            email: window.currentUser.email,
            username,
            bio,
            gender
        });

        if (error) showToast('Error', error.message);
        else {
            showToast('Success', 'Profile updated! Redirecting...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    });
}

function showAuthBox() {
    if(authBox) authBox.classList.remove('hidden');
    if(profileBox) profileBox.classList.add('hidden');
}

function showProfileBox() {
    if(authBox) authBox.classList.add('hidden');
    if(profileBox) profileBox.classList.remove('hidden');
    if (window.currentUser) {
        loadProfile(window.currentUser.id);
    }
}

async function loadProfile(userId) {
    if (!supabase) return;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data && document.getElementById('profile-bio')) {
        if (document.getElementById('profile-username')) {
            document.getElementById('profile-username').value = data.username || '';
        }
        document.getElementById('profile-bio').value = data.bio || '';
        document.getElementById('profile-gender').value = data.gender || '';
    }
}

if (document.getElementById('auth')) {
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
            showProfileBox();
        } else {
            showAuthBox();
        }
    });
}

// ── MESSAGES CRUD (Contact Page) ─────────────────────────────
window.loadMessages = async function() {
    const list = document.getElementById('messages-list');
    if (!list || !window.currentUser) return;
    
    const { data, error } = await supabase.from('messages').select('*').eq('user_id', window.currentUser.id).order('created_at', { ascending: false });
    
    if (error) {
        console.error('Error fetching messages', error);
        return;
    }

    if (data.length === 0) {
        list.innerHTML = '<p>No messages sent yet.</p>';
        return;
    }

    list.innerHTML = data.map(msg => `
        <div class="message-card" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; transition: transform 0.3s ease, border-color 0.3s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <h4 style="margin: 0; color: var(--accent-primary); font-size: 1.1rem;"><i class="fa-regular fa-comment-dots"></i> Message</h4>
                <span style="font-size: 0.8rem; color: var(--text-secondary); background: rgba(0,0,0,0.3); padding: 0.2rem 0.6rem; border-radius: 999px;">${new Date(msg.created_at).toLocaleDateString()}</span>
            </div>
            <p style="color: var(--text-primary); line-height: 1.6; margin-bottom: 1.5rem; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px;">${msg.message}</p>
            
            ${msg.notes ? `
            <div style="margin-bottom: 1.5rem; padding-left: 1rem; border-left: 2px solid var(--accent-secondary);">
                <h5 style="margin: 0 0 0.5rem; color: var(--accent-secondary); font-size: 0.9rem;"><i class="fa-solid fa-thumbtack"></i> Notes</h5>
                <p style="margin: 0; color: var(--text-secondary); font-size: 0.95rem; font-style: italic;">${msg.notes}</p>
            </div>
            ` : ''}
            
            <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.8rem;">
                <label style="font-size: 0.8rem; color: var(--text-secondary);"><i class="fa-solid fa-pencil" style="margin-right: 0.3rem;"></i> ${msg.notes ? 'Edit Note' : 'Add a Note'}</label>
                <div style="display: flex; gap: 0.5rem;">
                    <input type="text" id="note-input-${msg.id}" placeholder="Type your note here..." style="flex: 1; padding: 0.8rem 1rem; border-radius: 8px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: white; transition: border-color 0.3s ease;">
                    <button class="btn btn-primary" onclick="updateMessageNote('${msg.id}')" style="padding: 0 1.5rem; border-radius: 8px;"><i class="fa-solid fa-check"></i></button>
                </div>
            </div>
        </div>
    `).join('');
};

window.updateMessageNote = async function(id) {
    const note = document.getElementById(`note-input-${id}`).value;
    if (!note) return showToast('Error', 'Note cannot be empty');

    const { error } = await supabase.from('messages').update({ notes: note }).eq('id', id);
    if (error) showToast('Error', error.message);
    else {
        showToast('Success', 'Note updated!');
        loadMessages();
    }
};
