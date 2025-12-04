const doors = document.querySelectorAll('.door');
let contentContainer = document.getElementById('content-container');
const doorData = {}; // Object to hold door data

// Fetch door data from JSON file
fetch('./data/doors.json')
    .then(response => response.json())
    .then(data => {
        Object.assign(doorData, data);
        initializeDoors();
    })
    .catch(error => console.error('Error loading door data:', error));

// Initialize doors with event listeners
function initializeDoors() {
    doors.forEach(door => {
        door.addEventListener('click', () => {
            const day = door.dataset.day;
            openDoor(day);
        });
    });
}

// Open the door and display content
function openDoor(day) {
  // guard if doorData for this day isn't loaded yet
  const entry = doorData[day] || {};
  // always load content even if previously opened
  entry.opened = true;
  doorData[day] = entry;
  loadContent(day);
}

// Load content for the specified day
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
        document.body.appendChild(backdrop);
        contentContainer = backdrop.querySelector('#content-container');
        const closeBtn = backdrop.querySelector('#modal-close');
        closeBtn.addEventListener('click', ()=> backdrop.classList.remove('show'));
        backdrop.addEventListener('click', (e)=> { if(e.target === backdrop) backdrop.classList.remove('show'); });
      }

      contentContainer.innerHTML = (typeof marked === 'function') ? marked(content) : `<pre>${escapeHtml(content)}</pre>`;
      // show modal/backdrop if present
      const backdropEl = contentContainer.closest('.modal-backdrop');
      if(backdropEl) backdropEl.classList.add('show');

      updateDoorState(day);
    })
    .catch(error => console.error('Error loading content:', error));
}

// Update the door state in the JSON data
function updateDoorState(day) {
    // Here you can implement logic to save the updated state back to the JSON file if needed
}
(function(){
  const DAYS = 24;
  const container = document.getElementById('calendar');
  const header = document.querySelector('header');

  // captions (optional)
  const captions = Array.from({length: DAYS}, (_,i)=> `A note for day ${i+1}`);

  // Initialize sound effect - Web Audio API bell sound
  function playDoorSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioContext.currentTime;
      
      // Create a bell-like sound with multiple oscillators
      const osc1 = audioContext.createOscillator();
      const osc2 = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const gain1 = audioContext.createGain();
      const gain2 = audioContext.createGain();
      
      osc1.frequency.value = 523.25; // C5
      osc2.frequency.value = 783.99; // G5
      
      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(gain);
      gain2.connect(gain);
      gain.connect(audioContext.destination);
      
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.log('Audio not available:', e);
    }
  }

  // Initialize confetti effect
  function triggerConfetti() {
    try {
      if (typeof ConfettiGenerator !== 'undefined') {
        const canvas = document.getElementById('confetti-canvas');
        if (canvas) {
          const confetti = new ConfettiGenerator({
            target: 'confetti-canvas',
            max: 80,
            size: 4,
            animate: true,
            props: ['circle', 'square'],
            colors: [[201, 127, 127], [212, 175, 158], [232, 196, 192], [139, 59, 59]]
          });
          confetti.render();
          setTimeout(() => confetti.clear(), 3000);
        }
      }
    } catch (e) {
      console.log('Confetti not available:', e);
    }
  }

  // Update progress tracker
  function updateProgressTracker() {
    const doorsOpenedEl = document.getElementById('doors-opened');
    if (doorsOpenedEl) {
      doorsOpenedEl.textContent = opened.size;
    }
  }

  function getUnlockedCount(){
    const now = new Date();
    if(now.getMonth() === 11){ // December
      return Math.min(DAYS, now.getDate());
    }
    try{
      const params = new URLSearchParams(location.search);
      if(params.get('preview') === '1') return DAYS;
    }catch(e){}
    return 0;
  }

  const unlockedCount = getUnlockedCount();
  const storageKeyOpened = 'advent_opened';
  const storageKeyOrder = 'advent_order_v1';
  const opened = new Set(JSON.parse(localStorage.getItem(storageKeyOpened) || '[]'));

  // Fisher-Yates shuffle
  function shuffleArray(arr){
    const a = arr.slice();
    for(let i = a.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function defaultOrder(){
    return Array.from({length: DAYS}, (_,i)=> i+1);
  }

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

  function saveOrder(newOrder){
    order = newOrder.slice();
    localStorage.setItem(storageKeyOrder, JSON.stringify(order));
  }

  // (reshuffle control removed) — no button appended to the header

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

      // anchor behavior
      if(!isUnlocked){
        a.href = '#';
        a.addEventListener('click', (e)=> e.preventDefault());
      }else{
        a.href = `days/day.html?d=${fileName}`;
        a.addEventListener('click', (e)=>{
          const isFirstOpen = !opened.has(String(i));
          opened.add(String(i));
          localStorage.setItem(storageKeyOpened, JSON.stringify(Array.from(opened)));
          
          // Play sound and confetti only on first open
          if (isFirstOpen) {
            playDoorSound();
            triggerConfetti();
            updateProgressTracker();
          }
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
      localStorage.setItem(storageKeyOpened, JSON.stringify(Array.from(opened)));
      document.querySelectorAll('.door').forEach(b=> b.classList.add('opened'));
      playDoorSound();
      triggerConfetti();
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