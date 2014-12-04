var Lasertag = (function(){
	var socket = io();
	var socketConnected = false;

	socket.on('hello', function(){
		socketConnected = true;
	});

	var teams = [];
	var players = [];

	var VEST_COLORS = {
		RED: 0,
		BLUE: 1,
		MAGENTA: 2,
		GREEN: 3,
		WHITE: 4
	};

	/**
	 * Color model
	 * @constructor
	 * @param {Number} id - The color id for this color, defaults to VEST_COLORS.RED.
	 * @return {Color} color
	 */
	Color = function(id){
		this.code = id || VEST_COLORS.RED;
		return this;
	};

	/**
	 * Vest model
	 * @constructor
	 * @param {String} name - The name on the front of the vest.
	 * @return {Vest} vest
	 */
	Vest = function(name){
		this.id = 0;
		this.name = name || "A Generic Vest";
		this.color = new Color();
		return this;
	};

	/**
	 * Team model
	 * @constructor
	 * @param {Number} color - The id for this team's color.
	 * @return {Team} team
	 */
	Team = function(name, color){
		this.id = 0;
		this.name = name || "Team";
		this.color = new Color(color);
		return this;
	};

	/**
	 * Player model
	 * @constructor
	 * @param {String} name - Usually the name of the player's vest or username.
	 * @param {Vest} vest - The vest assigned to this player.
	 * @param {Team} team - The team that this player belongs to.
	 * @param {Number} score - The player's score.
	 * @return {Player} player
	 */
	Player = function(name, vest, team, score){
		this.id = 0;
		this.name = name || "Player";
		this.vest = vest || new Vest();
		this.team = team || new Team();
		this.score = score || 0;
		return this;
	};

	var Scoreboard = {
		enabled: false,
		root: $('<html>'),
		players: [],
		teams: [],
		template: (function(){
			$el = $('<!-- FUCK IT JUST DO THIS --><center><div></div></center>').addClass('scoreboard')
			                .append($('<div class="teams"><div class="teams-inner"></div></div><div class="sidebar"></div>'));
			return $el;
		}()),
		enable: function(root){
			Scoreboard.enabled = true;
			Scoreboard.root = $(root);
			if(!Scoreboard.root.find('.scoreboard')[0]){
				$('body').append(Scoreboard.template);
			}
			// make sure scores are up-to-date
			socket.emit('scoreboard:scores', {type: 'all'});
		},
		disable: function(){
			Scoreboard.enabled = false;
			Scoreboard.players = [];
			Scoreboard.teams = [];
			$('.scoreboard').remove();
		},
		toggle: function(){
			Scoreboard.enabled ? Scoreboard.disable() : Scoreboard.enable();
		},
		update: function(players){
			Scoreboard.players = players.sort(function(a,b){return (b.score-a.score)});
			$('li').remove();
			$.each(Scoreboard.teams, function(i,t){
				$teamSection = $('.scoreboard').find('[data-team-id="'+t.id+'"]');
				$.each(Scoreboard.players, function(a,p){
					if(p.team.id === t.id){
						$teamSection.append('<li data-player-id="'+p.id+'">'+p.name+'<span class="score">'+p.score+'</span></li>');
					}
				});
			});
		},
		init: function(d){
			Scoreboard.teams = d.teams;
			Scoreboard.players = d.players.sort(function(a,b){return (b.score-a.score)});
			$.each(Scoreboard.teams, function(i,t){
				$teamSection = $('<div><h1>'+t.name+'</h1></div>').attr('data-team-id', t.id).addClass('team-section').attr('data-color-id', t.color.code);
				$.each(Scoreboard.players, function(a,p){
					if(p.team.id === t.id){
						$teamSection.append('<li data-player-id="'+p.id+'">'+p.name+'<span class="score">'+p.score+'</span></li>');
					}
				});
				$('.teams-inner').append($teamSection);
			});
		}
	};

	socket.on('scoreboard:scores', function(d){
		if(Scoreboard.enabled){
			if(d.type === 'all'){
				Scoreboard.init(d);
			}else{
				Scoreboard.update(d.players);
			}
		}
	});

	var addPlayer = function(player){
		socket.emit('player:new', player);
	}

	return {
		Models: {
			Color: Color,
			Vest: Vest,
			Player: Player,
			Team: Team
		},
		Scoreboard: Scoreboard,
		addPlayer: addPlayer
	};
}());