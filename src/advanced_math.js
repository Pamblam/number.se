
// Get the power of a any number
Number.SE.prototype.powerOf = function(exp){
	exp = Number.SE(exp);
	if(exp.isNegative()){
		// it's a negative number
		return Number.SE(1).divideBy(this.powerOf(exp.abs()))
	}else if(exp.isInt()){
		// it's a positive integer
		exp = Number.SE(exp);
		if(Number.SE(0).greaterThan(exp)) return Number.SE(1).divideBy(this.powerOf(exp.negate()));
		var ans = Number.SE(1);
		while(exp.greaterThan(Number.SE(0))){
			ans = ans.multiplyBy(this);
			exp = exp.subtract(1);
		}
		return ans;
	}else{
		// it's a decimal
		var fraction = Number.SE.toFraction(exp);
		var multiplier = fraction.numerator;
		var root = this.nthRoot(fraction.denominator);
		return root.powerOf(multiplier);
	}
};

Number.SE.prototype.factorial = function(){
	if(!this.isInt()){
		throw new Error("factorialInt() can only calucalte the factorial of an integer");
		// https://stackoverflow.com/questions/15454183/how-to-make-a-function-that-computes-the-factorial-for-numbers-with-decimals
		// need sqrt, sin, pow first
	}else{
		var product = this, multiplicand = this;
		while(multiplicand.greaterThan(Number.SE(1))){
			multiplicand = multiplicand.subtract(1);
			product = product.multiplyBy(multiplicand);
		}
		return product;
	}
};

Number.SE.prototype.sin = function(){
	var sin = this; var add = false; var lastval = sin;
	for(i=1;1;i+=2){
		if(i===1) continue;
		var num = this.powerOf(i);
		var denom = Number.SE(i).factorial();
		var quotient = num.divideBy(denom);
		var method = add ? "add" : "subtract";
		sin = sin[method](quotient);
		if(lastval.equals(sin)) break;
		lastval = sin;
		add = !add;
	}
	return sin;
};

// get the nth root of a number
Number.SE.prototype.nthRoot = function(n){
	n = Number.SE(n);
	var x = Number.SE(1);
	var oneNth = Number.SE(1).divideBy(n);
	var nLessOne = Number.SE(n).subtract(1);
	var lastval = x;
	for(var i=0; i<Number.SE.PRECISION; i++){
		var pow = x.powerOf(nLessOne).toNumber();
		var d = this.divideBy(pow).toNumber();
		var nLessOneTimesX = nLessOne.multiplyBy(x);
		var nLessOneTimesXPlusD = nLessOneTimesX.add(d).toNumber();
		x = oneNth.multiplyBy(nLessOneTimesXPlusD);
		if(lastval.equals(x)) break;
		lastval = x;
	}
	return x;
};