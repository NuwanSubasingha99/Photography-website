document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('imageSlider');
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const categoryElement = document.getElementById('sliderCategory');
    const descriptionElement = document.getElementById('sliderDescription');
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

    // Auto slide every 5 seconds
    let interval = setInterval(nextSlide, 5000);

    // Reset interval when manually changing slides
    function resetInterval() {
        clearInterval(interval);
        interval = setInterval(nextSlide, 5000);
    }

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

    // Update slider position, content, and trigger animations
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

        // Update category and description with animation
        const activeSlide = slides[currentIndex];
        const newCategory = activeSlide.dataset.category;
        const newDescription = activeSlide.dataset.description;

        // Trigger fade-out animation
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

    // Touch events for mobile swipe
    slider.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isMoving = true;
        slider.style.transition = 'none';
        clearInterval(interval);
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

        resetInterval();
    }, { passive: true });

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            nextSlide();
            resetInterval();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
            resetInterval();
        }
    });

    // Pause auto-sliding when hovering over the slider
    slider.addEventListener('mouseenter', function() {
        clearInterval(interval);
    });

    // Resume auto-sliding when mouse leaves the slider
    slider.addEventListener('mouseleave', function() {
        resetInterval();
    });

    // Recalculate offsets on window resize
    window.addEventListener('resize', updateSlider);
});