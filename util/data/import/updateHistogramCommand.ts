/**
 * Import Elasticsearch data from JSON files.
 *
 * Temporary script, to be removed after the histogram data is added to the collections data import script.
 *
 * npx ts-node --compiler-options {\"module\":\"CommonJS\"} ./util/data/import/updateHistogramCommand.ts
 */
import * as fs from 'fs';
import { createWriteStream } from 'fs';
import * as readline from 'node:readline';
import { collectionsDataFile } from '../dataFiles';
import { getImageHistogram } from '@/util/image';

const CLOUD_URL = 'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size1/';

function snooze(s: number) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

async function updateHistograms() {
  const outputStream = createWriteStream(collectionsDataFile + '.new');
  const fileStream = fs.createReadStream(collectionsDataFile + '.run');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    const obj = line ? JSON.parse(line) : undefined;
    if (!obj) continue;
    if (obj.image) {
      try {
        obj.imageHistogram = await getImageHistogram(CLOUD_URL + encodeURIComponent(obj.image));
        console.log(obj.image);
        await snooze(0.3);
      } catch (error) {
        console.error(error);
      }
    }
    outputStream.write(`${JSON.stringify(obj)}\n`);
  }
}

async function run() {
  await updateHistograms();
}

run();
