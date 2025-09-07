import barba from '@barba/core';
import { gsap } from 'gsap';

export function initBarba() {
  barba.init({
    prevent: ({ el }) => {
      if (el.target === '_blank' || el.href.startsWith('http')) {
        return true;
      }
      return false;
    },
    transitions: [
      {
        name: 'weather-transition',
        leave: (data) => leaveTransition(data),
        enter: (data) => enterTransition(data),
      }
    ],
    views: [
      {
        namespace: 'home',
        beforeEnter: () => beforeEnterHome(),
        afterEnter: () => afterEnterHome(),
      },
      {
        namespace: 'comparison',
        beforeEnter: () => beforeEnterComparison(),
        afterEnter: () => afterEnterComparison(),
      },
      {
        namespace: 'charts',
        beforeEnter: () => beforeEnterCharts(),
        afterEnter: () => afterEnterCharts(),
      },
      {
        namespace: 'history',
        beforeEnter: () => beforeEnterHistory(),
        afterEnter: () => afterEnterHistory(),
      }
    ]
  });
  addEventListeners();
}

function leaveTransition(data) {
  return gsap.timeline()
    .to(data.current.container, {
      opacity: 0,
      y: -50,
      duration: 0.3,
      ease: 'power2.out'
    })
    .to(data.current.container, {
      scale: 0.95,
      duration: 0.2,
      ease: 'power2.in'
    });
}

function enterTransition(data) {
  return gsap.timeline()
    .set(data.next.container, {
      opacity: 0,
      y: 50,
      scale: 0.95
    })
    .to(data.next.container, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out'
    });
}

function beforeEnterHome() {
  const weatherCards = document.querySelectorAll('.weather-card');
  if (weatherCards.length > 0) {
    gsap.fromTo('.weather-card', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
    );
  }
}

function afterEnterHome() {
  const searchBar = document.querySelector('.search-bar');
  if (searchBar) {
    gsap.fromTo('.search-bar', 
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }
    );
  }
}

function beforeEnterComparison() {
  const comparisonCards = document.querySelectorAll('.comparison-card');
  if (comparisonCards.length > 0) {
    gsap.fromTo('.comparison-card', 
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    );
  }
}

function afterEnterComparison() {
  const chartContainer = document.querySelector('.chart-container');
  if (chartContainer) {
    gsap.fromTo('.chart-container', 
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
    );
  }
}

function beforeEnterCharts() {
  const chartElements = document.querySelectorAll('.chart-element');
  if (chartElements.length > 0) {
    gsap.fromTo('.chart-element', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
    );
  }
}

function afterEnterCharts() {
  const chartAnimation = document.querySelector('.chart-animation');
  if (chartAnimation) {
    gsap.fromTo('.chart-animation', 
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );
  }
}

function beforeEnterHistory() {
  const historyItems = document.querySelectorAll('.history-item');
  if (historyItems.length > 0) {
    gsap.fromTo('.history-item', 
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
    );
  }
}

function afterEnterHistory() {
  const historyTimeline = document.querySelector('.history-timeline');
  if (historyTimeline) {
    gsap.fromTo('.history-timeline', 
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
    );
  }
}

function addEventListeners() {
  document.addEventListener('mouseover', (e) => {
    const weatherCard = e.target.closest('.weather-card');
    if (weatherCard) {
      gsap.to(weatherCard, {
        scale: 1.02,
        duration: 0.2,
        ease: 'power2.out'
      });
    }
  });
  
  document.addEventListener('mouseout', (e) => {
    const weatherCard = e.target.closest('.weather-card');
    if (weatherCard) {
      gsap.to(weatherCard, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out'
      });
    }
  });
  
  document.addEventListener('focusin', (e) => {
    const searchInput = e.target.closest('.search-input');
    if (searchInput) {
      const searchContainer = searchInput.closest('.search-container');
      if (searchContainer) {
        gsap.to(searchContainer, {
          scale: 1.02,
          duration: 0.2,
          ease: 'power2.out'
        });
      }
    }
  });
  
  document.addEventListener('focusout', (e) => {
    const searchInput = e.target.closest('.search-input');
    if (searchInput) {
      const searchContainer = searchInput.closest('.search-container');
      if (searchContainer) {
        gsap.to(searchContainer, {
          scale: 1,
          duration: 0.2,
          ease: 'power2.out'
        });
      }
    }
  });
} 