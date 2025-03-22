document.addEventListener("DOMContentLoaded", function () {
	const display = document.getElementById("result");
	const history = document.getElementById("history");
	const buttons = document.querySelectorAll(".btn");
	const themeToggle = document.getElementById("theme-toggle");
	const body = document.body;

	let currentInput = "";
	let historyText = "";

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
});
