const express = require('express');
const multer = require('multer');
const path = require('path');
const pdf = require('pdf-parse');
const fs = require('fs');
const { convertInvDataToJson, convertExpCategoryDataToJson, convertExpSearchDataToJson } = require('./lib');

const app = express();

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const fileFilter = (req, file, cb) => {
    //allowed extensions
    const filetypes = /pdf|txt/;

    //check extensions
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    //check mime type
    const mimetype = filetypes.test(file.mimetype);

    console.log(extname, mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb("ERR: Pdf's Only!!");
    }
}

const upload = multer({ storage: storage, limits: { fileSize: 2000000 }, fileFilter })

app.use(express.static(__dirname + '/public'));

app.get('/', async (req, res) => {
    return res.sendFile(__dirname + '/index.html');
})

app.post('/parse-expenso-file', upload.single('file'), async (req, res) => {
    let result = [];
    try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdf(dataBuffer);
        const dataArr = data.text?.split('\n').filter(line => line.trim());
        if (req.body.category === 'expenses' && req.body.type === 'search') {
            result = convertExpSearchDataToJson(dataArr);
        } else if (req.body.category === 'expenses' && req.body.type === 'categories') {
            result = convertExpCategoryDataToJson(dataArr);
        } else if (req.body.category === 'investments') {
            result = convertInvDataToJson(dataArr);
        }
        return res.send(result);
    } catch (err) {
        console.error("Error Occured while parsing data!", err);
        return res.status(500).send({ result, error: `Something Went Wrong! ${err.message}` });
    }
})

app.use('*', (req, res) => {
    return res.redirect('/');
})

app.use((err, req, res, next) => {
    console.log('Error Occured: ', err);
    return res.status(500).send({ error: err.message, code: err.code || 400 });
})

const PORT = process.env.PORT || 8060;
app.listen(PORT, () => {
    console.log(`server is running.`);
})