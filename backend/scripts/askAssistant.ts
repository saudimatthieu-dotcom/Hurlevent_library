import "dotenv/config";
import { askAssistant } from "../modules/assistant";
import prisma from "../models/prisma";

async function main() {
  const question = process.argv.slice(2).join(" ");
  if (!question) {
    console.log('Usage: npx tsx scripts/askAssistant.ts "ta question"');
    return;
  }
  console.log(await askAssistant(question));
  await prisma.$disconnect();
}

main();
