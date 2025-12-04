const doors = document.querySelectorAll('.door'); // NodeList of door elements
let contentContainer = document.getElementById('content-container');  // Container for modal content
const doorData = {}; // Object to hold door data

// Fetch door data from JSON file
fetch('./data/doors.json') 
    .then(response => response.json()) // Parse JSON response
    .then(data => {
        Object.assign(doorData, data);
        initializeDoors();
    })
    .catch(error => console.error('Error loading door data:', error)); // Handle fetch errors

// Initialize doors with event listeners
function initializeDoors() {
    doors.forEach(door => {
        door.addEventListener('click', () => {
            const day = door.dataset.day;
            openDoor(day);
        });
    });
}

// open the door and display content
function openDoor(day) {
  // guard if doorData for this day isn't loaded yet
  const entry = doorData[day] || {};
  // always load content even if previously opened
  entry.opened = true;
  doorData[day] = entry;
  loadContent(day);
}

// load content for the specified day
function loadContent(day) {
  const fileName = String(day).padStart(2, '0');
  fetch(`./content/days/${fileName}.md`)
    .then(response => response.text())
    .then(content => {
      // create modal if contentContainer missing
      if(!contentContainer){
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        backdrop.innerHTML = `<div class="modal" role="dialog" aria-modal="true"> 
          <div id="content-container" class="modal-content"></div>
          <button id="modal-close" class="close">Close</button>
        </div>`;
        document.body.appendChild(backdrop); // append to body
        contentContainer = backdrop.querySelector('#content-container'); // update reference
        const closeBtn = backdrop.querySelector('#modal-close'); // close button
        closeBtn.addEventListener('click', ()=> backdrop.classList.remove('show')); // close on button click
        backdrop.addEventListener('click', (e)=> { if(e.target === backdrop) backdrop.classList.remove('show'); }); // close on backdrop click
      }

      contentContainer.innerHTML = (typeof marked === 'function') ? marked(content) : `<pre>${escapeHtml(content)}</pre>`;
      // show modal/backdrop if present
      const backdropEl = contentContainer.closest('.modal-backdrop');
      if(backdropEl) backdropEl.classList.add('show');

      updateDoorState(day);
    })
    .catch(error => console.error('Error loading content:', error)); // Handle fetch errors
}

// Update the door state in the JSON data
function updateDoorState(day) {
    //implement logic to save the updated state back to the JSON file if needed
}
(function(){ // IIFE to avoid polluting global scope
  const DAYS = 24;
  const container = document.getElementById('calendar');
  const header = document.querySelector('header');

  //captions (optional)
  const captions = Array.from({length: DAYS}, (_,i)=> `A note for day ${i+1}`);

  //door opening animation
  function triggerDoorOpeningAnimation(doorElement) {
    doorElement.classList.add('door-opening');
    setTimeout(() => {
      doorElement.classList.remove('door-opening');
    }, 600);
  }

  //update progress tracker
  function updateProgressTracker() {
    const doorsOpenedEl = document.getElementById('doors-opened');
    if (doorsOpenedEl) {
      doorsOpenedEl.textContent = opened.size;
    }
  }

  //snowfall animation
  function initializeSnowfall() {
    const snowContainer = document.createElement('div');
    snowContainer.className = 'snow-container';
    document.body.appendChild(snowContainer);

    function createSnowflake() {
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.style.left = Math.random() * window.innerWidth + 'px';
      const size = 2 + Math.random() * 3;
      snowflake.style.width = size + 'px';
      snowflake.style.height = size + 'px';
      const duration = 12 + Math.random() * 10;
      snowflake.style.animationDuration = duration + 's';
      snowflake.style.animationDelay = Math.random() * 2 + 's';
      snowContainer.appendChild(snowflake);

      setTimeout(() => snowflake.remove(), (duration + 2) * 1000);
    }

    //create snowflakes continuously
    setInterval(createSnowflake, 200);
    //initial burst of snowflakes
    for (let i = 0; i < 30; i++) {
      setTimeout(createSnowflake, i * 80);
    }
  }

  //create sparkle effect on door hover
  function createSparkle(event) {
    const door = event.currentTarget;
    if (!door.classList.contains('locked')) {
      for (let i = 0; i < 3; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.background = 'radial-gradient(circle, var(--gold), transparent)';
        sparkle.style.borderRadius = '50%';
        sparkle.style.boxShadow = '0 0 8px var(--gold)';

        const rect = door.getBoundingClientRect();
        sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
        sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';

        document.body.appendChild(sparkle);

        const angle = (Math.PI * 2 * i) / 3;
        const distance = 50 + Math.random() * 30;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - 20;

        sparkle.animate([
          { opacity: 1, transform: 'translate(0, 0) scale(1)' },
          { opacity: 0, transform: `translate(${tx}px, ${ty}px) scale(0)` }
        ], {
          duration: 600,
          easing: 'ease-out'
        });

        setTimeout(() => sparkle.remove(), 600);
      }
    }
  }

  //vavorites system, bookmark
  const storageKeyFavorites = 'advent_favorites';
  const favorites = new Set(JSON.parse(localStorage.getItem(storageKeyFavorites) || '[]'));

  function toggleFavorite(dayNumber) {
    if (favorites.has(String(dayNumber))) {
      favorites.delete(String(dayNumber));
    } else {
      favorites.add(String(dayNumber));
    }
    localStorage.setItem(storageKeyFavorites, JSON.stringify(Array.from(favorites)));
    updateFavoritesUI();
  }

  function updateFavoritesUI() {
    document.querySelectorAll('.door').forEach(door => {
      const day = door.dataset.day;
      if (favorites.has(String(day))) {
        door.classList.add('favorite');
      } else {
        door.classList.remove('favorite');
      }
    });
  }

  function getUnlockedCount(){ // determine how many doors are unlocked based on date
    const now = new Date();
    if(now.getMonth() === 11){ // December
      return Math.min(DAYS, now.getDate());
    }
    try{
      const params = new URLSearchParams(location.search); // dev preview mode
      if(params.get('preview') === '1') return DAYS; // all unlocked
    }catch(e){}
    return 0;
  }

  const unlockedCount = getUnlockedCount();
  const storageKeyOpened = 'advent_opened';
  const storageKeyOrder = 'advent_order_v1';
  const opened = new Set(JSON.parse(localStorage.getItem(storageKeyOpened) || '[]'));

  //Fisher-Yates shuffle algorithm to shuffle array elements in place
  function shuffleArray(arr){
    const a = arr.slice(); // create a copy to avoid mutating original
    for(let i = a.length - 1; i > 0; i--){ // iterate backwards
      const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      [a[i], a[j]] = [a[j], a[i]]; // swap elements
    }
    return a;
  }

  function defaultOrder(){ // default sequential order
    return Array.from({length: DAYS}, (_,i)=> i+1); // [1,2,...,DAYS]
  }

  //load or initialize door order from localStorage
  function loadOrder(){
    try{
      const raw = localStorage.getItem(storageKeyOrder);
      if(!raw) {
        const ord = shuffleArray(defaultOrder());
        localStorage.setItem(storageKeyOrder, JSON.stringify(ord));
        return ord;
      }
      const parsed = JSON.parse(raw);
      // validate
      if(!Array.isArray(parsed) || parsed.length !== DAYS) throw new Error('bad order');
      return parsed;
    }catch(err){
      const ord = shuffleArray(defaultOrder());
      localStorage.setItem(storageKeyOrder, JSON.stringify(ord));
      return ord;
    }
  }

  let order = loadOrder();

  //save updated order to localStorage
  function saveOrder(newOrder){
    order = newOrder.slice();
    localStorage.setItem(storageKeyOrder, JSON.stringify(order));
  }

  //render the calendar doors
  function render(){
    container.innerHTML = '';
    for(const day of order){
      const i = day; // actual day number
      const isUnlocked = i <= unlockedCount;
      const fileName = String(i).padStart(2,'0');
      const a = document.createElement('a');
      a.className = 'door' + (isUnlocked ? '' : ' locked') + (opened.has(String(i)) ? ' opened' : '');
      a.setAttribute('data-day', i);
      a.setAttribute('aria-label', `Day ${i} ${isUnlocked ? 'open' : 'locked'}`);

      // build content: image tile (if present) + fallback number + caption
      const img = document.createElement('img');
      img.className = 'door-art';
      img.alt = `Door ${i}`;
      // try multiple possible filenames/extensions and formats (zero-padded or not)
      const num = Number(fileName);
      const candidates = [
        `img/door-${fileName}.png`,
        `img/door-${fileName}.jpeg`,
        `img/door-${fileName}.jpg`,
        `img/door${num}.jpeg`,
        `img/door${num}.jpg`,
        `img/door${num}.png`,
        `img/door-${num}.jpeg`,
        `img/door-${num}.jpg`
      ];
      let tryIndex = 0;
      function tryNextSrc(){
        if(tryIndex >= candidates.length){
          // no image found -> remove image element so badge is visible
          img.remove();
          return;
        }
        img.src = candidates[tryIndex++];
      }
      img.addEventListener('error', tryNextSrc);
      // start trying
      tryNextSrc();

      const numBadge = document.createElement('div');
      numBadge.className = 'num-badge';
      numBadge.textContent = i;

      const caption = document.createElement('div');
      caption.className = 'caption';
      caption.textContent = captions[i-1];

      // anchor behavior based on locked/unlocked state 
      if(!isUnlocked){
        a.href = '#';
        a.addEventListener('click', (e)=> e.preventDefault());
      }else{
        a.href = `days/day.html?d=${fileName}`;
        a.addEventListener('click', (e)=>{
          const isFirstOpen = !opened.has(String(i));
          opened.add(String(i));
          localStorage.setItem(storageKeyOpened, JSON.stringify(Array.from(opened)));
          
          // trigger animation and update progress only on first open 
          if (isFirstOpen) {
            e.preventDefault();
            triggerDoorOpeningAnimation(a);
            updateProgressTracker();
            //navigate after animation completes
            setTimeout(() => {
              window.location.href = a.href;
            }, 650);
          }
        });
        
        // add hover sparkle effect 
        a.addEventListener('mouseenter', createSparkle);
        
        // right-click to toggle favorite
        a.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          toggleFavorite(i);
        });
      }

      a.appendChild(img);
      a.appendChild(numBadge);
      a.appendChild(caption);
      container.appendChild(a);
    }
  }

  // initial render 
  render();
  updateProgressTracker();
  updateFavoritesUI();
  initializeSnowfall();

  // small dev shortcut: press O to open all unlocked
  window.addEventListener('keydown', (e)=>{
    if(e.key.toLowerCase()==='o'){
      const arr = [];
      for(const d of order){
        if(d <= unlockedCount){
          opened.add(String(d));
          arr.push(String(d));
        }
      }
      // persist opened doors
      localStorage.setItem(storageKeyOpened, JSON.stringify(Array.from(opened)));
      document.querySelectorAll('.door').forEach(b=> {
        b.classList.add('opened');
        triggerDoorOpeningAnimation(b);
      });
      updateProgressTracker();
    }
  });

})();

// utility: simple html escape for fallback
function escapeHtml(unsafe){
  return unsafe.replace(/[&<>"']/g, function(m){
    switch(m){
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#039;';
    }
  });
}