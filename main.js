const slider = document.querySelector(".image-slider-div"), 
    slides = Array.from(document.querySelectorAll(".image-slider--item")),
    indicators = Array.from(document.querySelectorAll(".indicator"))

let isDragging = false,
    startPos = 0,
    currentTranslate = 0,
    prevTranslate = 0,
    animationID = 0,
    currentIndex = 0

slides.forEach((slide, index) => {
    const slideImage = slide.querySelector("img")
    // slideImage.addEventListener("dragstart", (e) => e.preventDefault())

    // Touch events
    slide.addEventListener("touchstart", touchStart(index))
    slide.addEventListener("touchend", touchEnd)
    slide.addEventListener("touchmove", touchMove)

    // Mouse events
    slide.addEventListener("mousedown", touchStart(index))
    slide.addEventListener("mouseup", touchEnd)
    slide.addEventListener("mouseleave", touchEnd)
    slide.addEventListener("mousemove", touchMove)
})


// Disable context menu
slider.oncontextmenu = function(event) {
    event.preventDefault()
    event.stopPropagation()
    return false
}

function touchStart(index) {
    return function(event) {
        currentIndex = index
        startPos = getPositionX(event)
        isDragging = true

        animationID = requestAnimationFrame(animation)
        slider.classList.add("grabbing")
    }
}

function touchEnd() {
    isDragging = false
    cancelAnimationFrame(animationID)

    const movedBy = currentTranslate - prevTranslate

    if(movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1

    if(movedBy > 100 && currentIndex > 0) currentIndex -= 1

    setPositionByIndex()

    slider.classList.remove("grabbing")
}

function touchMove(event) {
   if (isDragging) {
      const currentPosition = getPositionX(event)
      currentTranslate = prevTranslate + currentPosition - startPos 
   }
}

function getPositionX(event) {
    return event.type.includes("mouse") 
    ? event.pageX 
    : event.touches[0].clientX
}

function animation() {

    if(isDragging) {
        setSliderPosition()
        requestAnimationFrame(animation)
    }
}

function setSliderPosition() {
    slider.style.transform = `translateX(${currentTranslate}px)
    `
}

function setPositionByIndex() {
    currentTranslate = currentIndex * -window.innerWidth
    prevTranslate = currentTranslate

    indicators.forEach(indicator => {
        if(indicator.classList.contains("indicator-active")) {
            indicator.classList.remove("indicator-active")
        }
    })
    indicators[currentIndex].classList.add("indicator-active")
    setSliderPosition()
}



// loading animation
function animationLogic() {
    if (sessionStorage.getItem("hasAnimationRan")) {
        document.querySelector(".loading-overlay").classList.remove("loading-animation")
        document.querySelector("body").classList.remove("no-overflow")
    } else {
        sessionStorage.setItem("hasAnimationRan", "true")
        document.querySelector("body").style.overflow = "hidden"
        // document.querySelector(".loading-bar").style.overflow = "hidden"
        setTimeout(e => {
            document.querySelector(".loading-bar").innerHTML = `<p>Vítejte!</p>`
        }, 8300)
        setTimeout((e) => {
            document.querySelector("body").style.overflow = "initial"
            // window.location.reload()
        }, 10000)
        
    }
}

animationLogic()




