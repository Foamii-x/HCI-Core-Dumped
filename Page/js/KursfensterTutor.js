const uploadSections = document.querySelectorAll('.upload-section');

// Abgaben getrennt speichern
const filesBySection = {
    1: [new File(["Bewertung für A2"], "Bewertung_A2.txt")],
    2: [new File(["Bewertung für A2"], "Bewertung_A2.txt")],
    3: [],
    4: []
};
const downloadBySection = {
    1: [new File(["Abgabe A2, Gruppe 1"], "Assignment2.txt")],
    2: [new File(["Abgabe A2, Gruppe 2"], "Assignment2.txt")],
    3: [new File(["Abgabe A2, Gruppe 3"], "Assignment2.txt")],
    4: [new File(["Abgabe A2, Gruppe 4"], "Assignment2.txt")]
};

const pointsBySection = {
    1: 9, // 9 von 10 Punkte für Assignment 1
    2: 10, // Assignment 2 noch nicht bewertet
    3: null, // Noch keine Punkte
    4: null  // Noch keine Punkte
};

// Initialisierung der Upload- und Download-Funktionalität
uploadSections.forEach((section) => {
    const sectionId = parseInt(section.dataset.section);
    const uploadZone = section.querySelector('.upload-box'); // Upload-Box
    const downloadBtn = section.querySelector('.download-box[data-download]'); // Download-Box
    const checkbox = section.querySelector('input[type="checkbox"]'); // Checkbox
    const fileInput = section.querySelector('.file-input');
    const pointsInput = section.querySelector('input[type="number"]');
    const groupLabel = section.querySelector('td h2'); // Gruppenbeschriftung

    if(filesBySection[sectionId].length > 0){
        groupLabel.style.color = 'green';
        checkbox.checked = true;
        checkbox.classList.remove('unchecked');
        checkbox.classList.add('checked');
    } else{
        groupLabel.style.color = 'red';
        checkbox.checked = false;
        checkbox.classList.remove('checked');
        checkbox.classList.add('unchecked');
    }
    checkbox.disabled = true;

    if (filesBySection[sectionId].length > 0 && pointsBySection[sectionId] !== null) {
        pointsInput.value = pointsBySection[sectionId];
        pointsInput.disabled = true; // Deaktivieren, damit es nicht bearbeitet werden kann
    }
    // Klick-basierter Upload
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length) {
            filesBySection[sectionId] = Array.from(files);
            groupLabel.style.color = 'green';
            checkbox.classList.remove('unchecked');
            checkbox.classList.add('checked');
            checkbox.checked = true;
        }
    });

    // Drag-and-Drop Upload
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('drag-over');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length) {
            filesBySection[sectionId] = Array.from(files);
            displayFileNames(uploadZone, filesBySection[sectionId]);
            groupLabel.style.color = 'green';
            checkbox.classList.remove('unchecked');
            checkbox.classList.add('checked');
            checkbox.checked = true;
        }
    });

    // Download-Button Logik
    downloadBtn.addEventListener('click', () => {
        const files = downloadBySection[sectionId];
        if (files.length > 0) {
            const zip = new JSZip();
            files.forEach((file) => zip.file(file.name, file));
            zip.generateAsync({ type: 'blob' }).then((content) => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = `Gruppe_${sectionId}_Uploads.zip`;
                link.click();
            });
        } else {
            alert('No files uploaded!');
        }
    });
});
