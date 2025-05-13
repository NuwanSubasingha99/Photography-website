const textContent = [
    { title: "Abstracts", description: "Lorem ipsum dolor sit amet...", buttonColor: "#148220" }, 
    { title: "Action", description: "Dynamic basketball moments...", buttonColor: "#ba0606" }, 
    { title: "Landscapes", description: "Breathtaking natural scenery...", buttonColor: "#baa506" }, 
    { title: "Art", description: "Vibrant abstract creations...", buttonColor: "#f7a1a1" } 
];

document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('imageSlider');
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const categoryElement = document.getElementById('sliderCategory');
    const descriptionElement = document.getElementById('sliderDescription');
    const heroSection = document.querySelector('.hero-section');
    const exploreButton = document.querySelector('.btn-danger');
    let currentIndex = 0;
    let startX, moveX;
    let isMoving = false;

    // Set initial position and content
    updateSlider();

    // Set up indicators
    indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            currentIndex = parseInt(this.getAttribute('data-index'));
            updateSlider();
        });
    });

    // Next slide function
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    }

    // Previous slide function
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
    }

    // Calculate cumulative offsets for each slide
    function getSlideOffsets() {
        const offsets = [0];
        let cumulativeWidth = 0;
        slides.forEach((slide, index) => {
            if (index > 0) {
                cumulativeWidth += slides[index - 1].offsetWidth + 15; // Include margin-right
                offsets.push(cumulativeWidth);
            }
        });
        return offsets;
    }

    // Function to darken a hex color for hover state
    function darkenColor(hex, percent) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const factor = 1 - percent / 100;
        return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`;
    }

    // Update slider position, content, background, button color, and trigger animations
    function updateSlider() {
        const offsets = getSlideOffsets();
        const offset = -offsets[currentIndex];

        // Update slider position
        slider.style.transition = 'transform 0.5s ease-in-out';
        slider.style.transform = `translateX(${offset}px)`;

        // Update active classes for slides
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentIndex);
        });

        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });

        // Update category, description, background, and button color
        const activeSlide = slides[currentIndex];
        const newCategory = textContent[currentIndex].title;
        const newDescription = textContent[currentIndex].description;
        const newBackgroundImage = activeSlide.querySelector('img').src;
        const newButtonColor = textContent[currentIndex].buttonColor;

        // Set hero section background
        if (heroSection) {
            heroSection.style.backgroundImage = `url(${newBackgroundImage})`;
        }

        // Set button color and hover state
        if (exploreButton) {
            exploreButton.style.backgroundColor = newButtonColor;
            exploreButton.style.transition = 'background-color 0.5s ease'; // Smooth color transition
            // Dynamically set hover state
            const hoverColor = darkenColor(newButtonColor, 20); // Darken by 20%
            // Remove existing hover styles and add new one
            exploreButton.onmouseover = () => {
                exploreButton.style.backgroundColor = hoverColor;
            };
            exploreButton.onmouseout = () => {
                exploreButton.style.backgroundColor = newButtonColor;
            };
        }

        // Trigger fade-out animation
        if (categoryElement && descriptionElement) {
            categoryElement.classList.add('fade-out');
            descriptionElement.classList.add('fade-out');

            // Wait for animation to complete, then update content and fade in
            setTimeout(() => {
                categoryElement.textContent = newCategory;
                descriptionElement.textContent = newDescription;
                categoryElement.classList.remove('fade-out');
                descriptionElement.classList.remove('fade-out');
                categoryElement.classList.add('fade-in');
                descriptionElement.classList.add('fade-in');

                // Remove fade-in class after animation
                setTimeout(() => {
                    categoryElement.classList.remove('fade-in');
                    descriptionElement.classList.remove('fade-in');
                }, 500); // Match animation duration
            }, 500); // Match fade-out duration
        }
    }

    // Touch events for mobile swipe
    slider.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isMoving = true;
        slider.style.transition = 'none';
    }, { passive: true });

    slider.addEventListener('touchmove', function(e) {
        if (!isMoving) return;
        moveX = e.touches[0].clientX;
        const diff = moveX - startX;
        const offsets = getSlideOffsets();
        const currentOffset = -offsets[currentIndex];

        // Apply the drag offset
        slider.style.transform = `translateX(${currentOffset + diff}px)`;
    }, { passive: true });

    slider.addEventListener('touchend', function(e) {
        if (!isMoving) return;
        isMoving = false;

        // Restore transition
        slider.style.transition = 'transform 0.5s ease-in-out';

        const diff = moveX - startX;

        // Determine if we should change slides
        if (diff < -50) {
            nextSlide();
        } else if (diff > 50) {
            prevSlide();
        } else {
            updateSlider();
        }
    }, { passive: true });

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });

    // Recalculate offsets on window resize
    window.addEventListener('resize', updateSlider);
});