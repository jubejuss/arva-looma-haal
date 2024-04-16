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

function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);  // Salvestame lohistatava elemendi ID
}

function dragEnd(event) {
    event.preventDefault();  // Vaikimisi lohistamise lõpetamise käitumine
}

function dragOver(event) {
    event.preventDefault();  // Võimaldame elemendi kukutamist
}

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

function showModal(message) {
    const modal = document.getElementById('modal');
    document.getElementById('modal-message').innerText = message;
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function stopSound() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
}

function resetPositions() {
    document.querySelectorAll('.description').forEach(item => {
        item.style.position = 'static';  // Taastame kirjelduste algse paigutuse
    });
}

// Globaalne muutuja heli haldamiseks
let currentAudio = null;

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal();
    }
}
