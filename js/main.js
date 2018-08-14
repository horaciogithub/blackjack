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
		this.coins = this.coins-coins;
		this.amountBet= this.amountBet+coins;
	},
}

// Oponente
var croupier = {
	name: 'oponent',
	hand: [],
	points: 0,
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

function total(player,total){
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
	
	if (player.name === 'player') {
		$('#valor').html(player.points);
	}
}

// Aumentar apuesta
function apostar(coins){
	if (player.coins > 0 && (player.coins-coins) >= 0 && !(player.bet== true)) {
		player.betCoin(coins);

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

$(document).ready(function(){

	// Imprime saldo inicial
	$('#total').html(player.coins);

	// Imprime apuesta inicial
	$('#amountBet').html(player.amountBet);

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

	// Apuesta 500 dollares
	$('#coin500').on('click', function(){
		apostar(500);
	});

	// Empieza el juego
	$('#bet').on('click', function(){
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
		console.log(croupier.points);

		
		var count=1;
		$('#hit').on('click',function(){
			// Pedir carta jugador
			cartaNueva(player,".playerCard",count);

			// Pedir carta croupier
			cartaNueva(croupier,".croupCard",count);
			console.log(croupier.points);
			count++;
		});
		
		$('#valor').html(player.points);
		$('.game-table div:first-child').css('display','block');

		// Ocultar boton apostar
		$('.deal').fadeOut(500);

		// Mostrar botones de juego
		$('.hit').fadeIn(3000);
		$('.stand').fadeIn(3000);
	});

	// Mostrar
	$('#stand').on('click', function(){
		player.bet = false;

		// Gana
		if (player.points > croupier.points && player.points <= 21) {

			// Mostrar mensaje ganas y cantidad ganada
			$('#cash').html("$"+player.amountBet);
			$('#result').css('display','block');
			
			$('#result').on('click',function(){
				$('#result').css('display','none');
				// Suma al saldo lo ganado
				player.coins+=player.amountBet;

				// Imprime nuevo saldo
				$('#total').html(player.coins);
			});

		// Empate
		}else if (player.points == croupier.points && player.points <= 21) {
			console.log("Empate");

		// Pierde
		}else{

			// Mostrar mensaje pierdes 
			$('#resMessa').html("You lose");
			$('#cash').html("-$"+player.amountBet);
			$('#result').css('display','block');
			
			$('#result').on('click',function(){
				$('#result').css('display','none');
				// Resta a la apuesta lo perdido
				player.amountBet = 0;

				// Resetea apuesta
				$('#amountBet').html(player.amountBet);
			});
		}
	});
});