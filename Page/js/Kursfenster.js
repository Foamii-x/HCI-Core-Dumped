var kurs = sessionStorage.getItem('kurs');
var groupNumber;
var user = sessionStorage.getItem("name");
console.log(user);
if(user == 'Anna') groupNumber = 1;//Anna, Lukas, Maria, Jonas
if(user == 'Lukas') groupNumber = 2;
if(user == 'Maria') groupNumber = 3;
if(user == 'Jonas') groupNumber = 4;
console.log(groupNumber);
console.log(localStorage.getItem(`Group${groupNumber}_${kurs}_filesBySection_Assignment 03`));
console.log(localStorage.getItem(`Group${groupNumber}_${kurs}_evaluationBySection_Assignment 01`));
console.log(kurs);
// saveEvaluationToLocalStorage(1, new File(["Bewertung für A1"], "Bewertung_A1.txt"));
if(!localStorage.getItem(`Group${groupNumber}_${kurs}_filesBySection_Assignment 01`)) saveFileToLocalStorage(1, new File(["Abgabe A1"], "Assignment1.txt"));
if(!localStorage.getItem(`Group${groupNumber}_${kurs}_filesBySection_Assignment 02`)) saveFileToLocalStorage(2, new File(["Abgabe A2"], "Assignment2.txt"));
// localStorage.setItem(`Group1_${kurs}_pointsBySection_Assignment01`, "9");

    var assignmentPeriods;
if(kurs === 'Datenstrukturen und Algorithmen' || kurs === "Mathe 1" || kurs === "Elektrotechnik"){
    assignmentPeriods = {
        1: { startDate: new Date('2023-01-01T09:00:00'), endDate: new Date('2023-02-01T23:59:59') },
        2: { startDate: new Date('2023-01-15T10:00:00'), endDate: new Date('2023-02-15T22:00:00') },
        3: { startDate: new Date('2024-01-01T08:00:00'), endDate: new Date('2025-02-14T14:15:00') },
        4: { startDate: new Date('2025-03-01T09:30:00'), endDate: new Date('2025-04-23T22:15:14') }
    };
} else if(kurs === "Diskrete Strukturen" || kurs === "Grundlagen der Mensch Computer Interaktion" || kurs === "Logik und formale Systeme"){
    assignmentPeriods = {
        1: { startDate: new Date('2023-01-01T09:00:00'), endDate: new Date('2023-02-01T23:59:59') },
        2: { startDate: new Date('2023-01-15T10:00:00'), endDate: new Date('2023-02-15T22:00:00') },
        3: { startDate: new Date('2024-01-01T08:00:00'), endDate: new Date('2025-02-01T23:59:59') },
        4: { startDate: new Date('2025-03-01T09:30:00'), endDate: new Date('2026-04-01T21:00:00') }
    };
} else if(kurs === "Grundlagen der IT-Sicherheit" || kurs === "Programmieren 2" || kurs === "Grundlagen theoretischer Informatik"){
    assignmentPeriods = {
        1: { startDate: new Date('2023-01-01T09:00:00'), endDate: new Date('2023-02-01T23:59:59') },
        2: { startDate: new Date('2023-01-15T10:00:00'), endDate: new Date('2023-02-15T22:00:00') },
        3: { startDate: new Date('2024-01-01T08:00:00'), endDate: new Date('2025-06-07T00:00:00') },
        4: { startDate: new Date('2025-03-01T09:30:00'), endDate: new Date('2025-12-31T23:59:59') }
    };
} else if(kurs === "Grundlagen der Rechnerarchitektur" || kurs == "Mathe 2" || kurs === "Programmieren 1"){
    assignmentPeriods = {
        1: { startDate: new Date('2023-01-01T09:00:00'), endDate: new Date('2023-02-01T23:59:59') },
        2: { startDate: new Date('2023-01-15T10:00:00'), endDate: new Date('2023-02-15T22:00:00') },
        3: { startDate: new Date('2024-01-01T08:00:00'), endDate: new Date('2026-03-14T09:10:11') },
        4: { startDate: new Date('2025-03-01T09:30:00'), endDate: new Date('2026-10-19T06:07:08') }
    };
} else{
    assignmentPeriods = {
        1: { startDate: new Date('2023-01-01T09:00:00'), endDate: new Date('2023-02-01T23:59:59') },
        2: { startDate: new Date('2023-01-15T10:00:00'), endDate: new Date('2023-02-15T22:00:00') },
        3: { startDate: new Date('2024-01-01T08:00:00'), endDate: new Date('2025-05-15T20:00:00') },
        4: { startDate: new Date('2025-03-01T09:30:00'), endDate: new Date('2025-09-12T13:15:00') }
    };
}


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
    bubble.id = "speechBubble";
    bubble.classList.add('speech-bubble');

    var closeButton = document.createElement('div');
    closeButton.classList.add('closeButton');
    closeButton.textContent = 'X';
    closeButton.addEventListener('click', function() {
        document.body.removeChild(img);
        document.body.removeChild(bubble);
        document.body.removeChild(closeButton);
    });
    
    // var assignment03Key = `Group${groupNumber}_${kurs}_filesBySection_Assignment 03`;
    // var assignment03Files = localStorage.getItem(assignment03Key);

    // if (assignment03Files) {
    //     bubble.textContent = 'Assignment 03 wurde hochgeladen.';
    // } else {
    //     bubble.textContent = 'Assignment 03 wurde noch nicht hochgeladen.';
    // }

    var currentDate = new Date();
    var dueDate = assignmentPeriods[3].endDate;
    var timeDifference = dueDate - currentDate;
    
    var daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    var hoursRemaining = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    bubble.textContent = `Du hast noch ${daysRemaining} Tage und ${hoursRemaining} Stunden Zeit für Assignment 03`;
    
    document.body.appendChild(bubble);
    document.body.appendChild(closeButton);

});

function updateAvatar(){
    var bubble = document.getElementById('speechBubble');
    if (localStorage.getItem(`kursStatus_${kurs}`)) {
        bubble.textContent = 'Assignment 03 wurde hochgeladen.';
        localStorage.setItem(`${kurs}_Abgabe_${groupNumber}`, "true");
    } 
    // sessionStorage.setItem('uploaded', 'true');
}

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
        localStorage.setItem(`Group${sectionId}_${kurs}_evaluationBySection_${assignment}`, JSON.stringify(files));
        console.log(localStorage.getItem(`Group${sectionId}_${kurs}_evaluationBySection_${assignment}`));
    };
    reader.readAsArrayBuffer(file);
}
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
        localStorage.setItem(`Group${groupNumber}_${kurs}_filesBySection_Assignment 0${sectionId}`, JSON.stringify(files));
        console.log(localStorage.getItem(`Group${groupNumber}_${kurs}_filesBySection_Assignment 0${sectionId}`));
    };
    reader.readAsArrayBuffer(file);
}

function getFilesFromLocalStorage(sectionId) {
    const files = JSON.parse(localStorage.getItem(`Group${groupNumber}_${kurs}_filesBySection_Assignment 0${sectionId}`)) || [];
    return files.map(fileData => {
        const { name, type, content } = fileData;
        const decodedContent = atob(content); // Base64-Dekodierung
        const blob = new Blob([decodedContent], { type });
        return new File([blob], name, { type });
    });
}
function getEvaluationsFromLocalStorage(sectionId) {
    const files = JSON.parse(localStorage.getItem(`Group${groupNumber}_${kurs}_evaluationBySection_Assignment 0${sectionId}`)) || [];
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
        pointsInput.value = localStorage.getItem(`Group${groupNumber}_${kurs}_pointsBySection_Assignment 0${sectionId}`) || '';
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
        console.log(evaluations);
        console.log(`Something went wrong in section${sectionId}! ${evaluations.length}`);
        if (evaluations.length > 0) {
            evaluationDownloadBtn.style.pointerEvents = 'auto';
            evaluationDownloadBtn.style.opacity = '1';

            evaluationDownloadBtn.addEventListener('click', () => {
                const zip = new JSZip();
                evaluations.forEach(file => {
                    zip.file(file.name, file);
                });
                zip.generateAsync({ type: 'blob' }).then((content) => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(content);
                    link.download = `Assignment_${sectionId}_Bewertung.zip`;
                    link.click();
                });
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
            localStorage.setItem(`kursStatus_${kurs}`, true);
            updateAvatar();
        }
        // sessionStorage.setItem('uploaded', 'true');
        
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
            localStorage.setItem(`kursStatus_${kurs}`, true);
            updateAvatar();
        }
    });

    uploadZone.addEventListener('click', () => {
        if (!isInProgress) return;
        fileInput.click();
        // sessionStorage.setItem('uploaded', 'true');
        // sessionStorage.setItem(`kursStatus_${kurs}`, true);
        // updateAvatar();
    });

    downloadBtn.addEventListener('click', () => {
        const files = getFilesFromLocalStorage(sectionId);
        console.log(files);
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


window.onload = function() {
    if (!sessionStorage.getItem('reloaded')) {
        sessionStorage.setItem('reloaded', 'true');
        location.reload();
    } else {
        sessionStorage.removeItem('reloaded');
    }
    updateAvatar();
}