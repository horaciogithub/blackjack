var jugador = {};
var croupier = {};
var palo = ['picas','corazones','trevol','diamantes'];
var baraja = [];

//  Creamos las barajas
for(var i = 0; i < palo.length; i++){
	for(var j = 1; j <= 12; j++){
		baraja[baraja.length] = {palo:palo[i],valor:j};
	}
}

console.log(baraja[parseInt(Math.random()*48)]);/*asigna una carta al azar*/

// for(var k = 0; k < baraja.length; k++){
// 	console.log(baraja[parseInt(Math.random()*12)]);
// }