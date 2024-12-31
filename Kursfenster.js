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

const currentDate = new Date();

uploadSections.forEach((section) => {
    const sectionId = parseInt(section.dataset.section);
    const uploadZone = section.querySelector('.upload-box');
    const fileInput = section.querySelector('.file-input');
    const downloadBtn = section.querySelector('.download-box[data-download]');
    const evaluationDownloadBtn = section.querySelector('.evaluation-box');
    const checkbox = section.querySelector('input[type="checkbox"]');
    const assignment = section.querySelector('td h3');

    const assignmentPeriods = {
        1: { startDate: new Date('2023-01-01'), endDate: new Date('2023-02-01') },
        2: { startDate: new Date('2023-01-15'), endDate: new Date('2023-02-15') },
        3: { startDate: new Date('2024-01-01'), endDate: new Date('2025-02-01') },
        4: { startDate: new Date('2025-03-01'), endDate: new Date('2026-04-01') }
    };

    const period = assignmentPeriods[sectionId];
    const isBeforeStart = currentDate < period.startDate;
    const isAfterEnd = currentDate > period.endDate;
    const isInProgress = !isBeforeStart && !isAfterEnd;

    // Update UI basierend auf Status
    if (isAfterEnd) {
        assignment.style.color = 'green';
        checkbox.checked = true;
        checkbox.classList.remove('unchecked');
        checkbox.classList.add('checked');
        checkbox.disabled = true;
        console.log(`Assignment ${sectionId}: Checkbox class is now ${checkbox.className}`);
    } else if (isInProgress) {
        if (filesBySection[sectionId].length > 0) {
            assignment.style.color = 'green';
            checkbox.checked = true;
            checkbox.classList.remove('unchecked');
            checkbox.classList.add('checked');
            console.log(`Assignment ${sectionId}: Checkbox class is now ${checkbox.className}`);
        } else {
            assignment.style.color = 'red';
            checkbox.checked = false;
            checkbox.classList.remove('checked');
            checkbox.classList.add('unchecked');
            console.log(`Assignment ${sectionId}: Checkbox class is now ${checkbox.className}`);
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
