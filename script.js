//	model
const Calculator = {
	numA: 0,
	numB: 0,
	resultC: 0,

	add() { this.resultC = this.numA + this.numB; },
	subtract() { this.resultC = this.numA + this.numB; },
	multiply() { this.resultC = this.numA * this.numB; },
	divide() { this.resultC = this.numA / this.numB; },
	changeSign() { this.resultC = -this.resultC; },
	square() { this.resultC *= this.resultC; },
	root() { this.resultC = Math.root(this.resultC); },
}

//	view
const View = {
	disabled: false,
	float: false,
	screen: document.querySelectorAll('.screen'),
	screenCurrent: document.querySelector('.current'),
	screenHistory: document.querySelector('.history'),
	operatorButtons: document.querySelectorAll('.operator'),
	deleteButton: document.querySelector('#delete'),
	deleteAllButton: document.querySelector('#deleteAll'),
	numberButtons: document.querySelectorAll('.number'),
	dotButton: document.querySelector('#dot'),

}

//	controller
const Controller = {

}

View.init();
