
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
		this.number = (isNeg ? "-" : "") + largerNumber.subtract(smallerNumber).number;
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
	if(n1.isNegative() && !n2.isNegative()){
		n1.number = n1.abs();
		this.number = "-"+n1.add(n2).number;
		return this;
	}else if(!n1.isNegative() && n2.isNegative()){
		n2.number = n2.abs();
		this.number = n1.add(n2).number;
		return this;
	}else if(n2.isNegative() && n1.isNegative()){
		n1.number = n1.abs();
		n2.number = n2.abs();
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
	this.number = Number.SE.normalize((isNegative?"-":"")+(buffer.reverse().join('')));
	return this;
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
	
	this.number = Number.SE.normalize(result.reverse().join(''));
	return this;
};

Number.SE.prototype.divideBy = function(divisor) {
	var dividend = this.number;
	if(!(divisor instanceof Number.SE)) divisor = new Number.SE(divisor).number;
	
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
		answer = answer + Math.floor((Number(digit) + (remainder * 10)) / divisor);
		remainder = (Number(digit) + (remainder * 10)) % divisor;
		var solved = all_digits_used && remainder == 0;
		ans_plc++;
		i++;
	}
	this.number = answer.substr(0, dvd_int_places) + "." + answer.substr(dvd_int_places, answer.length);
	this.number = Number.SE.normalize(this.number);
	if(isNegative) this.number = "-"+this.number;
	return this;
};