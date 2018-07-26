
const expect = require('chai').expect;
require("../number.se.js")

Number.SE.PRECISION	= 1000;

describe('Testing Constructor', ()=>{
	it('Constructor as Number', ()=>{
		expect(Number.SE(8.139).number==='8.139').to.be.true;
	});
	it('Constructor as Number.SE', ()=>{
		expect(Number.SE(Number.SE(8.139)).number==='8.139').to.be.true;
	});
	it('Constructor as object', ()=>{
		var pass = false;
		try{
			Number.SE({});
		}catch(e){
			pass = true;
		}
		expect(pass).to.be.true;
	});
	it('Constructor as non-numeric string', ()=>{
		var pass = false;
		try{
			Number.SE("abc");
		}catch(e){
			pass = true;
		}
		expect(pass).to.be.true;
	});
	it('Constructor with explicitly positive number', ()=>{
		expect(Number.SE("+8.139").number==='8.139').to.be.true;
	});
	it('Constructor with explicitly negative zero', ()=>{
		expect(Number.SE("-0").number==='0').to.be.true;
	});
});

describe('Testing min and max', ()=>{
	it('Many args max test', ()=>{
		expect(Number.SE.max(Number.SE(32), "-3.76", 999).number==='999').to.be.true;
	});
	it('Single arg max test', ()=>{
		expect(Number.SE.max("-3.76").number==='-3.76').to.be.true;
	});
	it('Single arg SE max test', ()=>{
		expect(Number.SE.max(Number.SE(32)).number==='32').to.be.true;
	});
	it('Two args max test', ()=>{
		expect(Number.SE.max(Number.SE(32), "3.76").number==='32').to.be.true;
	});
	it('Two args max test with a negative', ()=>{
		expect(Number.SE.max(Number.SE(-32), "3.76").number==='3.76').to.be.true;
	});
	it('Many args min test', ()=>{
		expect(Number.SE.min(Number.SE(32), "-3.76", 999).number==='-3.76').to.be.true;
	});
	it('Single arg min test', ()=>{
		expect(Number.SE.min("-3.76").number==='-3.76').to.be.true;
	});
	it('Single arg SE min test', ()=>{
		expect(Number.SE.min(Number.SE(32)).number==='32').to.be.true;
	});
	it('Two args min test', ()=>{
		expect(Number.SE.min(Number.SE(32), "3.76").number==='3.76').to.be.true;
	});
	it('Two args min test with a negative', ()=>{
		expect(Number.SE.min(Number.SE(-32), "3.76").number==='-32').to.be.true;
	});
});

describe('Testing decimal alignment', ()=>{
	it('Second value not SE', ()=>{
		var de = Number.SE.alignDecimals(32, 3.29);
		expect(de[0].number==='32.00').to.be.true;
	});
	it('First value SE', ()=>{
		var de = Number.SE.alignDecimals(Number.SE(32), 3.29);
		expect(de[0].number==='32.00').to.be.true;
	});
	it('Second value has decimal', ()=>{
		var de = Number.SE.alignDecimals("-000002.999", 329);
		expect(de[1].number==='329.000').to.be.true;
	});
});

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

describe('Testing Subtraction', ()=>{
	it('One positive, one negative number', ()=>{
		var a = Number.SE("-3.175");
		var b = Number.SE("4.964");
		expect(a.subtract(b).number==='-8.139').to.be.true;
	});
	it('One positive, one negative number', ()=>{
		var a = Number.SE("3.175");
		var b = Number.SE("-4.964");
		expect(a.subtract(b).number==='8.139').to.be.true;
	});
	it('Two negative numbers', ()=>{
		var a = Number.SE("-3.175");
		var b = Number.SE("-4.964");
		expect(a.subtract(b).number==='1.789').to.be.true;
	});
	it('Two positive numbers', ()=>{
		var a = Number.SE("3");
		var b = Number.SE("5");
		expect(a.subtract(b).number==='-2').to.be.true;
	});
	it('Two negative numbers', ()=>{
		var a = Number.SE("-5");
		var b = Number.SE("-3");
		expect(a.subtract(b).number==='-2').to.be.true;
	});
});

describe('Testing Multiplication', ()=>{
	it('One positive, one negative number', ()=>{
		var a = Number.SE("-3.43");
		var b = Number.SE("44.621909");
		expect(a.multiplyBy(b).number==='-153.05314787').to.be.true;
	});
	it('Two negative numbers', ()=>{
		var a = Number.SE("-3");
		var b = Number.SE("-44");
		expect(a.multiplyBy(b).number==='132').to.be.true;
	});
	it('Two positive numbers', ()=>{
		var a = Number.SE("3");
		var b = Number.SE("44");
		expect(a.multiplyBy(b).number==='132').to.be.true;
	});
});

describe('Testing division', ()=>{
	it('One positive, one negative number', ()=>{
		var a = Number.SE(3.1415);
		var b = a.divideBy(-0.789);
		var ans = '-3.9816223067173637515842839036755386565272496831432192648922686945500633713561470215462610899873257287705956907477820025348542458808618504435994930291508238276299112801013941698352344740177439797211660329531051964512040557667934093789607097591888466413181242078580481622306717363751584283903675538656527249683143219264892268694550063371356147021546261089987325728770595690747782002534854245880861850443599493029150823827629911280101394169835234474017743979721166032953105196451204055766793409378960709759188846641318124207858048162230671736375158428390367553865652724968314321926489226869455006337135614702154626108998732572877059569074778200253485424588086185044359949302915082382762991128010139416983523447401774397972116603295310519645120405576679340937896070975918884664131812420785804816223067173637515842839036755386565272496831432192648922686945500633713561470215462610899873257287705956907477820025348542458808618504435994930291508238276299112801013941698352344740177439797211660329531051964512';
		expect(b.number===ans).to.be.true;
	});
	it('Positive decimals', ()=>{
		var a = Number.SE(1234.2123);
		var b = a.divideBy(2.56);
		var ans = '482.1141796875';
		expect(b.number===ans).to.be.true;
	});
	it('Whole numbers', ()=>{
		var a = Number.SE(7);
		var b = a.divideBy(11);
		var ans = '.6363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363';
		expect(b.number===ans).to.be.true;
	});
	it('Large numbers', ()=>{
		var a = Number.SE(1232456);
		var b = a.divideBy(3332345);
		var ans = '.369846459475234407001675996933090661381099496000564167275597214574121226943788833389099868110894880332018443468488406812619941812747479627709615901114680502769071029560264618459373204155031966978209038980057587074567609296156310346017594216685247175787621029635286862554747482628599379716085819445465580544631483234779112006709989511890275466675869395275699244826090935962512885070423380532327835203137730337044933822878483470348958466185223918891951463608960056656798740826655103238110099644544607476116668592237598447939814154896926938837365278805165731639431091318575957771479243595726132798374718103917811631148635570446637427997401229464536234993675624822759948324678267106196987406766106150473615426974097820003631076614216115078120662776513236174525746883951091498629343600377511932287923369278991220896995959301933023141361413659149937956604133125471702359749665775902555107589400257176252758943026607389090865441603435418601615378959861598964092853531071962836981164915397415333646426165358';
		expect(b.number===ans).to.be.true;
	});
	it('Small numbers', ()=>{
		var a = Number.SE(3);
		var b = a.divideBy(4);
		var ans = '.75';
		expect(b.number===ans).to.be.true;
	});
	it('Small numbers', ()=>{
		var a = Number.SE(3);
		var b = a.divideBy(4);
		var ans = '.75';
		expect(b.number===ans).to.be.true;
	});
	it('Evenly Divisible', ()=>{
		var a = Number.SE(1234);
		var b = a.divideBy(2);
		var ans = '617';
		expect(b.number===ans).to.be.true;
	});
});