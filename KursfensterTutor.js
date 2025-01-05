const uploadSections = document.querySelectorAll('.upload-section');

// Abgaben getrennt speichern
const filesBySection = {
    1: [new File(["Abgabe A1"], "Assignment1.txt")],
    2: [new File(["Abgabe A2"], "Assignment2.txt")],
    3: [],
    4: []
};

// Funktion zur Aktualisierung der UI
function updateUI(sectionId, groupLabel, checkbox, uploadZone, downloadBtn) {
    if (filesBySection[sectionId].length > 0) {
        groupLabel.style.color = 'green';
        checkbox.checked = true;
        checkbox.classList.remove('unchecked');
        checkbox.classList.add('checked');
        downloadBtn.style.pointerEvents = 'auto';
        downloadBtn.style.opacity = '1';
    } else {
        groupLabel.style.color = 'red';
        checkbox.checked = false;
        checkbox.classList.remove('checked');
        checkbox.classList.add('unchecked');
        downloadBtn.style.pointerEvents = 'none';
        downloadBtn.style.opacity = '0.5';
    }
}

// Initialisierung der Upload- und Download-Funktionalität
uploadSections.forEach((section) => {
    const sectionId = parseInt(section.querySelector('.upload-box').dataset.upload); // Gruppen-ID
    const uploadZone = section.querySelector('.upload-box'); // Upload-Box
    const downloadBtn = section.querySelector('.download-box[data-download]'); // Download-Box
    const checkbox = section.querySelector('input[type="checkbox"]'); // Checkbox
    const groupLabel = section.querySelector('td h2'); // Gruppenbeschriftung

    // Initiales UI-Update
    updateUI(sectionId, groupLabel, checkbox, uploadZone, downloadBtn);

    // Erstellen und Anhängen eines unsichtbaren Dateieingabe-Elements
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.style.display = 'none'; // Unsichtbar
    section.appendChild(fileInput);

    // Klick-basierter Upload
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length) {
            filesBySection[sectionId] = Array.from(files);
            updateUI(sectionId, groupLabel, checkbox, uploadZone, downloadBtn);
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
            updateUI(sectionId, groupLabel, checkbox, uploadZone, downloadBtn);
        }
    });

    // Download-Button Logik
    downloadBtn.addEventListener('click', () => {
        const files = filesBySection[sectionId];
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
            alert('No files uploaded yet!');
        }
    });
});
