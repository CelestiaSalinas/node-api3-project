const express = require("express");

const router = express.Router();

const Posts = require("./postDb.js");

router.get("/", (req, res) => {
  // do your magic!
  Posts.get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "problem retreiving posts"
      });
    });
});

router.get("/:id", validatePostId, (req, res) => {
  // do your magic!

  Posts.getById(req.params.id)
    .then(post => {
      if (!post) {
        return res.status(404).json({
          errorMessage: "post by the provided ID does not exist"
        });
      } else {
        return res.status(200).json(post);
      }
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "error reteiving post"
      });
    });
});

router.delete("/:id", validatePostId, (req, res) => {
  // do your magic!
  Posts.remove(req.params.id)
    .then(post => {
      if (!post) {
        return res.status(404).json({
          errorMessage: "post by the provided Id does not exist"
        });
      } else {
        return res.status(200).json(post);
      }
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "error removing post"
      });
    });
});

router.put("/:id", validatePostId, (req, res) => {
  // do your magic!
  Posts.update(req.params.id, req.body)
    .then(updated => {
      if (!updated) {
        res.status(404).json({ message: "Could not edit, does not exist!" });
      } else {
        res.status(200).json(updated);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Post does not exist!" });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  Posts.getById(req.body.id).then(post => {
    if (!req.body.id) {
      res.status(404).json({ message: "invalid body id" });
    } else {
      return res.status(201).json(req.body);
    }
  });
  next();
}

module.exports = router;