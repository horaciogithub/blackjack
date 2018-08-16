/* ▬▬▬▬▬▬▬▬▬▬▬ */
/*   OBJETOS   */
/* ▬▬▬▬▬▬▬▬▬▬▬ */

// Jugador
var player = {
	name: 'player',
	coins : 2000,
	amountBet : 0,
	bet: false,
	hand: [],
	points: 0,

	betCoin: function (coins){
		this.coins -= coins;
		this.amountBet+=coins;
	},

	resetAmBet: function(){
		this.amountBet = 0;
	},

	resetPoints: function(){
		this.points = 0;
	},

	resetHand: function(){
		this.hand = [];
	},

	win: function(){
		this.coins += this.amountBet*2;
		this.amountBet = 0;
	},

	lose: function(coins){
		this.coins -= coins;
		this.amountBet = 0;
	},
}

// Oponente
var croupier = {
	name: 'oponent',
	hand: [],
	points: 0,

	resetPoints: function(){
		this.points = 0;
	},

	resetHand: function(){
		this.hand = [];
	},
}

/* ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ */
/*   GENERAL FUNCTIONS   */
/* ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ */

// Crea las barajas y las reparte
function setCards(){
	var palo = ['Picas','Corazones','Treboles','Diamantes'];
	var barajas = [];

	//  Creamos las barajas
	for(var i = 0; i < palo.length; i++){
		for(var j = 1; j <= 12; j++){
			barajas[barajas.length] = {palo:palo[i],valor:j};
		}
	}

	/*asigna primera carta al azar*/
	var baraja = barajas[parseInt(Math.random()*48)];

	return baraja;
}


// Imprimir cartas
function mostrarCartas(player, clase) {
	
	for (var i = 0; i < player.hand.length; i++) {
		// Rutas de las cartas
		var ruta = "images/"+player.hand[i].palo+"/"+player.hand[i].valor+""+player.hand[i].palo+".png";
		
		// Muestra la imagen de la carta en pantalla
		$(clase+(i+1)).attr('src',ruta);

		// Muestra el texto alternativo de  imagen
		$(clase+(i+1)).attr('alt',(clase.substring(1))+(i+1));
	}
}

function total(player){
	var total = 0;
	
	for (var i = 0; i < player.hand.length; i++) {
		// Truncamos los valores de las cartas que sean mayores de 10
		if (player.hand[i].valor > 10) {
			player.hand[i].valor = 10;
		}

		// Suma de valores de las cartas
		total += player.hand[i].valor;
	}
	return total;
}

// Pedir carta nueva
function cartaNueva(player,clase,count){
	// Ultima posición del array
	pos = player.hand.length;

	if (player.points < 21) {
		player.hand[pos-1] = setCards();

	 	// Rutas de las cartas
	 	var ruta = "images/"+player.hand[pos-1].palo+"/"+player.hand[pos-1].valor+""+player.hand[pos-1].palo+".png";
		
		// Muestra las cartas en pantalla
	 	$(clase+(pos+count)).attr('src',ruta);
	 	player.points += player.hand[pos-1].valor;
	 	
	}
	
	// Muestra los puntos de las cartas
	if (player.name === 'player') {
		$('#valor').html(player.points);
	}
}

// Aumentar apuesta
function apostar(coins){
	if (player.coins > 0 && (player.coins-coins) >= 0 && !(player.bet== true)) {
		player.betCoin(coins);
		console.log("apu1 " + coins);
		console.log("amount " + player.amountBet);
		console.log("******");

		// Actualiza el saldo
		$('#total').html(player.coins);
			
		// Actualiza la apuesta
		$('#amountBet').html(player.amountBet);

		// Muestra botón de trato
		$('.deal').fadeIn(1000);
	}else{
		switch (coins){
			case 1:
				$('#cel1').css('display','none');
			break;
			case 10:
				$('#cel10').css('display','none');
			break;
			case 100:
				$('#cel100').css('display','none');
			break;
			case 500:
				$('#cel500').css('display','none');
			break;
		};
	}
}

// Apuestas
$(document).ready(function(){
	// Apuesta 1 dollar
	$('#coin1').on('click', function(){
		apostar(1);
	});

	// Apuesta 10 dollares
	$('#coin10').on('click', function(){
		apostar(10);
	});

	// Apuesta 100 dollares
	$('#coin100').on('click', function(){
		apostar(100);
	});

	var c = 0;
	// Apuesta 500 dollares
	$('#coin500').on('click', function(){
		apostar(500);
		c++;
		console.log(c+" evento");
	});
});

// Comprueba si hay blackjack
function isBlackjack(points){
	if (points == 21) {
		return true;
	}
}

// Comprueba que ha ganado

function isWinner(){
	var gana = false;

	if(player.points <= 21){
		gana = true;

		if (croupier.points <= 21 && player.points > croupier.points) {
			gana = true;
		}else{
			gana = false;
		}

	}else{
		gana = false;
	}
	return gana;
}

// Juego función principal
function game(){

	// Vaciamos la mano
	player.resetHand();

	// Reseteamos la cantidad apostada
	player.resetAmBet();
	console.log("saldo"+player.coins);
	console.log("apuesta"+player.amountBet);
	console.log("-----------");
	
	// Ocultar botones de juego al reiniciar 
	$('.hit').fadeOut();
	$('.stand').fadeOut();

	// Resetea los puntos de las cartas
	player.resetPoints();
	croupier.resetPoints();

	// Imprime saldo inicial
	$('#total').html(player.coins);

	// Imprime apuesta inicial
	$('#amountBet').html(player.amountBet);

	// Empieza el juego
	$('#bet').on('click', function(){

		// Ocultar boton apostar
		$('.deal').fadeOut(500);

		player.bet = true;

		// Asigna las cartas al jugador
		player.hand[0] = setCards();
		player.hand[1] = setCards();

		// Asigna las cartas al croupier
		croupier.hand[0] = setCards();
		croupier.hand[1] = setCards();

		// Imprimir cartas
		mostrarCartas(player,".playerCard");
		mostrarCartas(croupier,".croupCard");
		
		// Suma de valores de las cartas iniciales jugador
		player.points = total(player,player.points);
		
		// Suma de valores de las cartas iniciales croupier
		croupier.points = total(croupier,croupier.points);
		console.log("crupier =>"+croupier.points);

		if (isBlackjack(player.points)) {

			// Mostrar mensaje blackjack
			$('#resMessa').html("BlackJack!");
			$('#cash').html("$"+(player.amountBet*2));
			$('#result').css('display','block');
			
			$('#result').on('click',function(){
				$('#result').css('display','none');
				// Suma al saldo lo ganado
				player.coins+=(player.amountBet*2);

				// Reinicia el valor de la apuesta
				player.amountBet = 0;

				// Imprime nuevo saldo
				$('#total').html(player.coins);
				// Inicia el juego
				game();
			});
		}

		if (isBlackjack(croupier.points)) {
			console.log('croupier blackjack');
		}

		// Mostrar botones de juego
		$('.hit').fadeIn(3000);
		$('.stand').fadeIn(3000);

		var count=1;
		$('#hit').on('click',function(){
			// Pedir carta jugador
			cartaNueva(player,".playerCard",count);

			// Pedir carta croupier
			cartaNueva(croupier,".croupCard",count);
			console.log(croupier.points);
			count++;
		});
		
		// Muestra los puntos de las cartas
		$('#valor').html(player.points);
		$('.game-table div:first-child').css('display','block');
	});
}

$(document).ready(function(){

	// Inicia el juego
	game();

	// Mostrar
	$('#stand').on('click', function(){
		player.bet = false;

		// Gana
		if (isWinner()) {

			// Mostrar mensaje ganas y cantidad ganada
			$('#cash').html("$"+(player.amountBet*2));
			$('#result').css('display','block');
			
			$('#result').on('click',function(){
				$('#result').css('display','none');
				
				player.win();

				// Imprime nuevo saldo
				$('#total').html(player.coins);

				// Reinicia el juego
				game();
			});

		// Empate
		}else if (player.points == croupier.points && player.points <= 21) {
			// console.log("Empate");

		// Pierde
		}else{

			// // Mostrar mensaje pierdes 
			// $('#resMessa').html("You lose");
			// $('#cash').html("-$"+player.amountBet);
			// $('#result').css('display','block');
			
			// $('#result').on('click',function(){
			// 	$('#result').css('display','none');
			// 	// Resta a la apuesta lo perdido
			// 	player.lose();

			// 	// Resetea apuesta
			// 	// $('#amountBet').html(player.amountBet);
				
			// 	// Reinicia el juego
			// 	game();
			// });
		}
	});
});