document.addEventListener('DOMContentLoaded', function() {
    var titel = document.querySelector('h1');
    var kurs = sessionStorage.getItem('kurs');
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

const uploadSections = document.querySelectorAll('.upload-section');

// Abgaben und Bewertungen getrennt speichern
const filesBySection = {
    1: [new File(["Abgabe A1"], "Assignment1.txt")],
    2: [new File(["Abgabe A2"], "Assignment2.txt")],
    3: [],
    4: []
};

const evaluationsBySection = {
    1: [new File(["Bewertung für A1"], "Bewertung_A1.txt")],
    2: [],
    3: [],
    4: []
};

const pointsBySection = {
    1: 9, // 9 von 10 Punkte für Assignment 1
    2: null, // Assignment 2 noch nicht bewertet
    3: null, // Noch keine Punkte
    4: null  // Noch keine Punkte
};

const currentDate = new Date();

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

    const assignmentPeriods = {
        1: { startDate: new Date('2023-01-01T09:00:00'), endDate: new Date('2023-02-01T23:59:59') },
        2: { startDate: new Date('2023-01-15T10:00:00'), endDate: new Date('2023-02-15T22:00:00') },
        3: { startDate: new Date('2024-01-01T08:00:00'), endDate: new Date('2025-02-01T23:59:59') },
        4: { startDate: new Date('2025-03-01T09:30:00'), endDate: new Date('2026-04-01T21:00:00') }
    };

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

    // Punkte anzeigen, wenn bewertet
    if (evaluationsBySection[sectionId].length > 0 && pointsBySection[sectionId] !== null) {
        pointsInput.value = pointsBySection[sectionId];
        pointsInput.disabled = true; // Deaktivieren, damit es nicht bearbeitet werden kann
    }
    // Update UI basierend auf Status
    if (isAfterEnd) {
        if(filesBySection[sectionId].length > 0){
            assignment.style.color = 'green';
            checkbox.checked = true;
            checkbox.classList.remove('unchecked');
            checkbox.classList.add('checked');
        } else{
            assignment.style.color = 'red';
            checkbox.checked = false;
            checkbox.classList.remove('checked');
            checkbox.classList.add('unchecked');
        }
        checkbox.disabled = true;
    } else if (isInProgress) {
        if (filesBySection[sectionId].length > 0) {
            assignment.style.color = 'green';
            checkbox.checked = true;
            checkbox.classList.remove('unchecked');
            checkbox.classList.add('checked');
        } else {
            assignment.style.color = 'red';
            checkbox.checked = false;
            checkbox.classList.remove('checked');
            checkbox.classList.add('unchecked');
        }
        checkbox.disabled = true;
    } else {
        assignment.style.color = 'black';
        checkbox.checked = false;
        checkbox.classList.remove('checked');
        checkbox.classList.add('unchecked');
        checkbox.disabled = true;
        console.log(`Assignment ${sectionId}: Checkbox class is now ${checkbox.className}`);
    }
    
    // Upload/Download deaktivieren für bestimmte Status
    uploadZone.style.pointerEvents = isInProgress ? 'auto' : 'none';
    uploadZone.style.opacity = isInProgress ? '1' : '0.5';
    fileInput.disabled = !isInProgress;

    downloadBtn.style.pointerEvents = filesBySection[sectionId].length > 0 ? 'auto' : 'none';
    downloadBtn.style.opacity = filesBySection[sectionId].length > 0 ? '1' : '0.5';

    if (evaluationDownloadBtn) {
        if (evaluationsBySection[sectionId].length > 0) {
            evaluationDownloadBtn.style.pointerEvents = 'auto';
            evaluationDownloadBtn.style.opacity = '1';

            evaluationDownloadBtn.addEventListener('click', () => {
                const evaluationFile = evaluationsBySection[sectionId][0];
                const zip = new JSZip();
                zip.file(evaluationFile.name, evaluationFile);

                const zipFileName = evaluationFile.name.split('.')[0] + '_Bewertung.zip';
                zip.generateAsync({ type: 'blob' }).then((content) => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(content);
                    link.download = zipFileName;
                    link.click();
                });
            }, { once: true });
        } else {
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
            filesBySection[sectionId] = Array.from(files);
            displayFileNames(uploadZone, filesBySection[sectionId]);
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
            filesBySection[sectionId] = Array.from(files);
            displayFileNames(uploadZone, filesBySection[sectionId]);
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

    function displayFileNames(uploadZone, files) {
        const fileNames = files.map((file) => file.name).join(', ');
        uploadZone.textContent = `Files: ${fileNames}`;
    }

    downloadBtn.addEventListener('click', () => {
        const files = filesBySection[sectionId];
        if (files.length > 0) {
            const zip = new JSZip();
            files.forEach((file) => zip.file(file.name, file));
            const zipFileName = files[0].name.split('.')[0] + '.zip';
            zip.generateAsync({ type: 'blob' }).then((content) => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = zipFileName;
                link.click();
            });
        } else {
            alert('No files uploaded yet!');
        }
    });
});
