
Number.SE.prototype.isNegative = function(){
	return this.number.substr(0,1) === "-";
};

Number.SE.prototype.abs = function(){
	return this.isNegative() ? this.number.substr(1) : this.number;
};

Number.SE.prototype.greaterThan = function(y){
	const trimLeadingZeros = n=>{ while(n.substr(0,1)=="0") n=n.substr(1); return n; }
	const trimTrailingZeros = n=>{ while(n.substr(-1)=="0") n=n.substr(0, n.length-1); return n; }
	var x = this.number;
	if(!(y instanceof Number.SE)) y = new Number.SE(y).number;
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