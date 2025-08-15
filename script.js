/**
 * ====================================
 * ADVANCED CALCULATOR - MAIN SCRIPT
 * ====================================
 *
 * Features:
 * - Basic arithmetic operations (+, -, ×, ÷, %)
 * - Keyboard shortcuts support
 * - History panel with localStorage persistence
 * - Theme switching (dark/light mode)
 * - Responsive design
 * - Error handling
 *
 * Author: Your Name
 * Version: 1.0
 * Last Updated: August 2025
 */

document.addEventListener("DOMContentLoaded", function () {
	// ====================================
	// DOM ELEMENT REFERENCES
	// ====================================

	// Display elements
	const display = document.getElementById("result");
	const history = document.getElementById("history");

	// Button elements
	const buttons = document.querySelectorAll(".btn");

	// Theme toggle
	const themeToggle = document.getElementById("theme-toggle");
	const body = document.body;

	// History panel elements
	const historyToggle = document.getElementById("history-toggle");
	const historyPanel = document.getElementById("history-panel");
	const historyList = document.getElementById("history-list");
	const historyClearBtn = document.getElementById("history-clear");

	// ====================================
	// STATE VARIABLES
	// ====================================

	let currentInput = ""; // Current calculation string
	let historyText = ""; // Previous calculation for history display

	// Load calculation history from localStorage (persistent storage)
	let calcHistory = JSON.parse(localStorage.getItem("calcHistory")) || [];

	// ====================================
	// DISPLAY FUNCTIONS
	// ====================================

	/**
	 * Updates the main result display with dynamic font sizing
	 * @param {string} value - The value to display
	 */
	function updateDisplay(value) {
		display.textContent = value || "0";

		// Dynamic font sizing based on text length
		const baseFontSize = 2.5;
		const minFontSize = 1.5;
		const length = display.textContent.length;
		let fontSize = baseFontSize;

		// Reduce font size for longer numbers
		if (length > 10) {
			fontSize = Math.max(
				minFontSize,
				baseFontSize - (length - 10) * 0.1
			);
		}

		display.style.fontSize = `${fontSize}rem`;
	}

	/**
	 * Updates the history display area
	 * @param {string} value - The history value to display
	 */
	function updateHistory(value) {
		history.textContent = value;
	}

	/**
	 * Renders the calculation history in the side panel
	 */
	function renderHistory() {
		historyList.innerHTML = "";

		// Show placeholder if no calculations exist
		if (calcHistory.length === 0) {
			const li = document.createElement("li");
			li.textContent = "No calculations yet";
			li.style.opacity = "0.5";
			li.style.cursor = "default";
			li.style.pointerEvents = "none";
			historyList.appendChild(li);
			return;
		}

		// Render history items (newest first)
		calcHistory
			.slice()
			.reverse()
			.forEach((entry, idx) => {
				const li = document.createElement("li");
				li.textContent = `${entry.expr} = ${entry.result}`;

				// Staggered animation delay
				li.style.animationDelay = `${idx * 0.1}s`;

				// Click to use result
				li.addEventListener("click", () => {
					currentInput = entry.result.toString();
					updateDisplay(currentInput);

					// Auto-close on mobile for better UX
					if (window.innerWidth <= 480) {
						closeHistoryPanel();
					}
				});

				historyList.appendChild(li);
			});
	}

	// ====================================
	// CALCULATION FUNCTIONS
	// ====================================

	/**
	 * Simulates a button click programmatically (for keyboard support)
	 * @param {string} value - The button value to simulate
	 */
	function simulateButtonClick(value) {
		const button = Array.from(buttons).find(
			(btn) => btn.textContent === value
		);
		if (button) {
			button.click();
		}
	}

	// ====================================
	// HISTORY PANEL FUNCTIONS
	// ====================================

	/**
	 * Opens the history panel
	 */
	function openHistoryPanel() {
		historyPanel.classList.add("open");
	}

	/**
	 * Closes the history panel
	 */
	function closeHistoryPanel() {
		historyPanel.classList.remove("open");
	}

	/**
	 * Toggles the history panel open/closed
	 */
	function toggleHistoryPanel() {
		historyPanel.classList.toggle("open");
	}

	// ====================================
	// BUTTON EVENT HANDLERS
	// ====================================

	// Add click event listeners to all calculator buttons
	buttons.forEach((button) => {
		button.addEventListener("click", () => {
			const value = button.textContent;

			// Handle different button types
			if (button.classList.contains("clear")) {
				// Clear all (AC button)
				currentInput = "";
				historyText = "";
				updateDisplay("0");
				updateHistory("");
			} else if (button.classList.contains("backspace")) {
				// Backspace functionality
				if (currentInput === "") return;
				currentInput = currentInput.slice(0, -1);
				updateDisplay(currentInput);
			} else if (button.classList.contains("percent")) {
				// Percentage calculation
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
					// Handle calculation errors
					updateDisplay(error.message);
					updateHistory(historyText);
					currentInput = "";
					setTimeout(() => {
						updateDisplay("0");
						updateHistory("");
					}, 1500);
				}
			} else if (button.classList.contains("equal")) {
				// Equals calculation
				if (currentInput !== "") {
					try {
						// Replace display symbols with JavaScript operators
						let evalInput = currentInput
							.replace(/÷/g, "/")
							.replace(/×/g, "*")
							.replace(/−/g, "-");

						let result = eval(evalInput);

						// Check for invalid results
						if (isNaN(result) || !isFinite(result)) {
							throw new Error("Math Error");
						}

						historyText = currentInput;
						updateDisplay(result.toString());
						updateHistory(historyText);

						// Store calculation in history
						calcHistory.push({ expr: historyText, result });
						localStorage.setItem(
							"calcHistory",
							JSON.stringify(calcHistory)
						);
						renderHistory();

						// Set result as new input for chaining calculations
						currentInput = result.toString();
					} catch (error) {
						// Handle calculation errors
						updateDisplay(error.message);
						updateHistory(historyText);
						currentInput = "";
						setTimeout(() => {
							updateDisplay("0");
							updateHistory("");
						}, 1500);
					}
				}
			} else if (value === ".") {
				// Decimal point handling (prevent multiple decimals)
				const lastNumber = currentInput.split(/[\+\−\*\/÷×]/).pop();
				if (lastNumber.includes(".")) return;
				currentInput += value;
				updateDisplay(currentInput);
			} else {
				// Number and operator input
				currentInput += value;
				updateDisplay(currentInput);
			}
		});
	});

	// ====================================
	// THEME TOGGLE HANDLER
	// ====================================

	themeToggle.addEventListener("change", () => {
		body.classList.toggle("light-mode");

		// Optional: Save theme preference to localStorage
		// localStorage.setItem("theme", body.classList.contains("light-mode") ? "light" : "dark");
	});

	// ====================================
	// HISTORY PANEL EVENT HANDLERS
	// ====================================

	// History panel toggle button
	historyToggle.addEventListener("click", (e) => {
		e.stopPropagation(); // Prevent immediate closing from document click handler
		toggleHistoryPanel();
	});

	// Clear history button with visual feedback
	historyClearBtn.addEventListener("click", (e) => {
		e.stopPropagation(); // Prevent closing panel

		// Add shake animation for visual feedback
		historyClearBtn.style.animation = "shake 0.5s ease-in-out";
		setTimeout(() => {
			historyClearBtn.style.animation = "";
		}, 500);

		// Clear history data
		calcHistory = [];
		localStorage.removeItem("calcHistory");
		renderHistory();
	});

	// ====================================
	// CLICK-OUTSIDE-TO-CLOSE FUNCTIONALITY
	// ====================================

	// Close history panel when clicking outside
	document.addEventListener("click", (e) => {
		// Don't close if clicking inside the history panel or on the toggle button
		if (
			historyPanel.contains(e.target) ||
			historyToggle.contains(e.target)
		) {
			return;
		}

		// Close panel if it's open
		if (historyPanel.classList.contains("open")) {
			closeHistoryPanel();
		}
	});

	// Prevent panel from closing when clicking inside it
	historyPanel.addEventListener("click", (e) => {
		e.stopPropagation();
	});

	// ====================================
	// CSS ANIMATIONS (Dynamic Injection)
	// ====================================

	// Add shake animation for clear button
	const style = document.createElement("style");
	style.textContent = `
        @keyframes shake {
            0%, 100% { transform: scale(1.3) rotate(-20deg) translateX(0); }
            25% { transform: scale(1.3) rotate(-20deg) translateX(-5px); }
            75% { transform: scale(1.3) rotate(-20deg) translateX(5px); }
        }
    `;
	document.head.appendChild(style);

	// ====================================
	// KEYBOARD SHORTCUTS
	// ====================================

	document.addEventListener("keydown", (event) => {
		const key = event.key.toLowerCase();

		// History panel shortcuts
		if (key === "h" && !event.ctrlKey && !event.altKey && !event.shiftKey) {
			// Only trigger if not typing in an input field
			if (
				document.activeElement.tagName !== "INPUT" &&
				document.activeElement.tagName !== "SELECT"
			) {
				event.preventDefault();
				toggleHistoryPanel();
				return;
			}
		}

		// Escape key to close history panel
		if (key === "escape") {
			event.preventDefault();
			if (historyPanel.classList.contains("open")) {
				closeHistoryPanel();
			} else {
				// If panel is closed, escape acts as clear
				simulateButtonClick("AC");
			}
			return;
		}

		// Calculator operation shortcuts
		switch (event.key) {
			// Number keys
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
				simulateButtonClick(event.key);
				break;

			// Operation keys
			case "+":
				simulateButtonClick("+");
				break;
			case "-":
				simulateButtonClick("−");
				break;
			case "*":
				simulateButtonClick("×");
				break;
			case "/":
				event.preventDefault(); // Prevent browser search
				simulateButtonClick("÷");
				break;
			case ".":
				simulateButtonClick(".");
				break;
			case "Enter":
				event.preventDefault();
				simulateButtonClick("=");
				break;
			case "%":
				simulateButtonClick("%");
				break;
			case "Backspace":
				event.preventDefault();
				simulateButtonClick("←");
				break;
		}
	});

	// ====================================
	// INITIALIZATION
	// ====================================

	// Render initial history on page load
	renderHistory();

	// Optional: Load saved theme preference
	// const savedTheme = localStorage.getItem("theme");
	// if (savedTheme === "light") {
	//     themeToggle.checked = true;
	//     body.classList.add("light-mode");
	// }

	// ====================================
	// UTILITY FUNCTIONS
	// ====================================

	/**
	 * Optional: Live clock functionality
	 * Uncomment to add a live clock to the calculator
	 */
	/*
    function startClock() {
        const clock = document.getElementById("clock");
        if (!clock) return;
        
        function update() {
            const now = new Date();
            clock.textContent = now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
        }
        
        update(); // Initial call
        setInterval(update, 1000); // Update every second
    }
    
    startClock();
    */

	// ====================================
	// DEVELOPMENT HELPERS
	// ====================================

	/**
	 * Console logging for debugging (remove in production)
	 */
	console.log("🧮 Calculator initialized successfully!");
	console.log("📚 History items loaded:", calcHistory.length);

	/**
	 * Keyboard shortcuts help
	 * Log available shortcuts to console
	 */
	console.log(`
    ⌨️  Keyboard Shortcuts:
    • Numbers: 0-9
    • Operations: +, -, *, /, %
    • Decimal: .
    • Calculate: Enter
    • Clear: Escape
    • Backspace: Backspace
    • History: H
    • Close History: Escape
    `);
});

// ====================================
// END OF SCRIPT
// ====================================

/**
 * CUSTOMIZATION NOTES:
 *
 * To modify calculator behavior:
 *
 * 1. COLORS: Edit CSS custom properties at the top of style.css
 * 2. ANIMATIONS: Modify transition durations and easing functions
 * 3. BUTTONS: Add new buttons in HTML and corresponding handlers in JS
 * 4. HISTORY: Modify renderHistory() function for different display formats
 * 5. KEYBOARD: Add new shortcuts in the keydown event listener
 * 6. THEMES: Extend light-mode class styles for new color schemes
 * 7. MOBILE: Adjust mobile breakpoints and sizes in @media queries
 *
 * For advanced features:
 *
 * - Scientific calculator: Add trigonometric functions in button handlers
 * - Memory functions: Implement M+, M-, MR, MC buttons
 * - Copy/paste: Add clipboard API integration
 * - Sound effects: Add audio feedback for button clicks
 * - Gestures: Implement touch/swipe controls for mobile
 */
