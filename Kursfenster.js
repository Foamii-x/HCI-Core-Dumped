// Speichere hochgeladene Dateien getrennt für jede Sektion
const uploadSections = document.querySelectorAll('.upload-section');
const filesBySection = {}; // Ein Objekt zur Speicherung der Dateien je Sektion

uploadSections.forEach((section) => {
    const sectionId = section.dataset.section; // Eindeutige ID der Sektion
    const uploadZone = section.querySelector('.upload-box');
    const fileInput = section.querySelector('.file-input');
    const downloadBtn = section.querySelector('.download-box');
    filesBySection[sectionId] = []; // Initialisiere das Array für diese Sektion

    // Highlight drop zone on drag over
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
    });

    // Remove highlight on drag leave
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('drag-over');
    });

    // Handle file drop
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;

        if (files.length) {
            for (let file of files) {
                filesBySection[sectionId].push(file);
            }
            displayFileNames(uploadZone, filesBySection[sectionId]);
        }
    });

    // Handle file input change (for click to select file)
    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;

        if (files.length) {
            for (let file of files) {
                filesBySection[sectionId].push(file);
            }
            displayFileNames(uploadZone, filesBySection[sectionId]);
        }
    });

    // Trigger file input on click
    uploadZone.addEventListener('click', () => {
        fileInput.click(); // Öffnet den File Explorer
    });

    // Display the uploaded file names
    function displayFileNames(uploadZone, files) {
        const fileNames = files.map((file) => file.name).join(', ');
        uploadZone.querySelector('p').textContent = `Files: ${fileNames}`;
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
});
