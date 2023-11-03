//const PRESISION = 10000;

//	model
const Calculator = {
	numA: 0,
	numB: 0,
	resultC: 0,

	init() { return this; },

	add() { this.resultC = this.numA + this.numB; },
	subtract() { this.resultC = this.numA - this.numB; },
	multiply() { this.resultC = this.numA * this.numB; },
	divide() { this.resultC = this.numA / this.numB; },
	changeSign() { this.resultC = -this.numA; },
	square() { this.resultC = this.numA * this.numA; },
	root() { this.resultC = Math.sqrt(this.numA); },
}

//	view
const View = {
	disabled: false,
	float: false,
	cumulative: false,
	screen: document.querySelectorAll('.screen'),
	screenCurrent: document.querySelector('.current'),
	screenHistory: document.querySelector('.history'),
	operatorButtons: document.querySelectorAll('.operator'),
	deleteButton: document.querySelector('#delete'),
	deleteAllButton: document.querySelector('#deleteAll'),
	equalsButton: document.querySelector('#equals'),
	numberButtons: document.querySelectorAll('.number'),
	dotButton: document.querySelector('#dot'),

	init() {
		this.operatorButtons.forEach(button => {
			button.addEventListener('click', this.onOperatorClick);
		});
		this.numberButtons.forEach(button => {
			button.addEventListener('click', this.onNumClick);
		});
		this.deleteButton.addEventListener('click', this.onDelete);

		this.equalsButton.addEventListener('click', this.onEqualsClick);

		this.deleteAllButton.addEventListener('click', this.onDeleteAll);
		this.dotButton.addEventListener('click', this.onDotClick);
		return this;
	},

	onOperatorClick(event) {
		if (event.target.id === 'equals') {
			View.disabled = false;
			View.float = false;
			View.cumulative = false;
			let num = View.screenCurrent.textContent;
			Controller.saveNumber(parseFloat(num));
			let resStr = View.roundUp(Controller.getResult());
			View.screenCurrent.textContent = resStr;
			View.screenHistory.textContent += num + '=';
		} else if (event.target.classList.contains('unary')) {
			View.disabled = false;
			View.float = false;
			View.cumulative = false;
			let num = View.screenCurrent.textContent;
			Controller.saveNumber(parseFloat(num), event.target.id);
			//View.screenCurrent.textContent = Controller.getResult();
			let histStr = num;
			switch (event.target.id) {
				case 'square':
					histStr += '<sup>2</sup>';
					break;
				case 'root':
					histStr = '&radic;' + histStr;
					break;
				default:
					break;
			}
			View.screenHistory.innerHTML = histStr;
		} else {
		//binary
		//unary
		View.disabled = false;
		View.float = false;
		View.cumulative = true;
		let num = View.screenCurrent.textContent;
		Controller.saveNumber(parseFloat(num), event.target.id);
		View.screenCurrent.textContent = '0';
		View.screenHistory.textContent = num + event.target.textContent;
		}
	},

	onEqualsClick() {
		View.disabled = false;
		View.float = false;
		View.cumulative = false;
		let num = View.screenCurrent.textContent;
		Controller.saveNumber(parseFloat(num));
		let resStr = View.roundUp(Controller.getResult());
		View.screenCurrent.textContent = resStr;
		View.screenHistory.textContent += num + '=';
	},


	onDelete() {
		if (View.screenCurrent.textContent === '0') { 
			return;
		}
		if (View.screenCurrent.textContent.slice(-1) === '.') {
			View.float = false;
		}
		View.screenCurrent.textContent = View.screenCurrent.textContent.slice(0, -1);
		View.disabled = false;
		//	add operator delete logic
		//	add e delete logic?
		// e and negative notation
	},

	onDeleteAll() {
		View.screenCurrent.textContent = '0';
		View.screenHistory.textContent = '';
		View.disabled = false;
		View.float = false;
		View.cumulative = false;
	},

	onNumClick(event) {
		if (View.disabled) {
			return;
		}
		if (View.screenCurrent.textContent === '0') {
			View.screenCurrent.textContent = `${event.target.dataset.num}`;
		} else if (View.screenCurrent.textContent.length === (10 + View.float)) {
			View.disabled = true;
		} else {
			View.screenCurrent.textContent += `${event.target.dataset.num}`;
		}
	},

	onDotClick() {
		if (View.disabled || View.float) {
			return;
		}
		View.screenCurrent.textContent += '.';
		View.float = true;
	},

	roundUp(num) {
		if ((num >= 1e10) || (num <= -1e10)) {
			return num.toPrecision(6);
		} else if ((num < 1) && (num > -1)) {
			if ((num < 1e-9) && (num > -1e-9)) {
				return num.toPrecision(6);
			} else {
				return num.toFixed(9).replace(/(?:\.0+|(\.\d+?)0+)$/, "$1");
			}
		}
		return num.toPrecision(10).replace(/(?:\.0+|(\.\d+?)0+)$/, "$1");
	},
}

//	controller
const Controller = {
	viev: View.init(),
	calculator: Calculator.init(),
	currentOperation: undefined,

	init() {
		
	},

	saveNumber(num, func) {
		if (func === undefined) {
			this.calculator.numB = num;
		} else {
			this.calculator.numA = num;
			this.currentOperation = func;
		}
	},

	getResult() {
		this.calculator[this.currentOperation]();
		return this.calculator.resultC;
	},

}

//View.init();
//console.log(Controller);
Controller.init();
//console.log(Controller);
