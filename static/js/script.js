// Sebastian Horta
// script.js

document.addEventListener("DOMContentLoaded", function () {
    console.log("Exposure Triangle App JavaScript loaded!");
    
    // Highlight active navigation item
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPath === href || (href !== '/' && currentPath.startsWith(href))) {
            link.classList.add('active');
        }
    });

    // Image hover effects for the home page
    const triangleImg = document.querySelector('.exposure-triangle-img');
    if (triangleImg) {
        triangleImg.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        triangleImg.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // Quiz functionality: handle MC vs slider questions
    const quizForm = document.querySelector('form.quiz-form');
    if (quizForm) {
        const answerOptions = quizForm.querySelectorAll('input[type="radio"]');
        const sliders = quizForm.querySelectorAll('input[type="range"]');
        const submitButton = quizForm.querySelector('button[type="submit"]');
        
        if (answerOptions.length > 0) {
            // MC: disable submit until an option is selected
            submitButton.disabled = true;
            answerOptions.forEach(option => {
                option.addEventListener('change', () => { submitButton.disabled = false; });
            });
        } else if (sliders.length > 0) {
            // Slider questions: enable submit and keep enabled on input
            submitButton.disabled = false;
            sliders.forEach(slider => {
                slider.addEventListener('input', () => { submitButton.disabled = false; });
            });
        }
    }
    
    // Enhanced interactive slider functionality
    const interactiveSlider = document.getElementById('lesson-slider');
    if (interactiveSlider) {
        const lessonTitle = document.querySelector('.lesson-title').textContent;
        const interactiveImage = document.getElementById('lesson-image');
        const imageElement = interactiveImage.querySelector('img');
        
        // Create overlay div for effects
        const overlay = document.createElement('div');
        overlay.className = 'interactive-overlay';
        Object.assign(overlay.style, {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            transition: 'all 0.3s ease'
        });
        interactiveImage.appendChild(overlay);
        
        // Handle slider changes
        interactiveSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            updateInteractiveEffect(lessonTitle, value, imageElement, overlay);
            
            // Highlight the corresponding value in the slider values
            const valueSpans = document.querySelectorAll('.slider-values span');
            if (valueSpans.length > 0) {
                valueSpans.forEach((span, i) => {
                    if (i + 1 === value) {
                        span.style.fontWeight = 'bold';
                        span.style.fontSize = '1.1rem';
                        span.style.color = '#000';
                    } else {
                        span.style.fontWeight = 'normal';
                        span.style.fontSize = '0.9rem';
                        span.style.color = '#555';
                    }
                });
            }
        });
        
        // Initialize with default value
        const defaultValue = parseInt(interactiveSlider.value);
        updateInteractiveEffect(lessonTitle, defaultValue, imageElement, overlay);
        
        // Highlight the initial value in the slider values
        const valueSpans = document.querySelectorAll('.slider-values span');
        if (valueSpans.length > 0) {
            valueSpans[defaultValue - 1].style.fontWeight = 'bold';
            valueSpans[defaultValue - 1].style.fontSize = '1.1rem';
            valueSpans[defaultValue - 1].style.color = '#000';
        }
    }
});

// Function to update interactive effects based on the lesson type
function updateInteractiveEffect(lessonTitle, value, imageElement, overlay) {
    const normalizedValue = (value - 1) / 4; // Convert 1-5 to 0-1 range
    
    switch (lessonTitle) {
        case 'ISO':
            // Higher ISO: brightness increase + noise
            imageElement.style.filter = `brightness(${1 + normalizedValue})`;
            
            // Add noise effect for higher ISO
            if (value > 2) {
                const noiseOpacity = (value - 2) * 0.15; // More noise as ISO increases
                overlay.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")';
                overlay.style.opacity = noiseOpacity;
            } else {
                overlay.style.opacity = 0;
            }
            break;
            
        case 'Shutter Speed':
            // Sharper image for slower shutter speeds (reversed effect)
            const sharpenAmount = (1 - normalizedValue) * 0.1; // Same magnitude, reversed direction
            imageElement.style.filter = `contrast(${1 + sharpenAmount})`; // Increase contrast for sharper definition
        
            // Motion trail effect for faster shutter speeds (reversed effect)
            if (value >= 4) {
                // Apply subtle motion/zoom effect for faster shutter speeds
                imageElement.style.transform = `scale(1.0 + (value - 4) * 0.05)`; // Subtle zoom for faster speeds
                imageElement.style.opacity = 0.9 + ((1 - normalizedValue) * 0.05); // Reverse opacity trend
            } else {
                imageElement.style.transform = 'scale(1)';
                imageElement.style.opacity = 1;
            }
            break;
    
    
            
        case 'Aperture':
            // Wider aperture (lower f-number) = shallower depth of field (more blur)
            const depthOfFieldBlur = (1 - normalizedValue) * 6; // More blur for wider apertures
            
            // Apply blur to the background (overlay)
            overlay.style.backdropFilter = `blur(${depthOfFieldBlur}px)`;
            overlay.style.backgroundColor = `rgba(255,255,255,${(1 - normalizedValue) * 0.2})`;
            
            imageElement.style.filter = `brightness(${1.4 - normalizedValue * 0.3})`;

            // Create vignette effect for wider apertures
            if (value < 3) {
                const vignetteAmount = (3 - value) * 10;
                overlay.style.boxShadow = `inset 0 0 ${vignetteAmount}px rgba(0,0,0,0.25)`;
            } else {
                overlay.style.boxShadow = 'none';
            }
            break;

            
        case 'Recap':
        case 'Test ISO':
            // Exposure compensation demo
            const exposureShift = normalizedValue * 2 - 1; // Range from -1 to +1
            
            // Apply exposure effects
            imageElement.style.filter = `brightness(${1 + exposureShift}) contrast(${1 + exposureShift * 0.2})`;
            overlay.style.opacity = 0;
            break;
            
        default:
            overlay.style.opacity = 0;
            imageElement.style.filter = 'none';
            imageElement.style.transform = 'none';
            break;
    }
} 