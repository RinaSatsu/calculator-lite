//	model
const Calculator = {
	numA: 0,
	numB: 0,
	resultC: 0,

	init () { return this; },

	add () { this.resultC = this.numA + this.numB; },
	subtract () { this.resultC = this.numA - this.numB; },
	multiply () { this.resultC = this.numA * this.numB; },
	divide () { this.resultC = this.numA / this.numB; },
	square () { this.resultC = this.numA * this.numA; },
	root () { this.resultC = Math.sqrt(this.numA); }
};

//	view
const View = {
	disabled: false,
	float: false,
	negativeSign: false,
	deletedOp: false,
	screen: document.querySelectorAll('.screen'),
	screenCurrent: document.querySelector('.current'),
	screenHistory: document.querySelector('.history'),
	operatorButtons: document.querySelectorAll('.operator'),
	deleteButton: document.querySelector('#delete'),
	deleteAllButton: document.querySelector('#deleteAll'),
	changeSignButton: document.querySelector('#changeSign'),
	equalsButton: document.querySelector('#equals'),
	numberButtons: document.querySelectorAll('.number'),
	dotButton: document.querySelector('#dot'),

	init () {
		this.operatorButtons.forEach(button => {
			button.addEventListener('click', this.onOperatorClick);
		});
		this.numberButtons.forEach(button => {
			button.addEventListener('click', this.onNumClick);
		});
		this.deleteButton.addEventListener('click', this.onDelete);
		this.deleteAllButton.addEventListener('click', this.onDeleteAll);

		this.equalsButton.addEventListener('click', this.onEqualsClick);
		this.changeSignButton.addEventListener('click', this.onChangeSignClick);
		this.dotButton.addEventListener('click', this.onDotClick);
		return this;
	},

	onOperatorClick (event) {
		if (View.screenCurrent.textContent === 'Error') {
			return;
		}
		if (event.target.classList.contains('unary')) {
			View.saveA();
			View.saveOperand(event.target);
			View.writeResult();
			return;
		}
		if (View.screenHistory.textContent.match(/\+|−|×|÷/g) && !View.screenHistory.textContent.includes('=')) {
			View.saveB();
			View.writeResult();
		}
		View.saveA();
		View.saveOperand(event.target);
		View.screenCurrent.textContent = '0';
		View.updateFlags();
	},

	onEqualsClick () {
		if (Controller.currentOperation === undefined || View.screenCurrent.textContent === 'Error') {
			return;
		}
		if (View.screenHistory.textContent.includes('=')) {
			if (Controller.currentOperation.classList.contains('unary')) {
				View.screenHistory.textContent = View.screenCurrent.textContent;
				View.screenHistory.textContent += '=';
				return;
			}
			View.saveA();
			View.saveOperand(Controller.currentOperation);
			View.screenHistory.textContent += Controller.getB();
			View.writeResult();
		} else {
			View.saveB();
			View.writeResult();
		}
	},

	onDelete () {
		if (View.screenHistory.textContent.includes('=')) {
			View.screenHistory.textContent = '';
			Controller.currentOperation = undefined;
			return;
		}
		if (View.screenCurrent.textContent === 'Error') {
			View.screenCurrent.textContent = '0';
			View.updateFlags();
			return;
		}
		if (View.screenCurrent.textContent === '0') {
			if (!View.screenHistory.textContent.slice(-1).match(/\d/g)) {
				View.screenHistory.textContent = View.screenHistory.textContent.slice(0, -1);
				Controller.currentOperation = undefined;
				View.screenCurrent.textContent = View.screenHistory.textContent;
				View.screenHistory.textContent = '';
				View.updateFlags();
			}
			return;
		}
		View.screenCurrent.textContent = View.screenCurrent.textContent.slice(0, -1);
		if (View.screenCurrent.textContent.length === 0) {
			View.screenCurrent.textContent = '0';
		}
		View.updateFlags();
	},

	onDeleteAll () {
		View.screenCurrent.textContent = '0';
		View.screenHistory.textContent = '';
		View.disabled = false;
		View.float = false;
		View.negativeSign = false;
		Controller.currentOperation = undefined;
	},

	onNumClick (event) {
		if (View.disabled) {
			return;
		}
		if (View.screenCurrent.textContent === '0') {
			View.screenCurrent.textContent = `${event.target.dataset.num}`;
		} else if (View.screenCurrent.textContent.length === (10 + View.float + View.negativeSign)) {
			View.disabled = true;
		} else {
			View.screenCurrent.textContent += `${event.target.dataset.num}`;
		}
	},

	onDotClick () {
		if (View.disabled || View.float) {
			return;
		}
		if (View.screenCurrent.textContent === '-') {
			View.screenCurrent.textContent += '0';
		}
		View.screenCurrent.textContent += '.';
		View.float = true;
	},

	onChangeSignClick () {
		if (View.negativeSign) {
			View.screenCurrent.textContent = View.screenCurrent.textContent.slice(1);
		} else {
			View.screenCurrent.textContent = '-' + View.screenCurrent.textContent;
		}
		View.negativeSign = !View.negativeSign;
	},

	saveA () {
		const num = View.screenCurrent.textContent;
		if (num === '-' || num === '0.') {
			Controller.setA(0);
		} else {
			Controller.setA(parseFloat(num));
		}
		View.screenHistory.textContent = Controller.getA();
		View.screenCurrent.textContent = '0';
		View.updateFlags();
	},

	saveB () {
		const num = View.screenCurrent.textContent;
		if (num === '-' || num === '0.') {
			Controller.setB(0);
		} else {
			Controller.setB(parseFloat(num));
		}
		View.screenHistory.textContent += Controller.getB(); // +=!!!!!!!!!!!!
		View.screenCurrent.textContent = '0';
		View.updateFlags();
	},

	saveOperand (operand) {
		switch (operand.id) {
		case 'square':
			View.screenHistory.innerHTML += '<sup>2</sup>';
			break;
		case 'root':
			View.screenHistory.innerHTML = '&radic;' + View.screenHistory.textContent;
			break;
		default:
			View.screenHistory.textContent += operand.textContent;
			break;
		}
		Controller.currentOperation = operand;
	},

	writeResult () {
		View.screenHistory.innerHTML += '=';
		if (Controller.currentOperation.id === 'divide' && Controller.getB() === 0) {
			View.screenCurrent.textContent = 'Error';
			View.disabled = true;
			return;
		}
		const resStr = View.roundUp(Controller.getResult());
		View.screenCurrent.textContent = resStr;
		View.updateFlags();
	},

	roundUp (num) {
		if (num === 0) {
			return '0';
		} else if ((num >= 1e10) || (num <= -1e10)) {
			return num.toPrecision(6);
		} else if ((num < 1) && (num > -1)) {
			if ((num < 1e-9) && (num > -1e-9)) {
				return num.toPrecision(6);
			} else {
				return num.toFixed(9).replace(/(?:\.0+|(\.\d+?)0+)$/, '$1');
			}
		}
		return num.toPrecision(10).replace(/(?:\.0+|(\.\d+?)0+)$/, '$1');
	},

	updateFlags () {
		const current = View.screenCurrent.textContent;
		View.float = (current.includes('.') || current.includes('e'));
		View.negativeSign = current[0] === '-';
		View.disabled = current.length === (10 + View.float + View.negativeSign);
	}
};

//	controller
const Controller = {
	viev: View.init(),
	calculator: Calculator.init(),
	currentOperation: undefined,

	init () {

	},

	getA () {
		return this.calculator.numA;
	},

	setA (num) {
		this.calculator.numA = num;
	},

	getB () {
		return this.calculator.numB;
	},

	setB (num) {
		this.calculator.numB = num;
	},

	getResult () {
		this.calculator[this.currentOperation.id]();
		return this.calculator.resultC;
	}

};

Controller.init();
