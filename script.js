const textContent = [
    { title: "Abstracts", description: "Lorem ipsum dolor sit amet...", buttonColor: "#148220" },
    { title: "Action", description: "Dynamic basketball moments...", buttonColor: "#ba0606" },
    { title: "Landscapes", description: "Breathtaking natural scenery...", buttonColor: "#baa506" },
    { title: "Art", description: "Vibrant abstract creations...", buttonColor: "#f7a1a1" },
];

document.addEventListener("DOMContentLoaded", () => {
    const slider = document.getElementById("imageSlider");
    const slides = document.querySelectorAll(".slide");
    const indicators = document.querySelectorAll(".indicator");
    const categoryElement = document.getElementById("sliderCategory");
    const descriptionElement = document.getElementById("sliderDescription");
    const heroSection = document.querySelector(".hero-section");
    const exploreButton = document.querySelector(".btn-danger");
    let currentIndex = 0;
    let startX, moveX;
    let isMoving = false;

    // Set initial position and content
    updateSlider();

    // Set up indicators
    indicators.forEach((indicator) => {
        indicator.addEventListener("click", function () {
            currentIndex = Number.parseInt(this.getAttribute("data-index"));
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
        hex = hex.replace("#", "");
        const r = Number.parseInt(hex.substring(0, 2), 16);
        const g = Number.parseInt(hex.substring(2, 4), 16);
        const b = Number.parseInt(hex.substring(4, 6), 16);
        const factor = 1 - percent / 100;
        return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`;
    }

    // Update slider position, content, background, button color, and trigger animations
    function updateSlider() {
        const offsets = getSlideOffsets();
        const offset = -offsets[currentIndex];

        // Update slider position
        slider.style.transition = "transform 0.5s ease-in-out";
        slider.style.transform = `translateX(${offset}px)`;

        // Update active classes for slides
        slides.forEach((slide, index) => {
            slide.classList.toggle("active", index === currentIndex);
        });

        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle("active", index === currentIndex);
        });

        // Update category, description, background, and button color
        const activeSlide = slides[currentIndex];
        const newCategory = textContent[currentIndex].title;
        const newDescription = textContent[currentIndex].description;
        const newBackgroundImage = activeSlide.querySelector("img").src;
        const newButtonColor = textContent[currentIndex].buttonColor;

        // Set hero section background
        if (heroSection) {
            heroSection.style.backgroundImage = `url(${newBackgroundImage})`;
        }

        // Set button color and hover state
        if (exploreButton) {
            exploreButton.style.backgroundColor = newButtonColor;
            exploreButton.style.transition = "background-color 0.5s ease";
            const hoverColor = darkenColor(newButtonColor, 20);
            exploreButton.onmouseover = () => {
                exploreButton.style.backgroundColor = hoverColor;
            };
            exploreButton.onmouseout = () => {
                exploreButton.style.backgroundColor = newButtonColor;
            };
        }

        // Update text content
        if (categoryElement && descriptionElement) {
            categoryElement.textContent = newCategory;
            descriptionElement.textContent = newDescription;
        }
    }

    // Touch events for mobile swipe
    slider.addEventListener(
        "touchstart",
        (e) => {
            startX = e.touches[0].clientX;
            isMoving = true;
            slider.style.transition = "none";
        },
        { passive: true }
    );

    slider.addEventListener(
        "touchmove",
        (e) => {
            if (!isMoving) return;
            moveX = e.touches[0].clientX;
            const diff = moveX - startX;
            const offsets = getSlideOffsets();
            const currentOffset = -offsets[currentIndex];

            slider.style.transform = `translateX(${currentOffset + diff}px)`;
        },
        { passive: true }
    );

    slider.addEventListener(
        "touchend",
        (e) => {
            if (!isMoving) return;
            isMoving = false;

            slider.style.transition = "transform 0.5s ease-in-out";

            const diff = moveX - startX;

            if (diff < -50) {
                nextSlide();
            } else if (diff > 50) {
                prevSlide();
            } else {
                updateSlider();
            }
        },
        { passive: true }
    );

    // Add keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") {
            nextSlide();
        } else if (e.key === "ArrowLeft") {
            prevSlide();
        }
    });

    // Recalculate offsets on window resize
    window.addEventListener("resize", updateSlider);

    // Animation for About Section on scroll
    const aboutText = document.querySelector(".about-text");
    const aboutImage = document.querySelector(".about-image");

    function checkScroll() {
        if (!aboutText || !aboutImage) return;

        const rect = aboutText.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.8) {
            aboutText.classList.add("visible");
            aboutImage.classList.add("visible");
        }
    }

    window.addEventListener("scroll", checkScroll);
    checkScroll();
});