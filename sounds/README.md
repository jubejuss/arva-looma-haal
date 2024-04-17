# Hääle sobivasse kohta lohistamise mäng javascripti õppimiseks
## Kuidas see töötab?
### Kood
```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Lisame lohistamise kuulajad kirjeldustele
    document.querySelectorAll('.description').forEach(item => {
        item.addEventListener('dragstart', dragStart);
        item.addEventListener('dragend', dragEnd);
    });

    // Lisame kukutamis- ja lohistamisülekuulamise kuulajad loomadele ja nende konteineritele
    document.querySelectorAll('.animal, .animal-container').forEach(container => {
        container.addEventListener('dragover', dragOver);
        container.addEventListener('drop', drop);
    });
});

// Funktsioon, mis käivitatakse lohistamise alguses
function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);  // Salvestame lohistatava elemendi ID
}

// Funktsioon, mis käivitatakse lohistamise lõpus
function dragEnd(event) {
    event.preventDefault();  // Vaikimisi lohistamise lõpetamise käitumine
}

// Funktsioon, mis käivitatakse elementi lohistades üle mõne potentsiaalse sihtelemendi
function dragOver(event) {
    event.preventDefault();  // Võimaldame elemendi kukutamist
}

// Funktsioon, mis käivitatakse lohistatud elemendi kukutamisel sihtelemendile
function drop(event) {
    event.preventDefault();
    const descriptionId = event.dataTransfer.getData("text");
    const description = document.getElementById(descriptionId);

    // Määrame sihtelemendi, kontrollides, kas kukutati looma pildile või konteinerile
    let targetElement = event.target;
    while (targetElement && !targetElement.classList.contains('animal-container')) {
        targetElement = targetElement.parentNode;  // Liigume üles DOM puus, kuni leiame õige konteineri
    }

    if (!targetElement) {
        return;  // Kui ei leitud sobivat sihtkohta, lõpetame funktsiooni
    }

    const animalImg = targetElement.querySelector('.animal');  // Leiame looma pildi konteinerist
    if (description.dataset.animal === animalImg.id) {
        const targetRect = animalImg.getBoundingClientRect();
        const containerRect = document.getElementById('game-area').getBoundingClientRect();
        description.style.position = 'absolute';
        description.style.left = (targetRect.left - containerRect.left) + 'px';
        description.style.top = (targetRect.top - containerRect.top) + 'px';
        playSound(animalImg.id);
        showModal('Tubli! Täitsa õige, sellist häält ta täpselt teebki!');
    } else {
        playSound('error');
        showModal('No päris nii ta ei tee, proovi natuke veel, küll sa oskad');
    }
}

// Funktsioon heli esitamiseks vastavalt looma ID-le
function playSound(animal) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;  // Peata praegu mängiva heli, kui see on olemas
    }
    const soundMap = {
        'pig': 'sounds/pig.mp3',
        'dog': 'sounds/dog.mp3',
        'cow': 'sounds/cow.mp3',
        'horse': 'sounds/horse.mp3',
        'sheep': 'sounds/sheep.mp3',
        'cat': 'sounds/cat.mp3',
        'error': 'sounds/hungrysheep.mp3'  // Error heli on näiteks loomade segaheli
    };
    if (soundMap[animal]) {
        currentAudio = new Audio(soundMap[animal]);
        currentAudio.play();
    }
}

// Funktsioon modaalkasti näitamiseks koos sõnumiga
function showModal(message) {
    const modal = document.getElementById('modal');
    document.getElementById('modal-message').innerText = message;
    modal.style.display = 'flex';
}

// Funktsioon modaalkasti sulgemiseks
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Funktsioon heli peatamiseks
function stopSound() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
}

// Funktsioon algse paigutuse taastamiseks
function resetPositions() {
    document.querySelectorAll('.description').forEach(item => {
        item.style.position = 'static';  // Taastame kirjelduste algse paigutuse
    });
}

// Globaalne muutuja heli haldamiseks
let currentAudio = null;

// Klikk ükskõik kus aknas sulgeb modaalkasti
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal();
    }
}
```
### Mida miski koodijupp teeb
`document.addEventListener('DOMContentLoaded', function() { ... });` - See käivitab funktsiooni, kui HTML-dokument on täielikult laaditud ja parsitud.  
`document.querySelectorAll('.description').forEach(item => { ... });` - See valib kõik elemendid, millel on klass "description", ja rakendab igaühele sündmuskuulajaid.  
`item.addEventListener('dragstart', dragStart);` - See lisab "dragstart" sündmuskuulaja iga "description" elemendile, mis käivitub, kui elementi hakatakse lohistama.  
`item.addEventListener('dragend', dragEnd);` - See lisab "dragend" sündmuskuulaja, mis käivitub, kui lohistamise lõpetatakse.  
`function dragStart(event) { ... }` - See funktsioon käivitatakse, kui lohistamine algab. See salvestab lohistatava elemendi ID, et hiljem sellele viidata.  
`function dragEnd(event) { ... }` - See funktsioon käivitatakse, kui lohistamine lõpeb. See takistab vaikimisi lohistamise lõpetamise käitumist.  
`function dragOver(event) { ... }` - See funktsioon käivitatakse, kui lohistatud element liigub üle sihtelemendi. See takistab vaikimisi käitumist, mis ei luba elementi kukutada.  
`function drop(event) { ... }` - See funktsioon käivitatakse, kui lohistatud element kukutatakse sihtelemendile. See määrab sihtelemendi, kontrollib sobivust ning kui element kukutati õigesse kohta, siis kuvab modaalkasti vastava sõnumi.  
`function playSound(animal) { ... }` - See funktsioon mängib vastavalt looma ID-le helifaili. See peatab ka praeguse mängiva heli, kui see on olemas.  
`function showModal(message) { ... }` - See funktsioon kuvab modaalkasti koos antud sõnumiga.  
`function closeModal() { ... }` - See funktsioon sulgeb modaalkasti.  
`function stopSound() { ... }` - See funktsioon peatab mängiva heli.  
`function resetPositions() { ... }` - See funktsioon taastab elementide algse paigutuse.  
`let currentAudio = null;` - See loob globaalse muutuja heli haldamiseks.  
`window.onclick = function(event) { ... }` - See funktsioon sulgeb modaalkasti, kui klikitakse ükskõik kus aknas, välja arvatud modaalkastis.  
