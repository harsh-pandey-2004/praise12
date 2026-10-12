const blockedEmailDomains = [
    "gmail.com",
    "yahoo.com",
    "yahoo.in",
    "outlook.com",
    "hotmail.com",
    "live.com",
    "icloud.com",
    "aol.com",
    "protonmail.com",
    "zoho.com"
];

const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');

if (btn && menu) {
    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });
}

const modal = document.getElementById('leadModal');
const modalPanel = document.getElementById('modal-panel');

function openModal() {
    if (modal && modalPanel) {
        modal.classList.remove('invisible', 'opacity-0');
        setTimeout(() => {
             modalPanel.classList.remove('opacity-0', 'scale-95');
             modalPanel.classList.add('opacity-100', 'scale-100');
        }, 10);
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (modal && modalPanel) {
        modalPanel.classList.remove('opacity-100', 'scale-100');
        modalPanel.classList.add('opacity-0', 'scale-95');
        
        setTimeout(() => {
            modal.classList.add('invisible', 'opacity-0');
        }, 300);
        
        document.body.style.overflow = 'auto';
    }
}

const stickyBtn = document.getElementById('mobile-sticky-btn');
const heroSection = document.getElementById('home');

if (stickyBtn && heroSection) {
    window.addEventListener('scroll', () => {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        if (heroBottom < 0) {
            stickyBtn.classList.remove('translate-y-full');
        } else {
            stickyBtn.classList.add('translate-y-full');
        }
    });
}


document.querySelectorAll('.phone-input').forEach(input => {
    input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
        
        if (e.target.value.length > 10) {
            e.target.value = e.target.value.slice(0, 10);
        }
    });
});


function handleFormSubmit(event) {
    event.preventDefault();
    /* 
    // event.preventDefault(); // Commented out for debugging: Allow native submission
    */
    // Reverting to AJAX submission now that we know the issue is lack of web server.
    
    // We will still validate the phone number, but then let the form slide naturally to FormSubmit.co
    // so the user can see if they need to activate the email.
    const form = event.target;
    const phoneInput = form.querySelector('input[type="tel"]');
    
    if (phoneInput && phoneInput.value.length !== 10) {
        alert('Please enter a valid 10-digit phone number.');
        return;
    }
const emailInput = form.querySelector('input[type="email"]');
    if (emailInput) {
        const email = emailInput.value.trim().toLowerCase();
        const domain = email.split('@')[1];

        if (!domain || blockedEmailDomains.includes(domain)) {
            alert(
                'Please enter your work email address.\n' +
                'Personal email domains like Gmail, Yahoo, Outlook are not allowed.'
            );
            emailInput.focus();
            return;
        }
    }
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerText;
    
    button.innerText = 'Sending...';
    button.disabled = true;
    button.classList.add('opacity-75');

    // FormSubmit.co AJAX Endpoint
    // PLEASE REPLACE 'YOUR_EMAIL_ADDRESS' with your actual email address
    const endpoint = "https://formsubmit.co/ajax/Contact@kaizentrainingsolutions.com";

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Optional: Add configuration
    data["_subject"] = "New Lead from Kaizen Website";
    data["_template"] = "table"; // Uses a nice table format for the email
    data["_captcha"] = "false"; // Disable captcha to prevent issues with AJAX submission

    fetch(endpoint, {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        button.innerText = 'Sent Successfully!';
        button.classList.remove('bg-brand');
        button.classList.add('bg-green-600');
        setTimeout(() => {
            window.location.href = 'thanks.html';
        }, 1000);
    })
    .catch(error => {
        button.innerText = 'Failed to Send';
        alert('Failed to send enquiry. Please try again.');
        console.error('Error:', error);
        button.disabled = false;
        button.classList.remove('opacity-75');
        button.innerText = originalText;
    });
}

let currentSlide = 0;
const track = document.getElementById('slider-track');
const slides = track ? track.children : [];
const dots = document.querySelectorAll('#testimonial-slider + button + button + div button');

function updateSlide() {
    if (!track || slides.length === 0) return;
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = 'translateX(-' + (slideWidth * currentSlide) + 'px)';
    
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.remove('bg-gray-300', 'hover:bg-brand');
            dot.classList.add('bg-brand');
        } else {
            dot.classList.add('bg-gray-300', 'hover:bg-brand');
            dot.classList.remove('bg-brand');
        }
    });
}

function nextSlide() {
    if (!track) return;
    currentSlide++;
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }
    updateSlide();
}

function prevSlide() {
    if (!track) return;
    currentSlide--;
    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    updateSlide();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlide();
}

if (track) {
    setInterval(nextSlide, 5000);
}

window.addEventListener('load', updateSlide);
window.addEventListener('resize', updateSlide);


function toggleFaq(button) {
    // console.log('FAQ Toggled:', button);
    const content = button.nextElementSibling;
    const icon = button.querySelector('i');
    const isActive = content.classList.contains('active');

    // Accordion: Close all others
    document.querySelectorAll('.faq-content').forEach(item => {
        if (item !== content && item.classList.contains('active')) {
            item.classList.remove('active');
            item.style.maxHeight = null;
            const otherBtn = item.previousElementSibling;
            const otherIcon = otherBtn.querySelector('i');
            if (otherIcon) {
                otherIcon.classList.remove('fa-minus');
                otherIcon.classList.add('fa-plus');
                otherIcon.style.transform = 'rotate(0deg)';
            }
        }
    });

    if (!isActive) {
        content.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
        icon.style.transform = 'rotate(180deg)';
        
        // Ensure the item stays in view if it expands off screen, but don't force a jump if already visible
        const rect = button.getBoundingClientRect();
        if (rect.top < 100) {
             button.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } else {
        content.classList.remove('active');
        content.style.maxHeight = null;
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
        icon.style.transform = 'rotate(0deg)';
    }
}


// Scroll to Top
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.remove('opacity-0', 'invisible', 'translate-y-10');
            scrollToTopBtn.classList.add('opacity-100', 'visible', 'translate-y-0');
        } else {
            scrollToTopBtn.classList.add('opacity-0', 'invisible', 'translate-y-10');
            scrollToTopBtn.classList.remove('opacity-100', 'visible', 'translate-y-0');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function expandCard(card) {
    // Remove active class from all cards
    document.querySelectorAll('.expanding-card').forEach(c => {
        c.classList.remove('active');
    });
    // Add active class to clicked card
    card.classList.add('active');
}

function toggleTestimonial(btn) {
    const container = btn.closest('.testimonial-content');
    if (!container) return;
    const text = container.querySelector('.testimonial-text');
    if (!text) return;
    
    const isExpanded = text.classList.toggle('expanded');
    btn.innerText = isExpanded ? 'Read Less' : 'Read More';
}
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    // If mobile menu is open, close it
    const menu = document.getElementById('mobile-menu');
    if (menu && !menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
    }
}

