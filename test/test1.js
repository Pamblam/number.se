
const expect = require('chai').expect;
const oops = require("../number.se.js")

describe('Testing Addition', ()=>{
	it('Two positive numbers', ()=>{
		var a = Number.SE("3.175");
		var b = Number.SE("4.964");
		expect(a.add(b).number==='8.139').to.be.true;
	});
	it('Two positive numbers', ()=>{
		var a = Number.SE("9.175");
		var b = Number.SE("4.729");
		expect(a.add(b).number==='13.904').to.be.true;
	});
	it('One positive, one negative number', ()=>{
		var a = Number.SE("-367.3");
		var b = Number.SE("3.5");
		expect(a.add(b).number==='-363.8').to.be.true;
	});
	it('One positive, one negative number', ()=>{
		var a = Number.SE("-7.3006");
		var b = Number.SE("35.5");
		expect(a.add(b).number==='28.1994').to.be.true;
	});
	it('One positive, one negative number', ()=>{
		var a = Number.SE("-7.3006");
		var b = Number.SE("7.3006");
		expect(a.add(b).number==='0').to.be.true;
	});
	it('Two negative numbers', ()=>{
		var a = Number.SE("-9.175");
		var b = Number.SE("-4.729");
		expect(a.add(b).number==='-13.904').to.be.true;
	});
});