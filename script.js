const textContent = [
  { title: "Abstracts", description: "Lorem ipsum dolor sit amet...", buttonColor: "#148220" },
  { title: "Action", description: "Dynamic basketball moments...", buttonColor: "#ba0606" },
  { title: "Landscapes", description: "Breathtaking natural scenery...", buttonColor: "#baa506" },
  { title: "Art", description: "Vibrant abstract creations...", buttonColor: "#f7a1a1" },
]

document.addEventListener("DOMContentLoaded", () => {
  const categoryElement = document.getElementById("sliderCategory")
  const descriptionElement = document.getElementById("sliderDescription")
  const heroSection = document.querySelector(".hero-section")

  // Initialize Owl Carousel
  const owl = $("#imageSlider").owlCarousel({
    center: true,
    items: 1,
    loop: true,
    margin: 20,
    nav: true,
    dots: true,
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
    responsive: {
      0: {
        items: 1,
        margin: 10
      },
      768: {
        items: 1.5
      },
      992: {
        items: 1.8
      }
    },
    onInitialized: updateContent,
    onTranslated: updateContent
  })

  // Function to update content based on active slide
  function updateContent(event) {
    const activeItem = $(event.target).find('.owl-item.active.center .item')
    if (activeItem.length) {
      const category = activeItem.data('category')
      const description = activeItem.data('description')
      const backgroundImage = activeItem.find('img').attr('src')

      // Update text content with fade effect
      categoryElement.style.opacity = "0"
      descriptionElement.style.opacity = "0"

      setTimeout(() => {
        categoryElement.textContent = category
        descriptionElement.textContent = description
        categoryElement.style.opacity = "1"
        descriptionElement.style.opacity = "1"
      }, 300)

      // Update background image
      if (heroSection) {
        heroSection.style.backgroundImage = `url(${backgroundImage})`
      }
    }
  }

  // Animation for About Section on scroll
  const aboutText = document.querySelector(".about-text")
  const aboutImage = document.querySelector(".about-image")

  function checkScroll() {
    if (!aboutText || !aboutImage) return

    const rect = aboutText.getBoundingClientRect()
    if (rect.top <= window.innerHeight * 0.8) {
      aboutText.classList.add("visible")
      aboutImage.classList.add("visible")
    }
  }

  window.addEventListener("scroll", checkScroll)
  checkScroll()
})
