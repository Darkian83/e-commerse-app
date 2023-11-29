const request = require("supertest");
const app = require("../app");

let id;
let token;

test("POST /users debe crear un usuario", async () => {
  const user = {
    firstName: "Juan",
    lastName: "Perez",
    email: "juan@gmail.com",
    password: "123456",
    phone: "123456",
  };
  const res = await request(app).post("/users").send(user);
  id = res.body.id;
  expect(res.statusCode).toBe(201);
  expect(res.body.id).toBeDefined();
  expect(res.body.firstName).toBe(user.firstName);
});

test("POST /users/login debe loguear un usuario", async () => {
  const body = {
    email: "juan@gmail.com",
    password: "123456",
  };
  const res = await request(app).post("/users/login").send(body);
  token = res.body.token;
  expect(res.statusCode).toBe(200);
  expect(res.body.token).toBeDefined();
});

test("GET /users debe traer los usuarios", async () => {
  console.log(token);
  const res = await request(app)
    .get("/users")
    .set(`Authorization`, `Bearer ${token}`);

  expect(res.statusCode).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test("PUT /users/:id debe actualizar un usuario", async () => {
  const user = {
    firstName: "Daniel",
  };
  const res = await request(app)
    .put(`/users/${id}`)
    .send(user)
    .set(`Authorization`, `Bearer ${token}`);
  expect(res.statusCode).toBe(200);
  expect(res.body.firstName).toBe(user.firstName);
});

test("DELETE /users/:id debe eliminar un usuario", async () => {
  const res = await request(app)
    .delete(`/users/${id}`)
    .set(`Authorization`, `Bearer ${token}`);
  expect(res.statusCode).toBe(204);
});
