var kurs = sessionStorage.getItem('kurs');

console.log(`Checking key: Group1_${kurs}_filesBySection_3`);
console.log(localStorage.getItem(`Group1_${kurs}_filesBySection_3`));
console.log(kurs);

// localStorage.setItem(`Group1_${kurs}_pointsBySection_Assignment01`, "9");

const assignmentPeriods = {
    1: { startDate: new Date('2023-01-01T09:00:00'), endDate: new Date('2023-02-01T23:59:59') },
    2: { startDate: new Date('2023-01-15T10:00:00'), endDate: new Date('2023-02-15T22:00:00') },
    3: { startDate: new Date('2024-01-01T08:00:00'), endDate: new Date('2025-02-01T23:59:59') },
    4: { startDate: new Date('2025-03-01T09:30:00'), endDate: new Date('2026-04-01T21:00:00') }
};

const currentDate = new Date();

document.addEventListener('DOMContentLoaded', function() {
    var titel = document.querySelector('h1');
    // var kurs = sessionStorage.getItem('kurs');
    titel.textContent = kurs;

    var img = document.createElement('img');
    img.src = '../style/avatar.png';
    img.classList.add('posAvatar');
    document.body.appendChild(img);

    var bubble = document.createElement('div');
    bubble.classList.add('speech-bubble');

    var closeButton = document.createElement('div');
    closeButton.classList.add('closeButton');
    closeButton.textContent = 'X';
    closeButton.addEventListener('click', function() {
        document.body.removeChild(img);
        document.body.removeChild(bubble);
        document.body.removeChild(closeButton);
    });
    document.body.appendChild(closeButton);

    var currentDate = new Date();
    var dueDate = new Date('2025-02-01T23:59:59');
    var timeDifference = dueDate - currentDate;

    var daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    var hoursRemaining = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    bubble.textContent = `Du hast noch ${daysRemaining} Tage und ${hoursRemaining} Stunden Zeit für Assignment 03`;

    document.body.appendChild(bubble);
});

function zurück(){
    window.location.href = sessionStorage.getItem('letzteSeiteK');
}
// Hilfsfunktion zur Umwandlung eines ArrayBuffers in einen Base64-String
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const length = bytes.byteLength;
    for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function saveEvaluationToLocalStorage(sectionId, file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const fileData = {
            name: file.name,
            type: file.type,
            size: file.size,
            content: arrayBufferToBase64(event.target.result) //Datei als Base64 codieren
        };
        let files = [];
        files.push(fileData);
        localStorage.setItem(`Group1_${kurs}_evaluationBySection_${sectionId}`, JSON.stringify(files));
    };
    reader.readAsArrayBuffer(file);
}
saveEvaluationToLocalStorage(1, new File(["Bewertung für A1"], "Bewertung_A1.txt"));

function saveFileToLocalStorage(sectionId, file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const fileData = {
            name: file.name,
            type: file.type,
            size: file.size,
            content: arrayBufferToBase64(event.target.result) //Datei als Base64 codieren
        };
        let files = [];
        files.push(fileData);
        localStorage.setItem(`Group1_${kurs}_filesBySection_${sectionId}`, JSON.stringify(files));
    };
    reader.readAsArrayBuffer(file);
}
saveFileToLocalStorage(1, new File(["Abgabe A1"], "Assignment1.txt"));
saveFileToLocalStorage(2, new File(["Abgabe A2"], "Assignment2.txt"));

function getFilesFromLocalStorage(sectionId) {
    const files = JSON.parse(localStorage.getItem(`Group1_${kurs}_filesBySection_${sectionId}`)) || [];
    return files.map(fileData => {
        const { name, type, content } = fileData;
        const decodedContent = atob(content); // Base64-Dekodierung
        const blob = new Blob([decodedContent], { type });
        return new File([blob], name, { type });
    });
}
function getEvaluationsFromLocalStorage(sectionId) {
    const files = JSON.parse(localStorage.getItem(`Group1_${kurs}_evaluationBySection_${sectionId}`)) || [];
    return files.map(fileData => {
        const { name, type, content } = fileData;
        const decodedContent = atob(content); // Base64-Dekodierung
        const blob = new Blob([decodedContent], { type });
        return new File([blob], name, { type });
    });
}

const uploadSections = document.querySelectorAll('.upload-section');

uploadSections.forEach((section) => {
    const sectionId = parseInt(section.dataset.section);
    const uploadZone = section.querySelector('.upload-box');
    const fileInput = section.querySelector('.file-input');
    const downloadBtn = section.querySelector('.download-box[data-download]');
    const evaluationDownloadBtn = section.querySelector('.evaluation-box');
    const checkbox = section.querySelector('input[type="checkbox"]');
    const assignment = section.querySelector('td h2');
    const pointsInput = section.querySelector('input[type="number"]'); // Punkte-Feld
    const endDateElement = section.querySelector('td:nth-child(5) h3'); // 5. Spalte für Datum
    const endTimeElement = section.querySelector('td:nth-child(6) h3'); // 6. Spalte für Uhrzeit
    
    const period = assignmentPeriods[sectionId];
    const isBeforeStart = currentDate < period.startDate;
    const isAfterEnd = currentDate > period.endDate;
    const isInProgress = !isBeforeStart && !isAfterEnd;
    
    function formatDateTime(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return {
            date: `${day}.${month}.${year}`,
            time: `${hours}:${minutes}`
        };
    }

    // Enddatum und Uhrzeit anzeigen
    if (endDateElement && endTimeElement) {
        const formattedDateTime = formatDateTime(period.endDate);
        endDateElement.textContent = `bis: ${formattedDateTime.date}`;
        endTimeElement.textContent = `${formattedDateTime.time} Uhr`;
    }

    // Punktefeld immer deaktivieren, Punkte anzeigen falls da
    if (pointsInput) {
        pointsInput.value = localStorage.getItem(`Group1_${kurs}_pointsBySection_Assignment 0${sectionId}`) || '';
        console.log(`Group1_${kurs}_pointsBySection_Assignment 0${sectionId}`);
        pointsInput.disabled = true;
    }
    
    uploadZone.style.pointerEvents = isInProgress ? 'auto' : 'none';
    uploadZone.style.opacity = isInProgress ? '1' : '0.5';
    fileInput.disabled = !isInProgress;

    const storedFiles = getFilesFromLocalStorage(sectionId);
    if (storedFiles.length > 0) {
        assignment.style.color = 'green';
        checkbox.checked = true;
        checkbox.classList.remove('unchecked');
        checkbox.classList.add('checked');
        downloadBtn.style.pointerEvents = 'auto';
        downloadBtn.style.opacity = '1';
    } else {
        assignment.style.color = 'red';
        checkbox.checked = false;
        checkbox.classList.remove('checked');
        checkbox.classList.add('unchecked');
        downloadBtn.style.pointerEvents = 'none';
        downloadBtn.style.opacity = '0.5';
    }

    if(evaluationDownloadBtn){
        const evaluations = getEvaluationsFromLocalStorage(sectionId);
        if (evaluations.length > 0) {
            evaluationDownloadBtn.style.pointerEvents = 'auto';
            evaluationDownloadBtn.style.opacity = '1';

            evaluationDownloadBtn.addEventListener('click', () => {
               
                if (evaluations.length > 0) {
                    const zip = new JSZip();
                    evaluations.forEach(file => {
                        zip.file(file.name, file.content);
                    });
                    zip.generateAsync({ type: 'blob' }).then((content) => {
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(content);
                        link.download = `Assignment_${sectionId}_Bewertung.zip`;
                        link.click();
                    });
                }
            });
        } else{
            evaluationDownloadBtn.style.pointerEvents = 'none';
            evaluationDownloadBtn.style.opacity = '0.5';
        }
    }

    // Drag-and-drop Events
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (isInProgress) {
            uploadZone.classList.add('drag-over');
        }
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('drag-over');
    });

    uploadZone.addEventListener('drop', (e) => {
        if (!isInProgress) return;
        e.preventDefault();
        uploadZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length) {
            saveFileToLocalStorage(sectionId, files[0]);
            assignment.style.color = 'green';
            checkbox.classList.remove('unchecked');
            checkbox.classList.add('checked');
            checkbox.checked = true;
            downloadBtn.style.pointerEvents = 'auto';
            downloadBtn.style.opacity = '1';
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (!isInProgress) return;
        const files = e.target.files;
        if (files.length) {
            saveFileToLocalStorage(sectionId, files[0]);
            assignment.style.color = 'green';
            checkbox.classList.remove('unchecked');
            checkbox.classList.add('checked');
            checkbox.checked = true;
            downloadBtn.style.pointerEvents = 'auto';
            downloadBtn.style.opacity = '1';
        }
    });

    uploadZone.addEventListener('click', () => {
        if (!isInProgress) return;
        fileInput.click();
    });

    downloadBtn.addEventListener('click', () => {
        const files = getFilesFromLocalStorage(sectionId);
        if (files.length > 0) {
            const zip = new JSZip();
            files.forEach(file => {
                zip.file(file.name, file);
            });
            zip.generateAsync({ type: 'blob' }).then((content) => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = `Assignment_${sectionId}.zip`;
                link.click();
            });
        } else {
            alert('No files uploaded yet!');
        }
    });
});
