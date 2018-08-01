
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

Number.SE.prototype.exp = function(){
	var n = Number.SE.E().powerOf(this);
	n.number = n.number.substr(0, Number.SE.PRECISION);
	return n;
};

Number.SE.gamma = function(x) {
    var p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
        771.32342877765313, -176.61502916214059, 12.507343278686905,
        -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    var g = 7;
    if (x < 0.5) {
		console.log("x < .5");
		var piX = Math.PI * x;
		console.log("piX ", piX);
		var pixSin = Math.sin(piX);
		console.log("pixSin ", pixSin);
		var oneLessX = 1 - x;
		console.log("oneLessX ", oneLessX);
		var gamma1Lessx = Number.SE.gamma(oneLessX);
		console.log("gamma1Lessx ", gamma1Lessx);
		var denom = pixSin * gamma1Lessx;
		console.log("denom ", denom);
        return Math.PI / denom;
    }
	return "farts";
    x -= 1;
    var a = p[0];
    var t = x + g + 0.5;
	console.log("t", t);
    for (var i = 1; i < p.length; i++) {
        a += p[i] / (x + i);
		console.log("a", a);
    }
    return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
}

Number.SE.prototype.gamma = function(){
    var p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
        771.32342877765313, -176.61502916214059, 12.507343278686905,
        -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
    ];
	var x = this;
    var g = Number.SE(7);
    if (x.lessThan(Number.SE(0.5))) {
		console.log("x < .5");
		var piX = Number.SE.Pi().multiplyBy(x);
		console.log("piX ", piX.number);
		var pixSin = piX.sin();
		console.log("pixSin ", pixSin.number);
		var oneLessX = Number.SE(1).subtract(x);
		console.log("oneLessX ", oneLessX.number);
		var gamma1Lessx = oneLessX.gamma();
		console.log("gamma1Lessx ", gamma1Lessx.number);
		var denom = pixSin.multiplyBy(gamma1Lessx)
		console.log("denom ", denom.number);
        return Number.SE.Pi().divideBy(denom);
    }
	return "farts";
	x = x.subtract(1);
    var a = Number.SE(p[0]);
	var t = x.add(g).add(0.5);
	console.log("t", t.number);
    for (var i = 1; i < p.length; i++) {
		a = a.add(Number.SE(p[i])).divideBy(x.add(i));
		console.log("a", a.number);
    }
	return Number.SE(2).multiplyBy(Number.SE.Pi()).nthRoot(2).multiplyBy(t.powerOf(x.add(0.5))).multiplyBy(t.negate().exp()).multiplyBy(a);
    //return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
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

Number.SE.prototype.tan = function(){
	return this.sin().divideBy(this.cos());
};

Number.SE.prototype.cos = function(){
	var cos = Number.SE(1); var add = false; var lastval = cos;
	for(i=2;1;i+=2){
		var num = this.powerOf(i);
		var denom = Number.SE(i).factorial();
		var quotient = num.divideBy(denom);
		var method = add ? "add" : "subtract";
		cos = cos[method](quotient);
		if(lastval.equals(cos)) break;
		lastval = cos;
		add = !add;
	}
	return cos;
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
		console.log(sin.number);
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