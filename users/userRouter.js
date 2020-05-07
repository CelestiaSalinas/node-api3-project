const express = require("express");

const router = express.Router();

const Users = require("./userDb.js");
const Posts = require("../posts/postDb");

//fix problem with adding user even if it doesnt have a name

router.post("/", validateUser, (req, res) => {
  // do your magic!
  Users.insert(req.body)
    .then(user => {
      return res.status(201).json(user);

    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "problem adding user"
      });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  // do your magic!
  const { id } = req.params;
  const sendPackage = {
    user_id: id,
    text: req.body.text
  };
  Posts
    .insert(sendPackage)
    .then(resp => {
      res.status(201).json("New post created");
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error creating new post"
      });
    });
});


router.get("/", (req, res) => {
  // do your magic!
  Users.get()
    .then(users => {
      return res.status(200).json(users);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "problem retreiving users"
      });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  // do your magic!
  Users.getById(req.params.id)
    .then(user => {
      return res.status(200).json(user);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "problem retreiving user"
      });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  // do your magic!
  Users.getUserPosts(req.params.id)
    .then(user => {
      return res.status(200).json(user);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "error retreiving posts"
      });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  // do your magic!
  Users.remove(req.params.id)
    .then(deleted => {
      return res.status(200).json({
        deleted: `${deleted}`,
        url: `/api/users/${req.params.id}`,
        operation: `DELETE for user with id ${req.params.id}`
      });
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "problem deleting user"
      });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  // do your magic!
  Users.update(req.params.id, req.body)
    .then(updated => {
      return res.status(200).json({
        updated: `${updated}`,
        body: `${req.body.name}`
      });
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "problem updated user"
      });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const userIds = [];
  if (req.params.id) {
    const { id } = req.params;
    Users.get()
      .then(response => {
        response.map(element => {
          userIds.push(element.id);
        });
        if (userIds.includes(Number(id))) {
          next();
        } else {
          res.status(400).json({ error: "Invalid" });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
}

function validateUser(req, res, next) {
  // do your magic!
  if (req.body) {
  } else {
    res.status(400).json({ message: "missing user data" });
  }
  if (req.body.name) {
    next();
  } else {
    res.status(400).json({ message: "missing required name field" });
  }
}

function validatePost(req, res, next) {
  // do your magic!
  if (req.body) {
  } else {
    res.status(400).json({
      errorMessage: "missing post data"
    });
  }
  if (req.body.text) {
    next()
  } else {
    res.status(400).json({
      errorMessage: "missing required text field"
    });
  }
}

module.exports = router;