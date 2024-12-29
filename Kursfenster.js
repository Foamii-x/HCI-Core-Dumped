// Speichere hochgeladene Dateien getrennt für jede Sektion
const uploadSections = document.querySelectorAll('.upload-section');
const filesBySection = {
    1: [new File(["Bewertungsinhalt"], "Bewertung_A1.txt")],
    2: [new File(["Abgabeinhalt"], "Abgabe_A2.txt")],
    3: [],
    4: []
};
const currentDate = new Date(); // Aktuelles Datum für Vergleich
console.log(currentDate);
uploadSections.forEach((section) => {
    const sectionId = parseInt(section.dataset.section); // Eindeutige ID der Sektion
    const uploadZone = section.querySelector('.upload-box');
    const fileInput = section.querySelector('.file-input');
    const downloadBtn = section.querySelector('.download-box[data-download]');
    const evaluationDownloadBtn = section.querySelector('.download-box:not([data-download])');
    const checkbox = section.querySelector('input[type="checkbox"]');
    const assignment = section.querySelector('td h3');

    // Beispiel für Bearbeitungszeiträume (Anpassen an reale Daten)
    const assignmentPeriods = {
        1: { startDate: new Date('2023-01-01'), endDate: new Date('2023-02-01'), hasEvaluation: true },
        2: { startDate: new Date('2023-01-15'), endDate: new Date('2023-02-15'), hasEvaluation: false },
        3: { startDate: new Date('2024-01-01'), endDate: new Date('2024-02-01'), hasEvaluation: false },
        4: { startDate: new Date('2024-03-01'), endDate: new Date('2024-04-01'), hasEvaluation: false }
    };

    const period = assignmentPeriods[sectionId];

    // Bearbeitungsstatus prüfen
    const isBeforeStart = currentDate < period.startDate;
    const isAfterEnd = currentDate > period.endDate;
    const isInProgress = !isBeforeStart && !isAfterEnd;

    // Status setzen
    updateAssignmentStatus(assignment, checkbox, isInProgress, isAfterEnd);

    // Funktionen deaktivieren bei nicht bearbeitbaren Zeiträumen
    if (isBeforeStart || isAfterEnd) {
        uploadZone.style.pointerEvents = 'none';
        uploadZone.style.opacity = '0.5';
        fileInput.disabled = true;
    }

    if (isBeforeStart || filesBySection[sectionId].length === 0) {
        downloadBtn.style.pointerEvents = 'none';
        downloadBtn.style.opacity = '0.5';
    }

    if (isAfterEnd && period.hasEvaluation) {
        evaluationDownloadBtn.style.pointerEvents = 'auto';
        evaluationDownloadBtn.style.opacity = '1';
    } else {
        evaluationDownloadBtn.style.pointerEvents = 'none';
        evaluationDownloadBtn.style.opacity = '0.5';
    }

    // Highlight drop zone on drag over
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (isInProgress) {
            uploadZone.classList.add('drag-over');
        }
    });

    // Remove highlight on drag leave
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('drag-over');
    });

    // Handle file drop
    uploadZone.addEventListener('drop', (e) => {
        if (!isInProgress) return;
        e.preventDefault();
        uploadZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;

        if (files.length) {
            filesBySection[sectionId] = Array.from(files); // Alte Dateien ersetzen
            updateStatus(assignment, checkbox, filesBySection[sectionId]);
            displayFileNames(uploadZone, filesBySection[sectionId]);
        }
    });

    // Handle file input change (for click to select file)
    fileInput.addEventListener('change', (e) => {
        if (!isInProgress) return;
        const files = e.target.files;

        if (files.length) {
            filesBySection[sectionId] = Array.from(files); // Alte Dateien ersetzen
            updateStatus(assignment, checkbox, filesBySection[sectionId]);
            displayFileNames(uploadZone, filesBySection[sectionId]);
        }
    });

    // Trigger file input on click
    uploadZone.addEventListener('click', () => {
        if (!isInProgress) return;
        fileInput.click(); // Öffnet den File Explorer
    });

    // Display the uploaded file names
    function displayFileNames(uploadZone, files) {
        const fileNames = files.map((file) => file.name).join(', ');
        uploadZone.textContent = `Files: ${fileNames}`;
    }

    // Update the assignment and checkbox status
    function updateStatus(assignment, checkbox, files) {
        checkbox.disabled = true; // Sperrt die Checkbox
        if (files.length > 0) {
            assignment.style.color = 'green';
            checkbox.checked = true;
            checkbox.style.backgroundImage = "url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='green'%3E%3Cpath d='M13.485 1.757a1 1 0 011.415 0l.07.071a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l.071-.07a1 1 0 011.414 0L6 8.586l7.485-7.485z'/%3E%3C/svg%3E)";
            checkbox.style.backgroundSize = 'contain';
            checkbox.style.backgroundRepeat = 'no-repeat';
        } else {
            assignment.style.color = 'red';
            checkbox.checked = false;
            checkbox.style.backgroundImage = "url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='red'%3E%3Cpath d='M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 11.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z'/%3E%3C/svg%3E)";
            checkbox.style.backgroundSize = 'contain';
            checkbox.style.backgroundRepeat = 'no-repeat';
        }
    }

    function updateAssignmentStatus(assignment, checkbox, isInProgress, isAfterEnd) {
        checkbox.disabled = true; // Sperrt die Checkbox
        if (isAfterEnd) {
            assignment.style.color = 'green';
            checkbox.checked = true;
        } else if (isInProgress) {
            assignment.style.color = 'green';
        } else {
            assignment.style.color = 'black';
            checkbox.checked = false;
            checkbox.style.backgroundImage = "url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='red'%3E%3Cpath d='M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 11.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z'/%3E%3C/svg%3E)";
            checkbox.style.backgroundSize = 'contain';
            checkbox.style.backgroundRepeat = 'no-repeat';
        }
    }

    // Handle download button
    downloadBtn.addEventListener('click', () => {
        const files = filesBySection[sectionId];

        if (files.length > 0) {
            const zip = new JSZip();

            // Dateien zur ZIP-Datei hinzufügen
            files.forEach((file) => {
                zip.file(file.name, file);
            });

            // Dynamischer Name basierend auf der ersten Datei
            const zipFileName = files[0].name.split('.')[0] + '.zip';

            // ZIP-Datei generieren
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

    // Handle evaluation download button
    evaluationDownloadBtn.addEventListener('click', () => {
        if (period.hasEvaluation) {
            const file = filesBySection[1][0];
            const link = document.createElement('a');
            link.href = URL.createObjectURL(file);
            link.download = file.name;
            link.click();
        }
    });
});