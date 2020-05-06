import express from 'express';

const router = express.Router();

router.post('/register', (req, res) => {
    res.send('Register');
});

router.get('/', (req, res) => {
    res.send('Hello World');
});

export default router;
