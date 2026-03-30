import QRCode from 'qrcode';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const URL = 'https://game.widestudiodigitale.com';
const OUTPUT = resolve(__dirname, '../public/qr-code.png');

// Alta risoluzione per stampa adesivi
await QRCode.toFile(OUTPUT, URL, {
  type: 'png',
  width: 1200,
  margin: 2,
  color: {
    dark: '#C9963A',  // oro WIDE
    light: '#0D0D0D', // sfondo scuro
  },
  errorCorrectionLevel: 'H', // max correzione errori per stampa fisica
});

console.log(`QR code generato: ${OUTPUT}`);
console.log(`URL: ${URL}`);
console.log(`Dimensione: 1200×1200px — pronto per stampa adesivi`);
