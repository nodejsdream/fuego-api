module.exports = app => {
  const Users = app.db.models.Users;

  app.route("/user")
    .all(app.auth.authenticate())
    /**
     * @api {get} /user Return the authenticated user's data
     * @apiGroup User
     * @apiHeader {String} Authorization Token of authenticated user
     * @apiHeaderExample {json} Header
     *    {"Authorization": "JWT xyz.abc.123.hgf"}
     * @apiSuccess {Number} id User id
     * @apiSuccess {String} first User first name
     * @apiSuccess {String} last User last name
     * @apiSuccess {String} email User email
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     *    {
     *      "id": 1,
     *      "name": "Test User",
     *      "email": "test@email.net"
     *    }
     * @apiErrorExample {json} Find error
     *    HTTP/1.1 412 Precondition Failed
     */
    .get((req, res) => {
      Users.findById(req.user.id, {
        attributes: ["id", "first", "last", "email"]
      })
      .then(result => res.json(result))
      .catch(error => {
        res.status(412).json({msg: error.message});
      });
    })
    /**
     * @api {delete} /user Deletes an authenticated user
     * @apiGroup User
     * @apiHeader {String} Authorization Token of authenticated user
     * @apiHeaderExample {json} Header
     *    {"Authorization": "JWT xyz.abc.123.hgf"}
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 204 No Content
     * @apiErrorExample {json} Delete error
     *    HTTP/1.1 412 Precondition Failed
     */
    .delete((req, res) => {
      Users.destroy({where: {id: req.user.id} })
        .then(result => res.sendStatus(204))
        .catch(error => {
          res.status(412).json({msg: error.message});
        });
    });

  /**
   * @api {post} /users/create Register a new user
   * @apiGroup User
   * @apiParam {String} first User name
   * @apiParam {String} last User name
   * @apiParam {String} email User email
   * @apiParam {String} password User password
   * @apiParamExample {json} Input
   *    {
   *      "first": "Test User 1",
   *      "last": "Test User 2",
   *      "email": "test@email.net",
   *      "password": "123456"
   *    }
   * @apiSuccess {Number} id User id
   * @apiSuccess {String} first User first name
   * @apiSuccess {String} last User last name
   * @apiSuccess {String} email User email
   * @apiSuccess {String} password User encrypted password
   * @apiSuccess {Date} updated_at Update's date
   * @apiSuccess {Date} created_at Register's date
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 200 OK
   *    {
   *      "id": 1,
   *      "first": "Test User 1",
   *      "last": "Test User 2",
   *      "email": "test@email.net",
   *      "password": "$2a$10$SK1B1",
   *      "updated_at": "2017-09-20T15:20:11.700Z",
   *      "created_at": "2017-09-20T15:29:11.700Z"
   *    }
   * @apiErrorExample {json} Register error
   *    HTTP/1.1 412 Precondition Failed
   */
  app.post("/users/create", (req, res) => {
    Users.create(req.body)
      .then(result => res.json(result))
      .catch(error => {
        console.log(req);
        res.status(412).json({msg: error.message});
      });
  });

  /**
   * @api {get} /users/:id Find user profile
   * @apiGroup User
   * @apiParam {email} email User email
   * @apiSuccess {String} msg Ok
   * @apiSuccessExample {json} Success
   *    HTTP/1.1 200 OK
   *    {
   *      "msg": "Ok"
   *    }
   * @apiErrorExample {json} User not found error
   *    HTTP/1.1 404 Not Found
   * @apiErrorExample {json} Find error
   *    HTTP/1.1 412 Precondition Failed
   */
  app.get("/users/findProfile/:email",(req, res) => {
    console.log(req.params);
    Users.findAll({
        where: {
          $or: [{ email: req.params.email }]
        },
        attributes: ["id", "first", "email"]
      }
    )
    .then(result => {
      if (result) {
        result.msg = "Ok";
        //res.json({ "msg": "Ok"});
        res.json(result);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(error => {
      res.status(412).json({msg: error.message});
    });
  })

  app.route("/users/find/:id")
    .all(app.auth.authenticate())
    /**
     * @api {get} /users/:id Get a user by email or name or id
     * @apiGroup User
     * @apiHeader {String} Authorization Token of authenticated user
     * @apiHeaderExample {json} Header
     *    {"Authorization": "JWT xyz.abc.123.hgf"}
     * @apiParam {id} id User id/name/email
     * @apiSuccess {Number} id User id
     * @apiSuccess {String} name User name
     * @apiSuccess {String} email User email
     * @apiSuccessExample {json} Success
     *    HTTP/1.1 200 OK
     *    {
     *      "id": 1,
     *      "name": "Test User",
     *      "email": "test@email.net",
     *      "password": "$2a$10$SK1B1",
     *      "updated_at": "2017-09-20T15:20:11.700Z",
     *      "created_at": "2017-09-20T15:29:11.700Z"
     *    }
     * @apiErrorExample {json} User not found error
     *    HTTP/1.1 404 Not Found
     * @apiErrorExample {json} Find error
     *    HTTP/1.1 412 Precondition Failed
     */
    .get((req, res) => {
      Users.findAll({
        where: {
          $or: [{ email: req.params.id },{ id: req.params.id },  { name: req.params.id }]
        },
        attributes: ["id", "name", "email"]
      }
      )
      .then(result => {
        if (result) {
          res.json(result);
        } else {
          res.sendStatus(404);
        }
      })
      .catch(error => {
        res.status(412).json({msg: error.message});
      });
    })
};
