// Load quotes from localStorage or defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Be yourself; everyone else is already taken.", category: "Humor" },
  { text: "Do or do not. There is no try.", category: "Motivation" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
  { text: "Stay hungry, stay foolish.", category: "Motivation" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate category dropdown
function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");
  categorySelect.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  }

  );

  // Restore last selected filter
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categorySelect.value = savedFilter;
    filterQuotes();
  }
}

// Filter quotes by category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes found for this category.</p>";
    return;
  }

  // Display first matched quote
  const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  quoteDisplay.innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;

  // Store last viewed
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// Show random quote regardless of filter
function showRandomQuote() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Both fields are required!");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added!");
  populateCategories();
  filterQuotes(); // Refresh display
}

// Create add-quote form dynamically
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

// Import quotes from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid format");

      importedQuotes.forEach(q => {
        if (q.text && q.category) quotes.push(q);
      });

      saveQuotes();
      populateCategories();
      filterQuotes();

      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Failed to import: Invalid JSON.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// Export quotes to JSON
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

// Run on page load
window.addEventListener("load", () => {
  createAddQuoteForm();
  populateCategories();

  // Load last viewed quote from session storage
  const last = sessionStorage.getItem("lastViewedQuote");
  if (last) {
    const quote = JSON.parse(last);
    document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" — <em>${quote.category}</em>`;
  }
});

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
// ✅ Simulated server URL (mock for now)
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Simulate with first 10 as quotes

// ✅ Sync local quotes with server and resolve conflicts
function syncWithServer() {
  fetch(SERVER_URL)
    .then(response => response.json())
    .then(serverData => {
      const serverQuotes = serverData.slice(0, 10).map(item => ({
        text: item.title,
        category: "Server" // simulate category
      }));

      let conflicts = [];

      serverQuotes.forEach(serverQuote => {
        const existing = quotes.find(q => q.text === serverQuote.text);

        if (existing) {
          if (existing.category !== serverQuote.category) {
            // Conflict: update category from server (server wins)
            existing.category = serverQuote.category;
            conflicts.push(serverQuote.text);
          }
        } else {
          // New quote from server
          quotes.push(serverQuote);
        }
      });

      saveQuotes();
      populateCategories();
      filterQuotes();

      if (conflicts.length > 0) {
        alert(`Conflicts resolved. Server updated ${conflicts.length} quote(s).`);
      } else {
        alert("Sync complete. No conflicts found.");
      }
    })
    .catch(error => {
      console.error("Sync failed:", error);
      alert("Failed to sync with server.");
    });
}

