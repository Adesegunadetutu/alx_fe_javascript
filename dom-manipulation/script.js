// ✅ Load quotes from localStorage or use default values
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Be yourself; everyone else is already taken.", category: "Humor" },
  { text: "Do or do not. There is no try.", category: "Motivation" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
  { text: "Stay hungry, stay foolish.", category: "Motivation" }
];

// ✅ Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ✅ Show random quote & save it to sessionStorage
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `"${randomQuote.text}" — <em>${randomQuote.category}</em>`;

  // Save last viewed quote in sessionStorage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// ✅ Display last quote on page load (if available)
window.addEventListener("load", () => {
  const last = sessionStorage.getItem("lastViewedQuote");
  if (last) {
    const quote = JSON.parse(last);
    document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
  }

  createAddQuoteForm(); // Create quote form on load
});

// ✅ Add quote to the array and update localStorage
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Both fields are required!");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  alert("Quote added!");
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// ✅ Dynamically create add-quote form
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// ✅ Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (!Array.isArray(importedQuotes)) {
        alert("Invalid format. Must be an array of quotes.");
        return;
      }

      importedQuotes.forEach(q => {
        if (q.text && q.category) {
          quotes.push(q);
        }
      });

      saveQuotes();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Failed to import: Invalid JSON.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// ✅ Export quotes to downloadable JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// ✅ Attach click event to "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
