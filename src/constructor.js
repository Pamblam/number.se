
Number.SE = function(number){
	if(!(this instanceof Number.SE)) return new Number.SE(number);
	this.number = Number.SE.normalize(number);
};

Number.SE.version = '{{ VERSION }}';

Number.SE.precision = 1000;

Number.SE.normalize = function(number){
	if(typeof number !== "string" && typeof number !== "number" && !(number instanceof Number.SE)){
		throw new Error("SE Contrstructor requires a number or string");
	}
	const trimTrailingZeroes = n=> ~n.indexOf(".")&&(n.substr(-1)==="0"||n.substr(-1)===".")?trimTrailingZeroes(n.substr(0,n.length-1)):n;
	const trimLeadingZeroes = n=> n.substr(0,1)==="0"?trimLeadingZeroes(n.substr(1)):n;
	var n = typeof number === "string" ? number : number instanceof Number.SE ? number.number : number.toString();
	n = n.trim();
	if(!/^[-+]?([0-9]*\.[0-9]+|[0-9]+)$/.test(n)){
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
		return number1.abs() > number2.abs() ? number1 : number2;
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
		return number1.abs() > number2.abs() ? number2 : number1;
	}
};

Number.SE.alignDecimals = function(number1, number2){
	number1 = new Number.SE(number1);
	number2 = new Number.SE(number2);
	var is1neg = number1.isNegative();
	var is2neg = number2.isNegative();
	number1.number = number1.abs(); 
	number2.number = number2.abs();
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
	return {numerator: numerator, denominator: denominator};
};