
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



