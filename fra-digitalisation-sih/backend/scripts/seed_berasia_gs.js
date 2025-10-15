/* Seed Berasia Gram Sabha Officers (subset demo) */
require('dotenv').config({ path: './.env' });
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const GramSabhaOfficer = require('../model/gramsabhaofficer');

const ENTRIES = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/berasia-gp.json'), 'utf8'));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  const out = [];
  for (const e of ENTRIES) {
    const gramSabhaId = `GS-BRS-${e.gpCode}`;
    const password = `brs-${e.gpCode}-2025`;
    const passwordHash = await bcrypt.hash(password, 10);
    await GramSabhaOfficer.findOneAndUpdate(
      { gramSabhaId },
      {
        gramSabhaId,
        passwordHash,
        gpCode: e.gpCode,
        gpName: e.gpName,
        subdivision: 'Berasia',
        district: 'Bhopal',
      },
      { upsert: true, new: true }
    );
    out.push(`${e.gpName} (${e.gpCode}) -> ID: ${gramSabhaId}  PASS: ${password}`);
  }

  const text = `Berasia Gram Sabha Officer Credentials (All)\n\n` + out.join('\n') + '\n';
  const target = path.join(__dirname, '../credentials-berasia-gs.txt');
  fs.writeFileSync(target, text, 'utf8');
  console.log('Seeded', ENTRIES.length, 'officers. Credentials saved to', target);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});


