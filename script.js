document.addEventListener("DOMContentLoaded", function () {
	// Selecting important elements
	const display = document.getElementById("result");
	const history = document.getElementById("history");
	const buttons = document.querySelectorAll(".btn");
	const themeToggle = document.getElementById("theme-toggle");
	const body = document.body;

	let currentInput = ""; // Stores user input
	let historyText = ""; // Stores calculation history

	// Function to update display with dynamic font size
	function updateDisplay(value) {
		display.textContent = value || "0";

		// Dynamically adjust font size based on content length
		const baseFontSize = 2.5; // Base font size in rem
		const minFontSize = 1.5; // Minimum font size in rem
		const length = display.textContent.length;

		// Adjust font size: reduce as length increases
		let fontSize = baseFontSize;
		if (length > 10) {
			fontSize = Math.max(
				minFontSize,
				baseFontSize - (length - 10) * 0.1
			);
		}
		display.style.fontSize = `${fontSize}rem`;
	}

	// Function to update history
	function updateHistory(value) {
		history.textContent = value;
	}

	// Function to simulate a button click
	function simulateButtonClick(value) {
		const button = Array.from(buttons).find(
			(btn) => btn.textContent === value
		);
		if (button) {
			button.click();
		}
	}

	// Event Listener for Button Clicks
	buttons.forEach((button) => {
		button.addEventListener("click", () => {
			const value = button.textContent;

			// Clear button functionality
			if (button.classList.contains("clear")) {
				currentInput = "";
				historyText = "";
				updateDisplay("0");
				updateHistory("");
			}
			// Toggle sign (±) functionality
			else if (button.classList.contains("toggle-sign")) {
				if (currentInput === "") return;
				if (currentInput.startsWith("-")) {
					currentInput = currentInput.slice(1);
				} else {
					currentInput = "-" + currentInput;
				}
				updateDisplay(currentInput);
			}
			// Percent functionality
			else if (button.classList.contains("percent")) {
				if (currentInput === "") return;
				try {
					let result = eval(currentInput) / 100;
					if (isNaN(result) || !isFinite(result)) {
						throw new Error("Math Error");
					}
					currentInput = result.toString();
					updateDisplay(currentInput);
					updateHistory(historyText);
				} catch (error) {
					updateDisplay(error.message);
					updateHistory(historyText);
					currentInput = "";
					setTimeout(() => {
						updateDisplay("0");
						updateHistory("");
					}, 1500);
				}
			}
			// Equal button functionality
			else if (button.classList.contains("equal")) {
				if (currentInput !== "") {
					try {
						let evalInput = currentInput
							.replace(/÷/g, "/")
							.replace(/×/g, "*")
							.replace(/−/g, "-");
						let result = eval(evalInput);
						if (isNaN(result) || !isFinite(result)) {
							throw new Error("Math Error");
						}
						historyText = currentInput;
						updateDisplay(result.toString());
						updateHistory(historyText);
						currentInput = result.toString();
					} catch (error) {
						updateDisplay(error.message);
						updateHistory(historyText);
						currentInput = "";
						setTimeout(() => {
							updateDisplay("0");
							updateHistory("");
						}, 1500);
					}
				}
			}
			// Handle decimal point to prevent multiple decimals
			else if (value === ".") {
				const lastNumber = currentInput.split(/[\+\−\*\/÷×]/).pop();
				if (lastNumber.includes(".")) return;
				currentInput += value;
				updateDisplay(currentInput);
			}
			// Normal button functionality
			else {
				currentInput += value;
				updateDisplay(currentInput);
			}
		});
	});

	// Light/Dark Mode Toggle
	themeToggle.addEventListener("change", () => {
		body.classList.toggle("light-mode");
	});

	// Numpad and Keyboard Support
	document.addEventListener("keydown", (event) => {
		const key = event.key;

		// Map keyboard and numpad keys to calculator buttons
		switch (key) {
			// Numbers (works for both main keyboard and numpad)
			case "0":
			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
			case "9":
				simulateButtonClick(key);
				break;

			// Operators
			case "+":
				simulateButtonClick("+");
				break;
			case "-":
				simulateButtonClick("−");
				break;
			case "*": // Multiply (both main keyboard and numpad)
				simulateButtonClick("×");
				break;
			case "/": // Divide (both main keyboard and numpad)
				simulateButtonClick("÷");
				break;

			// Decimal point
			case ".":
				simulateButtonClick(".");
				break;

			// Enter key for equals
			case "Enter":
				simulateButtonClick("=");
				break;

			// Escape key for clear (AC)
			case "Escape":
				simulateButtonClick("AC");
				break;

			// Percent
			case "%":
				simulateButtonClick("%");
				break;

			// Prevent default behavior for these keys to avoid unwanted actions
			default:
				if (
					["+", "-", "*", "/", ".", "Enter", "Escape", "%"].includes(
						key
					)
				) {
					event.preventDefault();
				}
		}
	});
});
