import express from 'express';

const router = express.Router();


// GET /tweets
router.get('/', (req, res) => {
    res.status(200).send('GET /tweets');
});

// GET /tweets?username=:username
router.get('/', (req, res) => {
    res.status(200).send('GET /tweets?username=:username');
});

// GET /tweets/:id
router.get('/:id', (req, res) => {
    res.status(200).send('GET /tweets/:id');
});

// POST /tweets
router.post('/', (req, res) => {
    res.status(201).send('POST /tweets');
});

// PUT /tweets/:id
router.put('/:id', (req, res) => {
    res.status(200).send('PUT /tweets/:id');
});

// DELETE /tweets/:id
router.delete(':/id', (req, res) => {
    res.status(204).send('DELETE /tweets/:id');
})

export default router;