document.getElementById('process').addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a PDF");
    return;
  }

  status.textContent = "Extracting text...";
  const text = await extractTextFromPDF(file);

  status.textContent = "Summarizing using AI...";

  // 🔥 IMPORTANT: put your Render backend URL here
  const backendURL = "https://annual-report-summarizer.onrender.com";

  const response = await fetch(backendURL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ text })
  });

  const data = await response.json();

  output.textContent = data.summary;
  status.textContent = "Done!";
});
