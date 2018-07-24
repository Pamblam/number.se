/**
 * number.se - v1.0.70
 * Arithmetic library that uses string-encoded numbers to hanlde values much larger than Javascript's max safe integer
 * @author Rob Parham
 * @website http://pamblam.github.io/number.se/
 * @license Apache-2.0
 */


Number.SE = function(number){
	if(!(this instanceof Number.SE)) return new Number.SE(number);
	this.number = Number.SE.normalize(number);
};

Number.SE.version = '1.0.70';

Number.SE.precision = 1000;

Number.SE.fromENotation = function (n) {
	var n = n.toString();
	n = n.toUpperCase();
	if (!~n.indexOf('E')) return n;
	var p = n.split('E');
	var right = true;
	var sign = p[1].substr(0, 1);
	if (sign === "-") right = false;
	if (sign === "-" || sign === "+") p[1] = p[1].substr(1);
	var places = Number(p[1]);
	var val = p[0];
	if (!~val.indexOf(".")) val += ".";
	while (places--) {
		var pos = val.indexOf(".");
		val = val.replace(/\./g, '');
		if (right) {
			if (val.length === pos) val += "0";
			pos++;
		} else {
			if (pos === 0) val = "0" + val;
			else pos--;
		}
		val = val.substr(0, pos) + "." + val.substr(pos);
	}
	return val;
};

Number.SE.normalize = function(number){
	if(!number) number = 0;
	if(typeof number !== "string" && typeof number !== "number" && !(number instanceof Number.SE)){
		throw new Error("SE Contrstructor requires a number or string");
	}
	const trimTrailingZeroes = n=> ~n.indexOf(".")&&(n.substr(-1)==="0"||n.substr(-1)===".")?trimTrailingZeroes(n.substr(0,n.length-1)):n;
	const trimLeadingZeroes = n=> n.substr(0,1)==="0"?trimLeadingZeroes(n.substr(1)):n;
	var n = typeof number === "string" ? number : number instanceof Number.SE ? number.number : number.toString();
	n = n.trim();
	if(~n.toUpperCase().indexOf("E")) n = Number.SE.fromENotation(n);
	if(n.substr(-1) === ".") n = n.substr(0, n.length-1);
	if(!/^[-+]?([0-9]*\.[0-9]+|[0-9]+)$/.test(n)){
		console.log("n", n);
		throw new Error("SE Contrstructor requires a valid numeric string");
	}
	if(n.substr(0,1) === "+") n = n.substr(1);
	var isNegative = n.substr(0,1) === "-";
	if(isNegative) n = n.substr(1);
	n = trimTrailingZeroes(trimLeadingZeroes(n));
	if(""===n) isNegative=false;
	return n ? isNegative ? "-"+n : n : "0";
};

Number.SE.max = function(){
	var args = Array.from(arguments);
	if(args.length === 1){
		return args[0] instanceof Number.SE ? args[0] : Number.SE(args[0]);
	}else if(args.length > 2){
		var max = 0;
		for(var i=0; i<args.length; i++) max = Number.SE.max(max, args[i]);
		return max;
	}else{
		var number1 = args[0];
		var number2 = args[1];
		if(!(number1 instanceof Number.SE)) number1 = new Number.SE(number1);
		if(!(number2 instanceof Number.SE)) number2 = new Number.SE(number2);
		if(number1.isNegative() && !number2.isNegative()) return number2;
		if(!number1.isNegative() && number2.isNegative()) return number1;
		return number1.greaterThan(number2) ? number1 : number2;
	}
};

Number.SE.min = function(){
	var args = Array.from(arguments);
	if(args.length === 1){
		return args[0] instanceof Number.SE ? args[0] : Number.SE(args[0]);
	}else if(args.length > 2){
		var min = 0;
		for(var i=0; i<args.length; i++) min = Number.SE.min(min, args[i]);
		return min;
	}else{
		var number1 = args[0];
		var number2 = args[1];
		if(!(number1 instanceof Number.SE)) number1 = new Number.SE(number1);
		if(!(number2 instanceof Number.SE)) number2 = new Number.SE(number2);
		if(number1.isNegative() && !number2.isNegative()) return number1;
		if(!number1.isNegative() && number2.isNegative()) return number2;
		return number1.greaterThan(number2) ? number2 : number1;
	}
};

Number.SE.alignDecimals = function(number1, number2){
	number1 = new Number.SE(number1);
	number2 = new Number.SE(number2);
	var is1neg = number1.isNegative();
	var is2neg = number2.isNegative();
	number1.number = number1.abs().number; 
	number2.number = number2.abs().number;
	const getDecimalPosit = n=>~n.number.indexOf(".") ? n.number.indexOf(".") : n.number.length;
	const addLeadingZeros = (n, dif)=>"0".repeat(dif)+n.number;
	const addTrailingZeros = (n, dif)=>n.number+"0".repeat(dif);
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

Number.SE.greatestCommonDivisor = function(a, b){
	a = Number.SE(a);
	b = Number.SE(b);
	var y = Number.SE(0), x = Number.SE(0), temp;
	if (a.greaterThan(b)) { x = a; y = b; } 
	else { x = b; y = a; }
	while (x.mod(y).number !== "0") {
		temp = x;
		x = y;
		y = temp.mod(x);
	}
	return y;
};

Number.SE.toFraction = function (number) {
	number = Number.SE(number).number;
	if (!~number.indexOf(".")) return {numerator: number, denominator: "1"};
	var n = number.split(".");
	var denominator = "1"+("0".repeat(n[1].length));
	var numerator = Number.SE(n[0]?n[0]:0).multiplyBy(denominator).add(n[1]).number;
	var gcd = Number.SE.greatestCommonDivisor(denominator, numerator);
	denominator = Number.SE(denominator).divideBy(gcd);
	numerator = Number.SE(numerator).divideBy(gcd);
	return {numerator: numerator, denominator: denominator};
};

Number.SE.prototype.isNegative = function(){
	return this.number.substr(0,1) === "-";
};

Number.SE.prototype.abs = function(){
	return Number.SE(this.isNegative() ? this.number.substr(1) : this.number);
};

Number.SE.prototype.greaterThan = function(y){
	const trimLeadingZeros = n=>{ while(n.substr(0,1)=="0") n=n.substr(1); return n; }
	const trimTrailingZeros = n=>{ while(n.substr(-1)=="0") n=n.substr(0, n.length-1); return n; }
	var x = this.number;
	y = new Number.SE(y).number;
	if(!~x.indexOf(".")) x+=".";
	if(!~y.indexOf(".")) y+=".";
	x = trimLeadingZeros(trimTrailingZeros(x));
	y = trimLeadingZeros(trimTrailingZeros(y));
	if(x.indexOf(".") > y.indexOf(".")) return true;
	if(y.indexOf(".") > x.indexOf(".")) return false;
	for(var i=0; i<x.length; i++){
		if(!y[i]) return true;
		if(x[i] > y[i]) return true;
		if(x[i] < y[i]) return false;
	}
	return false;
};

Number.SE.prototype.lessThan = function(y){
	if(!(y instanceof Number.SE)) y = new Number.SE(y).number;
	if(y===this.number||this.greaterThan(y)) return false;
	return true;
};

Number.SE.prototype.equals = function(y){
	if(!(y instanceof Number.SE)) y = new Number.SE(y).number;
	return y===this.number;
};

Number.SE.prototype.floor = function(){
	if(!~this.number.indexOf(".")) return Number.SE(this.number);
	var n = this.number.split(".")[0];
	if(!n || n==="-") n=0;
	return Number.SE(n);
};

Number.SE.prototype.mod = function(divisor) {
	return this.subtract(this.divideBy(divisor).floor().multiplyBy(divisor));
};

Number.SE.prototype.negate = function(){
	return this.isNegative() ? this.abs() : Number.SE("-"+this.number);
};

Number.SE.prototype.add = function(number){
	var [n1, n2] = Number.SE.alignDecimals(this.number, number);
	if((n1.isNegative() && !n2.isNegative()) || (!n1.isNegative() && n2.isNegative())){
		var is1neg = n1.isNegative();
		var is2neg = n2.isNegative();
		n1.number = n1.abs().number;
		n2.number = n2.abs().number;
		var largerNumber = n1.greaterThan(n2) ? n1 : n1.lessThan(n2) ? n2 : false;
		var smallerNumber = n1.greaterThan(n2) ? n2 : n1.lessThan(n2) ? n1 : false;
		if(largerNumber === false || smallerNumber === false) return Number.SE("0");
		var isNeg = (largerNumber.number === n1.number && is1neg) || (largerNumber.number === n2.number && is2neg);
		var number = (isNeg ? "-" : "") + largerNumber.subtract(smallerNumber).number;
		return Number.SE(number);
	}
	var isNeg = n1.isNegative() && n2.isNegative();
	if(isNeg){
		n1.number = n1.abs().number;
		n2.number = n2.abs().number;
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
	var number = number = Number.SE.normalize((isNeg ? "-" : "") + buffer.reverse().join(''));
	return Number.SE(number);
};

Number.SE.prototype.subtract = function(number){
	var [n1, n2] = Number.SE.alignDecimals(this.number, number);
	if(n1.isNegative() && !n2.isNegative()){
		n1.number = n1.abs().number;
		return Number.SE("-"+n1.add(n2).number);
	}else if(!n1.isNegative() && n2.isNegative()){
		n2.number = n2.abs().number;
		return Number.SE(n1.add(n2).number);
	}else if(n2.isNegative() && n1.isNegative()){
		n1.number = n1.abs().number;
		n2.number = n2.abs().number;
		var isNegative = n1.number > n2.number;
		if(!isNegative){
			var temp = n1;
			n1 = n2;
			n2 = temp;
		}
	}else{
		var isNegative = n1.number < n2.number;
		if(isNegative){
			var temp = n1;
			n1 = n2;
			n2 = temp;
		}
	}
	n1 = n1.number.split('').reverse();
	n2 = n2.number.split('').reverse();
	var buffer = [];
	const borrow = (arr, idx) => {
		if("."===arr[idx+1]) return borrow(arr, idx+1);
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
	var number = Number.SE.normalize((isNegative?"-":"")+(buffer.reverse().join('')));
	return Number.SE(number);
};

Number.SE.prototype.multiplyBy = function(number){
	var [n1, n2] = Number.SE.alignDecimals(this.number, number);
	var decimalPlaces = n1.number.split('').reverse().indexOf(".");
	if(decimalPlaces < 1) decimalPlaces = 0;
	var a = n1.number.replace(/\./g,'');
	var b = n2.number.replace(/\./g,'');
	var isNegative = false;
	if(a.substr(0,1)==="-"){
		isNegative = !isNegative;
		a = a.substr(1);
	}
	if(b.substr(0,1)==="-"){
		isNegative = !isNegative;
		b = b.substr(1);
	}
	
	a = (""+a).split('').reverse();
	b = (""+b).split('').reverse();
	var result = [];

	for (var i = 0; a[i] >= 0; i++) {
		for (var j = 0; b[j] >= 0; j++) {
			if (!result[i + j]) {
				result[i + j] = 0;
			}
			result[i + j] += a[i] * b[j];
		}
	}

	for (var i = 0; result[i] >= 0; i++) {
		if (result[i] >= 10) {
			if (!result[i + 1]) {
				result[i + 1] = 0;
			}
			result[i + 1] += parseInt(result[i] / 10);
			result[i] %= 10;
		}
	}
	
	if(decimalPlaces) result.splice(decimalPlaces*2, 0, ".");
	if(isNegative) result.push("-");
	
	var number = Number.SE.normalize(result.reverse().join(''));
	return Number.SE(number);
};

Number.SE.prototype.divideBy = function(divisor) {
	var dividend = this.number;
	divisor = new Number.SE(divisor).number;
	var isNegative = false;
	if(dividend.substr(0,1)=="-"){
		isNegative = !isNegative;
		dividend = dividend.substr(1);
	}
	if(divisor.substr(0,1)=="-"){
		isNegative = !isNegative;
		divisor = divisor.substr(1);
	}
	var dvr_dec_places = 0;
	if (divisor.indexOf(".") > -1) {
		var dvr_dec_ar = divisor.split(".");
		dvr_dec_places = dvr_dec_ar[1].length;
		divisor = dvr_dec_ar[0] + "" + dvr_dec_ar[1];
	}
	var dvd_int_places = dividend.length;
	if (dividend.indexOf(".") > -1) {
		var dvd_dec_ar = dividend.split(".");
		dvd_int_places = dvd_dec_ar[0].length;
		dividend = dvd_dec_ar[0] + "" + dvd_dec_ar[1];
	} 
	var dvd_ar = dividend.split("");
	dvd_int_places += dvr_dec_places;
	if (dvd_int_places > dvd_ar.length) {
		while (dvd_ar.length < dvd_int_places) dvd_ar.push("0");
	}
	var digit = "";
	var answer = "";
	var remainder = 0;
	var i = 0;
	var ans_plc = 1;
	var solved = false;
	while (answer.length-dvd_int_places < Number.SE.precision && !solved) {	
		var all_digits_used = false;
		if (i < dvd_ar.length) {
			digit = dvd_ar[i].toString();
		} else {
			digit = "0";
			dvd_ar.push("0");
			all_digits_used = true;
		}
		answer = answer + Number.SE(Number.SE(digit).add(Number.SE(remainder).multiplyBy(10)).floor().number/divisor).floor().number;
		remainder = (Number(digit) + (remainder * 10)) % divisor;
		solved = all_digits_used && remainder == 0;
		ans_plc++;
		i++;
	}
	var num = answer.substr(0, dvd_int_places) + "." + answer.substr(dvd_int_places, answer.length);
	num = Number.SE.normalize(num);
	if(isNegative) num = "-"+num;
	return Number.SE(num);
};

Number.SE.prototype.powerOf = function(n){
	// https://www.wikihow.com/Solve-Decimal-Exponents
	// https://www.quora.com/How-do-we-solve-decimal-exponents
	// need to figure out roots first
};

Number.SE.prototype.factorial = function(){
	// https://stackoverflow.com/questions/15454183/how-to-make-a-function-that-computes-the-factorial-for-numbers-with-decimals
	// need sqrt, sin, pow first
};

// Get the nth power of the number as long as the exponenet is a positive integer
Number.SE.prototype.powInt = function(exp){
	exp = Number.SE(exp);
	if(exp.number !== exp.floor().number) throw "Exponent in powInt() must be an integer.";
	if(exp.isNegative()) throw "Exponent in powInt() must be positive.";
	if(Number.SE(0).greaterThan(exp)) return Number.SE(1).divideBy(this.powInt(exp.negate()));
	var ans = Number.SE(1);
	while(exp.greaterThan(Number.SE(0))){
		ans = ans.multiplyBy(this);
		exp = exp.subtract(1);
	}
	return ans;
};

Number.SE.prototype.nthRoot = function(n){
	n = Number.SE(n);
	var x = Number.SE(1);
	for(var i=0; i<Number.SE.precision; i++){
		x = Number.SE(1).multiplyBy(n.subtract(1).multiplyBy(x).add(this.divideBy(x.powInt(n.subtract(1)))));
	}
	return x;
};