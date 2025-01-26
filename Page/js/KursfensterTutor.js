var kurs = sessionStorage.getItem('kurs');
var assignment = sessionStorage.getItem('Assignment');
console.log(assignment);
// localStorage.removeItem(`Group2_${kurs}_evaluationBySection_${assignment}`);
// localStorage.removeItem(`Group1_${kurs}_evaluationBySection_${assignment}`);
if(assignment === 'Assignment 01') console.log("In Assigment 01");
if((!localStorage.getItem(`Group1_${kurs}_pointsBySection_Assignment 01`) && assignment === 'Assignment 01')) localStorage.setItem(`Group1_${kurs}_pointsBySection_Assignment 01`, "9");
if((!localStorage.getItem(`Group2_${kurs}_pointsBySection_Assignment 01`) && assignment === 'Assignment 01')) localStorage.setItem(`Group2_${kurs}_pointsBySection_Assignment 01`, "10");
if(!localStorage.getItem(`Group1_${kurs}_evaluationBySection_${assignment}`) && assignment === 'Assignment 01') saveEvaluationToLocalStorage('1',new File(["Bewertung für A1"], "Bewertung_A1_Gruppe1.txt"));
if(!localStorage.getItem(`Group2_${kurs}_evaluationBySection_${assignment}`) && assignment === 'Assignment 01') saveEvaluationToLocalStorage('2',new File(["Bewertung für A1"], "Bewertung_A1_Gruppe2.txt"));

document.addEventListener('DOMContentLoaded', function() {
    var titel = document.querySelector('h1');
    titel.textContent = kurs + " > " + assignment;

    var img = document.createElement('img');
    img.src = '../style/avatar.png';
    img.classList.add('posAvatar');
    document.body.appendChild(img);

    var bubble = document.createElement('div');
    bubble.classList.add('speech-bubble');
    bubble.id = "bubble";
    // bubble.textContent = "Gruppe 03 und Gruppe 04 müssen noch bewertet werden!";

    var closeButton = document.createElement('div');
    closeButton.classList.add('closeButton');
    closeButton.textContent = 'X';
    closeButton.addEventListener('click', function() {
        document.body.removeChild(img);
        document.body.removeChild(bubble);
        document.body.removeChild(closeButton);
    });
    document.body.appendChild(closeButton);

    document.body.appendChild(bubble);
    updateAvatar2();
});

function zurück(){
    window.location.href = sessionStorage.getItem('letzteSeite');
}

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
function getEvaluationsFromLocalStorage(sectionId) {
    const files = JSON.parse(localStorage.getItem(`Group${sectionId}_${kurs}_evaluationBySection_${assignment}`)) || [];
    return files.map(fileData => {
        const { name, type, content } = fileData;
        const decodedContent = atob(content); // Base64-Dekodierung
        const blob = new Blob([decodedContent], { type });
        return new File([blob], name, { type });
    });
}

function getFilesFromLocalStorage(sectionId) {
    const files = JSON.parse(localStorage.getItem(`Group${sectionId}_${kurs}_filesBySection_${assignment}`)) || [];
    return files.map(fileData => {
        const { name, type, content } = fileData;
        const decodedContent = atob(content); // Base64-Dekodierung
        const blob = new Blob([decodedContent], { type });
        return new File([blob], name, { type });
    });
}

const uploadSections = document.querySelectorAll('.upload-section');

// Initialisierung der Upload- und Download-Funktionalität
uploadSections.forEach((section) => {
    const sectionId = parseInt(section.dataset.section);
    const uploadZone = section.querySelector('.upload-box'); // Upload-Box
    const downloadBtn = section.querySelector('.download-box[data-download]'); // Download-Box
    const checkbox = section.querySelector('input[type="checkbox"]'); // Checkbox
    const fileInput = section.querySelector('.file-input');
    const pointsInput = section.querySelector('input[type="number"]');
    const groupLabel = section.querySelector('td h2'); // Gruppenbeschriftung
    
    function updateDownloadBox() {
        const files = getFilesFromLocalStorage(sectionId);
        if (files.length > 0) {
            downloadBtn.classList.add('available');
            downloadBtn.classList.remove('unavailable');
        } else {
            downloadBtn.classList.add('unavailable');
            downloadBtn.classList.remove('available');
        }
    }

    // Initiale Prüfung beim Laden der Seite
    updateDownloadBox();
    
    const storedFiles = getEvaluationsFromLocalStorage(sectionId);
    if(storedFiles.length > 0){
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


    pointsInput.value = localStorage.getItem(`Group${sectionId}_${kurs}_pointsBySection_${assignment}`) || '';

    // Klick-basierter Upload
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length) {
            saveEvaluationToLocalStorage(sectionId, files[0]);
            groupLabel.style.color = 'green';
            checkbox.classList.remove('unchecked');
            checkbox.classList.add('checked');
            checkbox.checked = true;
            updateAvatar2();
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
            saveEvaluationToLocalStorage(sectionId, files[0]);
            groupLabel.style.color = 'green';
            checkbox.classList.remove('unchecked');
            checkbox.classList.add('checked');
            checkbox.checked = true;
            updateAvatar2();
        }
    });

    // Download-Button Logik
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
                link.download = `Gruppe_${sectionId}_Upload.zip`;
                link.click();
            });
        } else {
            alert('No files uploaded yet!');
        }
    });

    pointsInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const pointsValue = parseInt(pointsInput.value, 10);

            // Check if the entered value is valid
            if (pointsValue >= 0 && pointsValue <= 10) {
                localStorage.setItem(`Group${sectionId}_${kurs}_pointsBySection_${assignment}`, JSON.stringify(pointsValue));
                console.log(`Group${sectionId}_${kurs}_pointsBySection_${assignment}`);
                // pointsBySection[sectionId] = pointsValue;
                //pointsInput.disabled = true; // Disable the points input after pressing Enter
            } else {
                // Optional: You could reset the input if the value is not valid
                pointsInput.value = '';
                alert('Please enter a valid point value between 0 and 10.');
            }
        }
    });
});

function removeLast(str, substr) {
    const lastIndex = str.lastIndexOf(substr);
    if (lastIndex === -1) {
        return str;
    }
    return str.slice(0, lastIndex) + str.slice(lastIndex + substr.length);
}

function replaceLast(str, search, replace) {
    const lastIndex = str.lastIndexOf(search);
    if (lastIndex === -1) {
        return str; 
    }
    return str.slice(0, lastIndex) + replace + str.slice(lastIndex + search.length);
}

function updateAvatar2(){
    var text = "";
    var counter = 1;
    var redCount = 0;
    const groupLabels = document.querySelectorAll('td h2');
    groupLabels.forEach(label => {
        console.log(label.style.color);
        console.log(counter);
        if(label.style.color === 'red'){
            // alert(label.style.color);
            text += `Gruppe 0${counter}, `;
            redCount++;
        }
        counter++;
    });
    text = removeLast(text, ",");
    text = replaceLast(text, ",", " und");
    var textOut;
    if(redCount === 0){
        textOut = "Alle Abgaben wurden bewertet!";
        localStorage.setItem(`${kurs}_Bewertung_${assignment}`, "true");
    } else if(redCount === 1){
        textOut = `Es muss noch ${text} bewertet werden`;
    } else{
        textOut = "Es müssen noch " + text + "bewertet werden!";
    }

    var bubble = document.getElementById('bubble');
    bubble.textContent = textOut;
    // alert(textOut);
}

window.onload = function() {
    if (!sessionStorage.getItem('reloaded')) {
        sessionStorage.setItem('reloaded', 'true');
        location.reload();
    } else {
        sessionStorage.removeItem('reloaded');
    }
    updateAvatar2();
}
