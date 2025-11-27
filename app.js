// Select elements AFTER the HTML is loaded
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

  status.textContent = "Summarizing using AI...";

  // Replace with your actual Render backend URL
  const backendURL = "https://annual-report-summarizer.onrender.com";

  const response = await fetch(backendURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  const data = await response.json();

  output.textContent = data.summary;
  status.textContent = "Done!";
});
