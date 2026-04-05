const express = require('express');
const router = express.Router();

router.get('/seed', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Dev seed endpoint active. Mock data initialized.',
        data: null
    });
});

module.exports = router;
