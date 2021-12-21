const crypto = require("crypto");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = require("chai");

const testString = crypto.randomBytes(16).toString("hex");
const testUserPass = `test-${testString}@test.com`;
let authToken = "";

const app = "localhost:8001";
chai.use(chaiHttp);

console.log("Using username/password: " + testUserPass);

describe("POST: Create test user", () => {
  it("should create test user", (done) => {
    chai
      .request(app)
      .post("/api/user/create")
      .send({
        email: testUserPass,
        password: testUserPass,
        firstName: "Test",
        lastName: "User",
      })
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body.message).to.equal("Registration successful");
        done();
      });
  });
});

describe("POST: Login as test user", () => {
  it("should sign in with test user", (done) => {
    chai
      .request(app)
      .post("/api/user/authenticate")
      .send({
        email: testUserPass,
        password: testUserPass,
      })
      .end(function (err, res) {
        if (err) return done(err);
        authToken = res.body.token;
        expect(res.body.message).to.equal("Login successful");
        done();
      });
  });
});

describe("DELETE: Remove test user", () => {
  it("should remove test user", (done) => {
    chai
      .request(app)
      .delete("/api/user/delete")
      .set("Authorization", `${authToken}`)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body.message).to.equal("User deleted");
        done();
      });
  });
});
