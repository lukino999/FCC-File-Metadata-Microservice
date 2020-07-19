'use strict';

var express = require('express');
var cors = require('cors');

// require and use "multer"...
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }
}).single('upfile')

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/hello', function (req, res) {
  res.json({ greetings: "Hello, API" });
});

app.post('/api/fileanalyse', (req, res) => {
  upload(req, res, err => {
    if (err) {
      console.log('err', err)
      res.status(500).json({ error: 'internal error' })
    } else {
      if (req.file === undefined) {
        res.status(400).json({ error: 'no file selected' })
      } else {
        // Using memory storage. Free memory immediately!
        req.file.buffer = null;

        const f = req.file
        console.log('file metadata:\n', f)
        res.json({
          name: f.originalname,
          type: f.mimetype,
          size: f.size
        })
      }
    }
  })

})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})