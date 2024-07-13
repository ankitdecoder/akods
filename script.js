const uploadBtn = document.getElementById('uploadBtn');
const cameraBtn = document.getElementById('cameraBtn');
const fileInput = document.getElementById('fileInput');
const photoGallery = document.getElementById('photoGallery');
const results = document.getElementById('results');

let model;

// Load the COCO-SSD model
cocoSsd.load().then(loadedModel => {
    model = loadedModel;
    console.log('Model loaded');
});

uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', handleFileUpload);

cameraBtn.addEventListener('click', openCamera);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.onload = () => {
                photoGallery.appendChild(img);
                detectObjects(img);
            };
        };
        reader.readAsDataURL(file);
    }
}

function openCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            video.addEventListener('loadeddata', () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                const img = document.createElement('img');
                img.src = canvas.toDataURL('image/jpeg');
                photoGallery.appendChild(img);
                
                stream.getTracks().forEach(track => track.stop());
                detectObjects(img);
            });
        })
        .catch(error => {
            console.error('Error accessing camera:', error);
        });
}

function detectObjects(img) {
    model.detect(img).then(predictions => {
        displayResults(predictions);
    });
}

function displayResults(predictions) {
    results.innerHTML = '<h2>Detection Results:</h2>';
    predictions.forEach(prediction => {
        const { class: label, score } = prediction;
        const confidence = (score * 100).toFixed(2);
        results.innerHTML += `<p>Detected ${label} with ${confidence}% confidence</p>`;
    });
}