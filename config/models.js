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

module.exports = {
	Color: Color,
	Vest: Vest,
	Player: Player,
	Team: Team
};