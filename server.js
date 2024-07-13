const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5500; // Change this to match the port you're using
// Serve static files from the 'public' directory
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, 'server_pic_' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Handle file uploads
app.post('/upload', upload.single('image'), (req, res) => {
  res.send('File uploaded successfully');
});

// Handle base64 image data
app.post('/upload-base64', express.json({limit: '10mb'}), (req, res) => {
  const base64Data = req.body.imageData.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, 'base64');
  const filename = 'server_pic_' + Date.now() + '.png';
  
  fs.writeFile(path.join(__dirname, 'uploads', filename), buffer, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving image');
    } else {
      res.send('Image saved successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});