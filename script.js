const runBtn = document.getElementById("run");
const editor = document.getElementById("editor");
const languageSelect = document.getElementById("language");
const preview = document.getElementById("preview");
const output = document.getElementById("output");

runBtn.addEventListener("click", async () => {
  const code = editor.value;
  const lang = languageSelect.value;

  // Clear previous output
  output.textContent = "";
  preview.srcdoc = "";

  if (lang === "html") {
    // Run HTML/CSS/JS directly in iframe
    preview.srcdoc = code;
  } else if (lang === "javascript") {
    // JS runs in iframe safely
    preview.srcdoc = `<script>${code}<\/script>`;
  } else {
    // Other languages use Judge0 API
    try {
      const response = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY", // replace with your key
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
          body: JSON.stringify({
            language_id: getLanguageId(lang),
            source_code: code,
            stdin: ""
          }),
        }
      );

      const result = await response.json();
      output.textContent = result.stdout || result.stderr || "No output";
    } catch (err) {
      output.textContent = "Error connecting to API: " + err;
    }
  }
});

function getLanguageId(lang) {
  switch (lang) {
    case "python3": return 71;
    case "c_cpp": return 54;
    case "java": return 62;
    case "javascript": return 63;
    default: return 71; // default to Python
  }
}
