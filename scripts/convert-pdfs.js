import { pdfToPng } from 'pdf-to-png-converter';
import fs from 'fs/promises';
import path from 'path';

const PDF_FILES = [
    {
        name: 'integrated-wellness',
        path: './The_Integrated_Wellness_System.pdf'
    },
    {
        name: 'lasting-fitness',
        path: './Two_Paths_to_Lasting_Fitness.pdf'
    }
];

const OUTPUT_BASE = './public/slides';

async function convert() {
    for (const pdf of PDF_FILES) {
        console.log(`Processing ${pdf.name}...`);
        const outputDir = path.join(OUTPUT_BASE, pdf.name);

        // Ensure directory exists
        try {
            await fs.access(outputDir);
        } catch {
            await fs.mkdir(outputDir, { recursive: true });
        }

        try {
            const pngPages = await pdfToPng(pdf.path, {
                outputFolder: outputDir,
                outputFileMask: 'slide',
                viewportScale: 2.0 // High quality
            });

            console.log(`Generated ${pngPages.length} slides for ${pdf.name}`);

            // Rename files to simple index based names if needed, 
            // but the library usually outputs slide_1.png etc.
            // We will check the output filenames.

        } catch (err) {
            console.error(`Error converting ${pdf.name}:`, err);
        }
    }
}

convert();
