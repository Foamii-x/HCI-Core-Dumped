// Speichere hochgeladene Dateien getrennt für jede Sektion
const uploadSections = document.querySelectorAll('.upload-section');
const filesBySection = {}; // Ein Objekt zur Speicherung der Dateien je Sektion

uploadSections.forEach((section) => {
    const sectionId = section.dataset.section; // Eindeutige ID der Sektion
    const dropZone = section.querySelector('.upload-box');
    const fileInput = section.querySelector('.file-input');
    const downloadBtn = section.querySelector('.download-box');
    filesBySection[sectionId] = []; // Initialisiere das Array für diese Sektion

    // Highlight drop zone on drag over
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    // Remove highlight on drag leave
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    // Handle file drop
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;

        if (files.length) {
            for (let file of files) {
                filesBySection[sectionId].push(file);
            }
            displayFileNames(dropZone, filesBySection[sectionId]);
        }
    });

    // Handle file input change (for click to select file)
    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;

        if (files.length) {
            for (let file of files) {
                filesBySection[sectionId].push(file);
            }
            displayFileNames(dropZone, filesBySection[sectionId]);
        }
    });

    // Trigger file input on click
    dropZone.addEventListener('click', () => {
        fileInput.click(); // Öffnet den File Explorer
    });

    // Display the uploaded file names
    function displayFileNames(dropZone, files) {
        const fileNames = files.map((file) => file.name).join(', ');
        dropZone.querySelector('p').textContent = `Files: ${fileNames}`;
    }

    //handle file download
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
