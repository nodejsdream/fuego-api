import jwt from "jwt-simple";

describe("Routes: Clients", () => {
  const Users = app.db.models.Users;
  const Clients = app.db.models.Clients;
  const jwtSecret = app.libs.config.jwtSecret;
  let token;
  let fakeTask;
  beforeEach(done => {
    Users
      .destroy({where: {}})
      .then(() => Users.create({
        name: "John",
        email: "john@mail.net",
        password: "12345"
      }))
      .then(user => {
        Clients
          .destroy({where: {}})
          .then(() => Clients.bulkCreate([{
            id: 1,
            title: "Work",
            user_id: user.id
          }, {
            id: 2,
            title: "Study",
            user_id: user.id
          }]))
          .then(clients => {
            fakeTask = clients[0];
            token = jwt.encode({id: user.id}, jwtSecret);
            done();
          });
      });
  });
  describe("GET /clients", () => {
    describe("status 200", () => {
      it("returns a list of clients", done => {
        request.get("/clients")
          .set("Authorization", `JWT ${token}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.have.length(2);
            expect(res.body[0].title).to.eql("Work");
            expect(res.body[1].title).to.eql("Study");
            done(err);
          });
      });
    });
  });
  describe("POST /clients", () => {
    describe("status 200", () => {
      it("creates a new client", done => {
        request.post("/clients")
          .set("Authorization", `JWT ${token}`)
          .send({title: "Run"})
          .expect(200)
          .end((err, res) => {
            expect(res.body.title).to.eql("Run");
            expect(res.body.done).to.be.false;
            done(err);
          });
      });
    });
  });
  describe("GET /clients/:id", () => {
    describe("status 200", () => {
      it("returns one client", done => {
        request.get(`/clients/${fakeTask.id}`)
          .set("Authorization", `JWT ${token}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body.title).to.eql("Work");
            done(err);
          });
      });
    });
    describe("status 404", () => {
      it("throws error when client not exist", done => {
        request.get("/clients/0")
          .set("Authorization", `JWT ${token}`)
          .expect(404)
          .end((err, res) => done(err));
      });
    });
  });
  describe("PUT /clients/:id", () => {
    describe("status 204", () => {
      it("updates a client", done => {
        request.put(`/clients/${fakeTask.id}`)
          .set("Authorization", `JWT ${token}`)
          .send({
            title: "Travel",
            done: true
          })
          .expect(204)
          .end((err, res) => done(err));
      });
    });
  });
  describe("DELETE /clients/:id", () => {
    describe("status 204", () => {
      it("removes a client", done => {
        request.delete(`/clients/${fakeTask.id}`)
          .set("Authorization", `JWT ${token}`)
          .expect(204)
          .end((err, res) => done(err));
      });
    });
  });
});
