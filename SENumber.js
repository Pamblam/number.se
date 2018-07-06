
Number.SE = function(number){
	if(!(this instanceof Number.SE)) return new Number.SE(number);
	this.number = Number.SE.normalize(number);
};

Number.SE.normalize = function(number){
	if(typeof number !== "string" && typeof number !== "number" && !(number instanceof Number.SE)){
		throw new Error("SE Contrstructor requires a number or string");
	}
	const trimTrailingZeroes = n=> ~n.indexOf(".")&&(n.substr(-1)==="0"||n.substr(-1)===".")?trimTrailingZeroes(n.substr(0,n.length-1)):n;
	const trimLeadingZeroes = n=> n.substr(0,1)==="0"?trimLeadingZeroes(n.substr(1)):n;
	var n = typeof number === "string" ? number : number instanceof Number.SE ? number.number : number.toString();
	n = n.trim();
	var isNegative = n.substr(0,1) === "-";
	if(isNegative) n = n.substr(1);
	n = trimTrailingZeroes(trimLeadingZeroes(n));
	return n ? isNegative ? "-"+n : n : "0";
};

Number.SE.max = function(number1, number2){
	if(!(number1 instanceof Number.SE)) number1 = new Number.SE(number1);
	if(!(number2 instanceof Number.SE)) number2 = new Number.SE(number2);
	if(number1.isNegative() && !number2.isNegative()) return number2;
	if(!number1.isNegative() && number2.isNegative()) return number1;
	return number1.abs() > number2.abs() ? number1 : number2;
};

Number.SE.min = function(number1, number2){
	if(!(number1 instanceof Number.SE)) number1 = new Number.SE(number1);
	if(!(number2 instanceof Number.SE)) number2 = new Number.SE(number2);
	if(number1.isNegative() && !number2.isNegative()) return number1;
	if(!number1.isNegative() && number2.isNegative()) return number2;
	return number1.abs() > number2.abs() ? number2 : number1;
};

Number.SE.alignDecimals = function(number1, number2){
	if(!(number1 instanceof Number.SE)) number1 = new Number.SE(number1);
	if(!(number2 instanceof Number.SE)) number2 = new Number.SE(number2);
	var is1neg = number1.isNegative();
	var is2neg = number2.isNegative();
	number1.number = number1.abs(); 
	number2.number = number2.abs();
	const getDecimalPosit = n=>~n.number.indexOf(".") ? n.number.indexOf(".") : n.number.length;
	const addLeadingZeros = (n, dif)=>"0".repeat(dif)+n.number;
	const addTrailingZeros = (n, dif)=>n.number+"0".repeat(dif);
	const trimTrailingZeroes = n=> ~n.indexOf(".")&&n.substr(-1)==="0"?trimTrailingZeroes(n.substr(0,n.length-1)):n;
	const postDecimalLength = n=>~n.indexOf(".")?n.length-n.indexOf(".")-1:0;
	var dpos1 = getDecimalPosit(number1);
	var dpos2 = getDecimalPosit(number2);
	if(dpos1 > dpos2) number2.number = addLeadingZeros(number2, dpos1-dpos2);
	if(dpos2 > dpos1) number1.number = addLeadingZeros(number1, dpos2-dpos1);
	var pdl1 = postDecimalLength(number1.number);
	var pdl2 = postDecimalLength(number2.number);
	if(~number1.number.indexOf(".") && !~number2.number.indexOf(".")) number2.number+=".";
	if(~number2.number.indexOf(".") && !~number1.number.indexOf(".")) number1.number+=".";
	if(pdl1 > pdl2) number2.number = addTrailingZeros(number2, pdl1-pdl2);
	if(pdl2 > pdl1) number1.number = addTrailingZeros(number1, pdl2-pdl1);
	if(is1neg) number1.number = "-"+number1.number;
	if(is2neg) number2.number = "-"+number2.number;
	return [number1, number2];
};

Number.SE.prototype.isNegative = function(){
	return this.number.substr(0,1) === "-";
};

Number.SE.prototype.abs = function(){
	return this.isNegative() ? this.number.substr(1) : this.number;
};

Number.SE.prototype.add = function(number){
	var [n1, n2] = Number.SE.alignDecimals(this.number, number);
	if((n1.isNegative() && !n2.isNegative()) || (!n1.isNegative() && n2.isNegative())){
		var is1neg = n1.isNegative();
		var is2neg = n2.isNegative();
		n1.number = n1.abs();
		n2.number = n2.abs();
		var largerNumber = n1.number > n2.number ? n1 : n1.number < n2.number ? n2 : false;
		var smallerNumber = n1.number > n2.number ? n2 : n1.number < n2.number ? n1 : false;
		if(largerNumber === false || smallerNumber === false){
			this.number = "0";
			return this;
		}
		var isNeg = (largerNumber.number === n1.number && is1neg) || (largerNumber.number === n2.number && is2neg);
		this.number = (isNeg ? "-" : "") + largerNumber.subtract(smallerNumber);
		return this;
	}
	var isNeg = n1.isNegative() && n2.isNegative();
	if(isNeg){
		n1.number = n1.abs();
		n2.number = n2.abs();
	}
	n1 = n1.number.split('').reverse();
	n2 = n2.number.split('').reverse();
	var carry=0, buffer = [];
	for(let i=0; i<n1.length; i++){
		if(n1[i] === "."){ buffer.push("."); continue; }
		let x = parseInt(n1[i]);
		let y = parseInt(n2[i]);
		let sum = (x+y+carry).toString().split('');
		buffer.push(sum.pop())
		carry = sum.length ? parseInt(sum.join('')) : 0;
	}
	buffer.push(...carry.toString().split('').reverse());
	this.number = Number.SE.normalize((isNeg ? "-" : "") + buffer.reverse().join(''));
	return this;
};

Number.SE.prototype.subtract = function(number){
	var [n1, n2] = Number.SE.alignDecimals(this.number, number);
	var isNegative = n1.number < n2.number;
	if(isNegative){
		var temp = n1;
		n1 = n2;
		n2 = temp;
	}
	n1 = n1.number.split('').reverse();
	n2 = n2.number.split('').reverse();
	var buffer = [];
	const borrow = (arr, idx) => {
		if(arr[idx+1] === undefined) process.exit();
		if(parseInt(arr[idx+1])>0) arr[idx+1] = (parseInt(arr[idx+1])-1).toString();
		else{
			arr[idx+1] = (parseInt("1"+arr[idx+1])-1).toString()
			borrow(arr, idx+1);
		}
	};
	for(let i=0; i<n1.length; i++){
		if(n1[i] === "."){ buffer.push("."); continue; }
		let x = parseInt(n1[i]);
		let y = parseInt(n2[i]);
		if(y > x){
			borrow(n1, i);
			x = parseInt("1"+x);
		}
		buffer.push(x - y);
	}
	return Number.SE.normalize((isNegative?"-":"")+(buffer.reverse().join('')));
};


var a = Number.SE("-30000.3");
var b = Number.SE("-123444.8");
console.log(a.add(b).number);