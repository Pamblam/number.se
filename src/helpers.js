
Number.SE.prototype.isNegative = function(){
	return this.number.substr(0,1) === "-";
};

Number.SE.prototype.abs = function(){
	return this.isNegative() ? this.number.substr(1) : this.number;
};