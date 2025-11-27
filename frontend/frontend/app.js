const fileInput = document.getElementById('file');
const status = document.getElementById('status');
const output = document.getElementById('output');

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let finalText = "";

  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
    const page = await pdf.getPage(pageNo);
    const content = await page.getTextContent();
    const text = content.items.map(item => item.str).join(" ");

    finalText += text + "\n\n";
    status.textContent = `Extracting: Page ${pageNo}/${pdf.numPages}`;
  }

  return finalText;
}

document.getElementById('process').addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a PDF");
    return;
  }

  status.textContent = "Extracting text...";
  const text = await extractTextFromPDF(file);

  status.textContent = "Extraction complete!";
  output.textContent = text;  // For now we just show the raw extracted text
});

