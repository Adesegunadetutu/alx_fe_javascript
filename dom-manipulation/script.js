// ✅ Step 1: Quotes array with text and category
const quotes = [
  { text: "Be yourself; everyone else is already taken.", category: "Humor" },
  { text: "Do or do not. There is no try.", category: "Motivation" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Inspiration" },
  { text: "Stay hungry, stay foolish.", category: "Motivation" }
];

// ✅ Step 2: Required function using innerHTML
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `"${randomQuote.text}" — <em>${randomQuote.category}</em>`;
}

// ✅ Event listener for the button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
