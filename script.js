document.addEventListener("DOMContentLoaded", function () {
	const display = document.getElementById("result");
	const history = document.getElementById("history");
	const buttons = document.querySelectorAll(".btn");
	const themeToggle = document.getElementById("theme-toggle");
	const body = document.body;

	// History panel elements
	const historyToggle = document.getElementById("history-toggle");
	const historyPanel = document.getElementById("history-panel");
	const historyList = document.getElementById("history-list");
	const historyClearBtn = document.getElementById("history-clear");

	let currentInput = "";
	let historyText = "";

	// Load stored history on boot
	let calcHistory = JSON.parse(localStorage.getItem("calcHistory")) || [];
	renderHistory();

	function updateDisplay(value) {
		display.textContent = value || "0";
		const baseFontSize = 2.5;
		const minFontSize = 1.5;
		const length = display.textContent.length;
		let fontSize = baseFontSize;
		if (length > 10) {
			fontSize = Math.max(
				minFontSize,
				baseFontSize - (length - 10) * 0.1
			);
		}
		display.style.fontSize = `${fontSize}rem`;
	}

	function updateHistory(value) {
		history.textContent = value;
	}

	function renderHistory() {
		historyList.innerHTML = "";
		calcHistory.slice().reverse().forEach((entry, idx) => {
			const li = document.createElement("li");
			li.textContent = `${entry.expr} = ${entry.result}`;
			li.addEventListener("click", () => {
				currentInput = entry.result.toString();
				updateDisplay(currentInput);
			});
			historyList.appendChild(li);
		});
	}

	function simulateButtonClick(value) {
		const button = Array.from(buttons).find(
			(btn) => btn.textContent === value
		);
		if (button) {
			button.click();
		}
	}

	buttons.forEach((button) => {
		button.addEventListener("click", () => {
			const value = button.textContent;

			if (button.classList.contains("clear")) {
				currentInput = "";
				historyText = "";
				updateDisplay("0");
				updateHistory("");
			} else if (button.classList.contains("backspace")) {
				if (currentInput === "") return;
				currentInput = currentInput.slice(0, -1);
				updateDisplay(currentInput);
			} else if (button.classList.contains("percent")) {
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
			} else if (button.classList.contains("equal")) {
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
						
						// Store in history
						calcHistory.push({ expr: historyText, result });
						localStorage.setItem("calcHistory", JSON.stringify(calcHistory));
						renderHistory();
						
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
			} else if (value === ".") {
				const lastNumber = currentInput.split(/[\+\−\*\/÷×]/).pop();
				if (lastNumber.includes(".")) return;
				currentInput += value;
				updateDisplay(currentInput);
			} else {
				currentInput += value;
				updateDisplay(currentInput);
			}
		});
	});

	themeToggle.addEventListener("change", () => {
		body.classList.toggle("light-mode");
	});

	// History panel toggle
	historyToggle.addEventListener("click", () => {
		historyPanel.classList.toggle("open");
		historyToggle.classList.toggle("open");
	});

	// Clear history
	historyClearBtn.addEventListener("click", () => {
		calcHistory = [];
		localStorage.removeItem("calcHistory");
		renderHistory();
	});

	document.addEventListener("keydown", (event) => {
		const key = event.key;

		switch (key) {
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
				simulateButtonClick("÷");
				break;
			case ".":
				simulateButtonClick(".");
				break;
			case "Enter":
				simulateButtonClick("=");
				break;
			case "Escape":
				simulateButtonClick("AC");
				break;
			case "%":
				simulateButtonClick("%");
				break;
			case "Backspace":
				simulateButtonClick("←");
				break;
			default:
				if (
					[
						"+",
						"-",
						"*",
						"/",
						".",
						"Enter",
						"Escape",
						"%",
						"Backspace",
					].includes(key)
				) {
					event.preventDefault();
				}
		}
	});

	/* ---------- Live clock ----------- */
	function startClock() {
		const clock = document.getElementById("clock");
		function update() {
			const now = new Date();
			clock.textContent = now.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
			});
		}
		update(); // initial call
		setInterval(update, 1000); // tick every second
	}
	startClock();
});
