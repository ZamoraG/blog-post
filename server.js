const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const uuid = require('uuid');
const app = express();

blogArray = [
    {
        id: uuid.v4(),
        title: "10 DIY Projects",
        content: "A compilation of 10 easy projects for you to make yourself",
        author: "Erin",
        publishDate: '21/03/2019'
    },
    {
        id: uuid.v4(),
        title: "Starting with Linux",
        content: "How to start using linux and some basic commands",
        author: "Joaquin",
        publishDate: '22/03/2019'
    },
    {
        id: uuid.v4(),
        title: "The art of dribbling",
        content: "Dribble the soccer ball as a professional",
        author: "Ismael",
        publishDate: '23/03/2019'
    }
]

app.get('/blog-posts', (req, res) => {
    res.status(200).json({
        message: "Blog posts sent successfully",
        status: 200,
        found: blogArray
    });
});

app.get('/blog-posts/:author', (req, res) => {
    let bAuthor = req.params.author;
    const bPosts = [];

    if(!bAuthor){
        res.status(406).json({
            message: "No author field sent in parameters",
            status: 406
        }).send("Finish");
    }

    blogArray.forEach(item => {
        if(bAuthor == item.author){
            bPosts.push(item);
        }
    });

    if(bPosts.length <= 0){
         res.status(404).json({
            message : "Author doesn't exist in the blog",
            status : 404
        });
    }else{
        res.status(200).json({
            message: "Blog Posts sent",
            status: 200,
            found: bPosts
        });
    }    
});

app.post('/blog-posts', jsonParser, (req, res) => {

    let bFields = ['title', 'content', 'author', 'publishDate'];

    for (let i = 0; i < bFields.length; i++){
        let currentField = bFields[i];
        if(!(currentField in req.body)){
            res.status(406).json({
                message : `Missing field ${currentField} in body`,
                status : 406
            }).send("Finish");
        }
    }

    let newbp = {
        id: uuid.v4(),
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate
    };
    blogArray.push(newbp);

    res.status(201).json({
        message: "Post entry added",
        status: 201,
        post: newbp
    });
});

app.put('/blog-posts/:id', jsonParser, (req, res) => {
    let pathId = req.params.id;
    let pUpdate = req.body;
    let PostUpdated;
    
    if(!pathId){
        res.status(406).json({
            message: "Missing field id in path",
            status: 406
        });
    }

    /*if (!pUpdate.title){
        return res.status(404).json({
            message: "Missing field title in body",
            status: 404
        });
    }

    if (!pUpdate.content){
        return res.status(404).json({
            message: "Missing field content in body",
            status: 404
        });
    }
    
    if(!pUpdate.author){
        return res.status(404).json({
            message: "Missing field author in body",
            status: 404
        });
    }

    if(!pUpdate.publishDate){
        return res.status(404).json({
            message: "Missing field publish date in body",
            status: 404
        });
    }*/
    blogArray.forEach(item => {
        if(pathId == item.id){
            if(pUpdate.title) {
                item.title = pUpdate.title;
            }
            if(pUpdate.content) {
                item.content = pUpdate.content;
            }
            if(pUpdate.author) {
                item.author = pUpdate.author;
            }
            if(pUpdate.publishDate) {
                item.publishDate = pUpdate.publishDate;
            }
            PostUpdated = item;

            res.status(200).json({
                message: "Successfully updated post",
                status: 200,
                post: PostUpdated
            });
        }
    });   
    

    res.status(404).json({
        message: 'ID does not exist',
        status: 404,
    });

});

app.delete('/blog-posts/:id', jsonParser, (req, res) => {
    let removalId = req.body.id;
    let pId = req.params.id;
    let itIndex = null;
    let val = false;
    let i = -1;

    if(!pId){
        res.status(406).json({
            message: "id in parameters is required",
            status: 406
        });
        return;
    }

    if(!removalId){
        res.status(406).json({
            message: "id in body is required",
            status: 406
        });
        return;
    }

    blogArray.forEach(item=> {
        i = i+1;
        if (pId == removalId){
            itIndex = i;
            val = true;
        }
    });

    if (val == false) {
        return res.status(404).send({
          success: 'false',
          message: 'Post not found',
        });
    }

    blogArray.forEach(item => {
        if(pId == item.id){
            blogArray.splice(itIndex, 1);
            res.status(201).json({
                message: "Post deleted " + itIndex,
                status: 201
            });
            return;
        }
    });

    res.status(404).json({
        message: "Post not found",
        status: 404
    });
});

app.listen(8080, () => {
    console.log("Your app is running in port 8080");
});