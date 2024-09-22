const express = require('express');
const cors = require('cors');

let app = express();
app.use(cors());
const PORT = 3001;

const getFileSize = (base64String) => {
    const stringLength = base64String.length;
    const fileSizeInBytes = (stringLength * 3) / 4;
    return fileSizeInBytes / 1024; // Convert to KB
};

const getFileType = (base64String) => {
    // Decode the base64 string
    const binaryString = atob(base64String);
    
    // Convert the first few bytes to a hexadecimal string
    const header = binaryString.slice(0, 4)
        .split('')
        .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();
    
    // Define known file signatures
    const fileSignatures = {
        '1F8B': 'gz',
        '89504E47': 'png',
        'FFD8FF': 'jpg',
        '474946': 'gif',
        '49492A00': 'tif (little endian)',
        '4D4D002A': 'tif (big endian)',
        '464C56': 'flv',
        '52494646': 'riff'
    };
    
    // Check the header against known file signatures
    for (const [signature, type] of Object.entries(fileSignatures)) {
        if (header.startsWith(signature)) {
            return type;
        }
    }
    
    // Additional check for RIFF-based formats
    if (header.startsWith('52494646')) {
        const format = binaryString.slice(8, 12);
        if (format === 'WAVE') return 'wav';
        if (format === 'WEBP') return 'webp';
        if (format === 'AVI ') return 'avi';
    }
    
    return 'unknown';
};

app.post('/bfhl', express.json(), (req, res) => {
    const bodycontent = req.body;

    const data = bodycontent.data;
    const file_b64 = bodycontent.file_b64 ? bodycontent.file_b64 : false;

    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => isNaN(item)); 
  
    const lowercaseAlphabets = alphabets.filter(item => item === item.toLowerCase());
    const highestLowercaseAlphabet = lowercaseAlphabets.sort((a, b) => b.localeCompare(a))[0] || null;
  
    const isfilevalid = file_b64 ? true : false;
    if (isfilevalid) {
        const myfiletype = getFileType(file_b64);
        console.log(myfiletype);
        const myfilesize = getFileSize(file_b64).toString();

        const resdata = { 
            "is_success": true, 
            "user_id": "RounakRajSingh_09082003",  
            "email": "rs7059@srmist.edu.in",
            "roll_number": "RA2111003020213",
            "numbers": numbers,
            "alphabets": alphabets, 
            "highest_lowercase_alphabet": [highestLowercaseAlphabet], 
            "file_valid": true, 
            "file_mime_type": myfiletype, 
            "file_size_kb": myfilesize, 
        };

        res.status(200).send(resdata);
    } else {
        const resdata = { 
            "is_success": true, 
            "user_id": "RounakRajSingh_09082003",  
            "email": "rs7059@srmist.edu.in",
            "roll_number": "RA2111003020213",
            "numbers": numbers,
            "alphabets": alphabets, 
            "highest_lowercase_alphabet": [highestLowercaseAlphabet], 
            "file_valid": false, 
        };

        res.status(200).send(resdata);
    }
});

app.get('/bfhl', (req, res) => {
    const resdata = {
        "operation_code": 1 
    };

    res.status(200).send(resdata);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
