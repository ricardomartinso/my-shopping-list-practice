import app from "../src/app";
import createItems from "./factory/createItemsFactory";
import supertest from "supertest";
import { prisma } from "../src/database";

beforeEach(async () => {
  prisma.$executeRaw`TRUNCATE TABLE items;`;
});

describe("Testa POST /items ", () => {
  it("Deve retornar 201, se cadastrado um item no formato correto", async () => {
    const result = await supertest(app).post("/items").send(createItems());

    expect(result.status).toEqual(201);
  });

  it("Deve retornar 409, ao tentar cadastrar um item que exista", async () => {
    const item = createItems();
    await supertest(app).post("/items").send(item);

    const result = await supertest(app).post("/items").send(item);

    expect(result.status).toEqual(409);
  });
});

describe("Testa GET /items ", () => {
  it("Deve retornar status 200 e o body no formato de Array", async () => {
    const result = await supertest(app).get("/items");

    expect(result.body).toBeInstanceOf(Array);

    expect(result.status).toEqual(200);
  });
});

describe("Testa GET /items/:id ", () => {
  it("Deve retornar status 200 e um objeto igual a o item cadastrado", async () => {
    const createdObject = await supertest(app)
      .post("/items")
      .send(createItems());

    const result = await supertest(app).get(`/items/${createdObject.body.id}`);

    expect(result.status).toEqual(200);
    expect(createdObject.body).toEqual(result.body);
  });

  it("Deve retornar status 404 caso não exista um item com esse id", async () => {
    const created = await supertest(app).post("/items").send(createItems());

    const result = await supertest(app).get(`/items/${created.body.id + 1}`);

    expect(result.body).toEqual({});
  });
});
