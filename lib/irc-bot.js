var sys=require("sys");
var irc=require("irc");
var style=require("colored");
var http=require("http");
var dns=require("dns");
var utils=require("utils");
require("underscore");
var irc_bot = exports;
var bot=irc_bot.bot=function()
{
	this.client=new irc.Client();
	self=this;
	this.client.connect();
	this.client.addListener('Data',function(data){
		self.parseMessage(data);
	})
	this.users=[];
}
bot.prototype.parseMessage=function(data){
	try{
		var obj=JSON.parse(data);
		//console.log(data);
		if(obj.hostname && obj.hostname!="")
		{
			this.addUser(obj);
		}
	}
	catch(e){
		sys.puts(e);
	}

}
bot.prototype.addUser=function(obj){
	var name=obj.content.user || obj.content.from;
	if(this.users[name])
	{
	//Update IP stuff
		//this.getIP(name);
		if(this.users[name].loc){
			console.log(name+" is in "+this.users[name].loc);
		}
		else
		{
		this.getIP(name);	
		}
	}
	else
	{

		this.users[name]={};
		this.users[name].name=name;
		this.users[name].lat=null;
		this.users[name].lng=null;
		this.users[name].loc=null;
		this.users[name].host=obj.hostname;
		this.users[name].ip=null;
		this.users[name].messages=0;
		this.getIP(name);
	}

}
bot.prototype.getIP=function(name){
	if(this.users[name].host.match(/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/))
	{
	self.users[name].ip=this.users[name].host.match(/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/)[1];	
	self.getLoc(name);
	}
	else
	{
		dns.resolve(this.users[name].host, function (err, addresses) {
		if (!err && addresses) {
			self.users[name].ip=addresses;
			self.getLoc(name);
			}
		else
		{
			console.log('Could Not Get IP Address for '+name+': '+err);
		}
		});	
	}


}
bot.prototype.getLoc=function(name){
	console.log("Retrieving "+name+" location");
	var client = http.createClient(80, 'vietmap.info');
	var request = client.request('GET', '/geoip/api/locate.php?ip=' + 	this.users[name].ip, {'host': 'vietmap.info'});
	request.addListener('response', function (response) {
		response.setEncoding('utf8');
		var body = '';
		response.addListener('data', function (chunk) {
			body += chunk;
		});
		response.addListener('end', function () {
			body = body.replace(/(place\(|\);$)/g, '');
			try{
				var json = JSON.parse(body);
				if (json.lat && json.lng && json.lat !== '-34.5875') {
					self.users[name].lat=json.lat;
					self.users[name].lng=json.lng;
					self.users[name].loc=json.city+", " || "";
					self.users[name].loc+=json.country;
					if(self.users[name].loc){
						console.log(name+" is in "+self.users[name].loc);
					}
				}
			}catch(e){
				console.log(e);
			}

		});
	});
	request.end();
}
bot.prototype.console=function(input){
	this.client.input(input);
}