document.addEventListener('DOMContentLoaded', () => {
    const doorsContainer = document.getElementById('doors-container');
    const doorsData = []; // This will hold the doors data from the JSON file

    // Fetch the doors data from the JSON file
    fetch('data/doors.json')
        .then(response => response.json())
        .then(data => {
            doorsData.push(...data);
            renderDoors();
        })
        .catch(error => console.error('Error fetching doors data:', error));

    // Function to render doors
    function renderDoors() {
        doorsData.forEach(door => {
            const doorElement = document.createElement('div');
            doorElement.classList.add('door');
            doorElement.setAttribute('data-day', door.day);
            doorElement.innerHTML = `<span>${door.day}</span>`;
            doorElement.addEventListener('click', () => openDoor(door));
            doorsContainer.appendChild(doorElement);
        });
    }

    // Function to open a door
    function openDoor(door) {
        if (!door.opened) {
            door.opened = true; // Mark the door as opened
            const contentElement = document.getElementById('content');
            fetch(`content/days/${door.day}.md`)
                .then(response => response.text())
                .then(content => {
                    contentElement.innerHTML = marked(content); // Use marked.js to convert markdown to HTML
                })
                .catch(error => console.error('Error fetching content:', error));
        }
    }
});

// placeholder app bootstrap; keep this file if referenced by index.html
(function(){
  console.info('Advent calendar: edit src/days/dayX.html to add your full content for each door.');

  // create glitter cursor element
  const gc = document.createElement('div');
  gc.className = 'glitter-cursor';
  document.body.appendChild(gc);

  let lastMove = 0;
  window.addEventListener('mousemove', (e)=>{
    lastMove = performance.now();
    gc.style.left = `${e.clientX}px`;
    gc.style.top = `${e.clientY}px`;
    gc.style.transform = 'translate(-50%,-50%) scale(1)';
  });

  // subtle pulse when hovering interactive items
  document.addEventListener('mouseover', (e)=>{
    const t = e.target.closest('a,button,input,textarea');
    if(t){
      gc.style.transform = 'translate(-50%,-50%) scale(1.6)';
    }
  });
  document.addEventListener('mouseout', (e)=>{
    const t = e.target.closest('a,button,input,textarea');
    if(!t){
      gc.style.transform = 'translate(-50%,-50%) scale(1)';
    }
  });

  // leave small trailing sparkles (optional lightweight)
  let lastSpark = 0;
  window.addEventListener('mousemove', (e)=>{
    const now = performance.now();
    if(now - lastSpark > 90){
      lastSpark = now;
      const s = document.createElement('div');
      s.style.position = 'fixed';
      s.style.left = `${e.clientX}px`;
      s.style.top = `${e.clientY}px`;
      s.style.width = '6px';
      s.style.height = '6px';
      s.style.borderRadius = '50%';
      s.style.pointerEvents = 'none';
      s.style.zIndex = 9998;
      s.style.background = 'radial-gradient(circle, rgba(255,255,255,0.95) 0 30%, rgba(255,200,120,0.9) 60%, transparent 61%)';
      s.style.transform = 'translate(-50%,-50%) scale(1)';
      s.style.opacity = '1';
      s.style.transition = 'transform .6s ease-out, opacity .6s ease-out';
      document.body.appendChild(s);
      requestAnimationFrame(()=> {
        s.style.transform = 'translate(-50%,-50%) scale(2.4)';
        s.style.opacity = '0';
      });
      setTimeout(()=> s.remove(), 650);
    }
  });

})();