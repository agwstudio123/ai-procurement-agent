import { generateEntitySecret } from "@circle-fin/developer-controlled-wallets";

const entitySecret = generateEntitySecret();

console.log("\n==============================");
console.log("ENTITY SECRET:");
console.log(entitySecret);
console.log("==============================\n");