function getIP(host){
	dns.resolve(host, function (err, addresses) {
	if (!err && addresses) {
		return addresses;
		}
	});
}
function getPosition(ip){
	var client = http.createClient(80, 'vietmap.info');
	var request = client.request('GET', '/geoip/api/locate.php?ip=' + 	ip, {'host': 'vietmap.info'});
	request.addListener('response', function (response) {
		response.setEncoding('utf8');
		var body = '';
		response.addListener('data', function (chunk) {
			body += chunk;
		});
		response.addListener('end', function () {
			body = body.replace(/(place\(|\);$)/g, '');
			var output={
				'lat':null,
				'lng':null,
				'city':null,
				'country':null,
				'status':null,
				'error':null
			};
			try{
				var json = JSON.parse(body);
				if (json.lat && json.lng && json.lat !== '-34.5875') {
					return output;
				}
			}catch(e){
				console.log(e);
				return output;
			}

		});
	});
	request.end();
}