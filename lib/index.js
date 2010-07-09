//Main Loading Page.  This is the wargames server only, not the client.
//Required Modules
var sys=require("sys");
//var io=require("socket-io");
var style=require("colored");
//var http=require("http");
var irc_bot=require('./irc-bot');
var bot=new irc_bot.bot();


//input
var stdin=process.openStdin();
stdin.setEncoding('utf8');	
stdin.addListener('data', function (chunk) {
	bot.console(chunk);
});