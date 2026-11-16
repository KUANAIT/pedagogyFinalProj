import type { Slide } from "../data/materials";

/** Reads a PDF in the browser: text of each page plus a small preview image. No upload to any server. */
export async function readPdf(file: File, maxPages = 40): Promise<Slide[]> {
  const pdfjs = await import("pdfjs-dist");
  const workerCode = (await import("pdfjs-dist/build/pdf.worker.min.mjs?raw")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = URL.createObjectURL(
    new Blob([workerCode], { type: "text/javascript" }),
  );
  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;
  const slides: Slide[] = [];
  const count = Math.min(doc.numPages, maxPages);
  for (let index = 1; index <= count; index += 1) {
    const page = await doc.getPage(index);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    const viewport = page.getViewport({ scale: 1 });
    const scale = 640 / viewport.width;
    const scaled = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(scaled.width);
    canvas.height = Math.floor(scaled.height);
    const context = canvas.getContext("2d");
    if (context) await page.render({ canvas, canvasContext: context, viewport: scaled }).promise;
    const firstLine = text.split(/(?<=[.:!?])\s/)[0] || `Page ${index}`;
    slides.push({
      page: index,
      title: firstLine.slice(0, 70),
      text: text.slice(0, 600),
      image: canvas.toDataURL("image/jpeg", 0.72),
    });
  }
  return slides;
}
