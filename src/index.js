import './style/main.css'
import './three.js'
import './typed.js'
import './all.min.js'
import Typed from './typed.js'



/**
 * Scroll Bar
 */
function scrollIndicator() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.querySelector(".scroll-user").style.height = scrolled + "%";
}

window.onscroll = () => {
    scrollIndicator();
}


/** 
 * Lazy Load
*/
const lazyLoadElements = document.querySelectorAll('.lazy-load')

for (const element of lazyLoadElements) {
    if (element.complete) {
        window.setTimeout(() => {
            element.classList.add('loaded')
        }, 1000 + Math.random() * 3000)
    }
    element.onload = () => {
        element.classList.add('loaded')
    }
}


/**
 * Typed
 */
const typed = new Typed('.type', {
    startDelay: 300,
    loop: false,
    strings: ['Développeur front-end'],
    typeSpeed: 80,
    // onComplete: function (self) { self.cursor.remove() } 
})

const typed2 = new Typed('.type2', {
    startDelay: 300,
    loop: false,
    strings: ['Mes Projets'],
    typeSpeed: 120,
    // onComplete: function (self) { self.cursor.remove() } 
})


/**
 * Reveal
 */
const revealElements = document.querySelectorAll('.reveal')
const revealItems = []
const scrollY = window.scrollY

for (const _element of revealElements) {
    const item = {}
    item.revealed = false
    item.element = _element


    const bounding = _element.getBoundingClientRect()
    item.top = bounding.top + scrollY
    item.height = bounding.height

    revealItems.push(item)
}

window.addEventListener('resize', () => {
    for (const _item of revealItems) {
        const bounding = _item.element.getBoundingClientRect()
        _item.top = bounding.top + scrollY
        _item.height = bounding.height
    }
})

window.addEventListener('scroll', () => {
    const limit = window.scrollY + window.innerHeight

    for (const _item of revealItems) {
        if (!_item.revealed && limit > _item.top + _item.height + 0.5) {
            _item.revealed = true
            _item.element.classList.add('revealed')
        }
    }
})

/**
 * Project scroll animation
 */
document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".nav-a a");
    Array.from(links).forEach(link => {
      link.addEventListener("click", event => {
        event.preventDefault();
        if (!link.classList.contains("active")) {
          links.forEach(link => link.classList.remove("active"));
          link.classList.add("active");
        }
        let targetId = link.getAttribute("href"),
          targetEl = document.querySelector(targetId),
          targetElTop = Math.floor(targetEl.getBoundingClientRect().top);
        window.scrollBy({
          top: targetElTop,
          behavior: "smooth",
        });
        window.history.pushState("", "", targetId);
      });
    });
  });