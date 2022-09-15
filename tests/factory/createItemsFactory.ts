import { faker } from "@faker-js/faker";
import { items } from "@prisma/client";

export default function createItemsFactory() {
  return {
    title: faker.lorem.word(),
    url: faker.internet.url(),
    description: faker.lorem.paragraph(),
    amount: Number(faker.finance.amount(0, 1000, 0)),
  };
}
