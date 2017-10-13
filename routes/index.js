const express = require('express');
const router = express.Router();
const spawn = require('child_process').spawn;


const BINARY_URL = process.env['CHESS_ENGINE_LOC'] || '/app/rust-chess';

/* GET home page. */
router.post('/', function(req, res, next) {
  	let engine = spawn(BINARY_URL);
  	let engineMove = null;
  	let responses = null;

  	engine.stdin.write('bbs-ez ' + req.body.moves.join(' '));
  	engine.stdin.end();

  	engine.stdout.on('data', function(data) {
  		let txt = data.toString('utf8');

  		let parts = txt.match(/bestmove (\w{4,5})/);
  		if (parts) {
  			engineMove = parts[1];
  		}

  		let parts2 = txt.match(/legalmoves \[(.*)\]/);
  		if (parts2) {
  			responses = parts2[1].split(',').map((move) => move.trim());
  		}
  	});

  	engine.on('close', function() {
  		return res.json({
  			engineMove: engineMove,
  			responses: responses,
  		});
  	});
});

module.exports = router;
