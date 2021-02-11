const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require ('fs');

//Configuration

const multerConfig = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '../../uploads');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${uuidv4()}.${extension}`);
        }
    }),
    fileFiltrer (req, file, cb) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            cb(null, true);
        } else {
            cb (new Error('invalid format'));
        }
    },
}

const upload = multer(multerConfig);

//Upload a file

//Get backs all the post
router.get('/', async (req, res) => {
    try {
        const post = await Post.find();
        res.json(post);
    } catch (error) {
        res.json({message: error});
    }
});


//Submit the post
router.post('/', upload.single('image') ,async (req, res) => {
   const post = new Post(req.body);


    try {
        if(req.file.filename){
            post.image = req.file.filename;
        }
        const savedPost = await post.save();
       res.json(savedPost);
    } catch (error) {
        res.json({message: error});
    }
});

//Specific post
router.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
        res.json(post); 
    } catch (error) {
        res.json({message: error});
    }
   
});

//Delete Post
router.delete('/:postId/:image', async (req, res) => {
    try {
 
        const removedPost = await Post.deleteOne({_id: req.params.postId});
        const path = __dirname + `../../uploads/${req.params.image}`;
        fs.unlink(path, (err) => {
            if (err) {
              console.error(err)
              return
            }
        })

        res.json(removedPost);
    } catch (error) {
        res.json({message: error});
    }
    
})

//Update a post
router.patch('/:postId', upload.single('image'), async (req, res) => {
    try {

        const file = req.file ? req.file.filename : req.body.image;
        const updatedPost = await Post.updateOne(
            {_id: req.params.postId}, 
            {$set: {
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                image: file
            }});
        res.json(updatedPost)
    } catch (error) {
        res.json({message: error});
    }
})
module.exports = router;