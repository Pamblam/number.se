
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

// this is not working
Number.SE.prototype.nthRoot = function(n){
	n = Number.SE(n);
	var x = Number.SE(1);
	for(var i=0; i<Number.SE.precision; i++){
		x = Number.SE(1).multiplyBy(n.subtract(1).multiplyBy(x).add(this.divideBy(x.powInt(n.subtract(1)))));
	}
	return x;
};