
Number.SE = function(number){
	if(!(this instanceof Number.SE)) return new Number.SE(number);
	this.number = Number.SE.normalize(number);
};

Number.SE.version = '{{ VERSION }}';

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
