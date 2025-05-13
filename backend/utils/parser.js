const cheerio = require('cheerio');

/**
 * Parses the VSR HTML content and extracts ECU data and vehicle metadata.
 * @param {string} html
 * @returns {{ ecuData: object[], metadata: object }}
 */
function parseVSR(html) {
  const $ = cheerio.load(html);
  const ecuData = [];

  const rows = $('#ecuInformationTable tr').slice(1);
  rows.each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length === 2 && $(cells[1]).text().includes('No positive response')) {
      ecuData.push({
        ECU: $(cells[0]).text().trim(),
        PartNum: 'N/A',
        SWVersion: 'N/A',
      });
    } else if (cells.length >= 8) {
      ecuData.push({
        ECU: $(cells[0]).text().trim(),
        PartNum: $(cells[3]).text().trim(),
        SWVersion: $(cells[7]).text().trim(),
      });
    }
  });

  const text = $('body').text();
  const metadata = {
    year: text.match(/Year:\s*(\d{4})/)?.[1] ?? '',
    body: text.match(/Body:\s*([A-Z0-9]+)/)?.[1] ?? '',
    vin: text.match(/VIN:\s*([A-Z0-9]+)/)?.[1] ?? '',
    date: text.match(/Date:\s*([\w\s,:\/]+[AP]M)/)?.[1] ?? ''
  };

  return { ecuData, metadata };
}

module.exports = { parseVSR };
