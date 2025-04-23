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

    // Quiz functionality
    const quizForm = document.querySelector('form.quiz-form');
    if (quizForm) {
        const answerOptions = quizForm.querySelectorAll('input[type="radio"]');
        const submitButton = quizForm.querySelector('button[type="submit"]');
        
        // Enable submit button only when an answer is selected
        submitButton.disabled = true;
        
        answerOptions.forEach(option => {
            option.addEventListener('change', function() {
                submitButton.disabled = false;
            });
        });
    }
}); 