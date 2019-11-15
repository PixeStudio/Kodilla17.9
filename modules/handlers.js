var fs = require('fs');
var formidable = require('formidable');

var lastUploaded = "test.png";

exports.upload = function(request, response) {
    console.log("Rozpoczynam obsługę żądania upload.");
    var form = new formidable.IncomingForm();
    form.parse(request, function(error, fields, files) {
		
		if(fields.title)
			lastUploaded = fields.title + ".png";
		else
			lastUploaded = files.upload.name;
		
		fs.copyFileSync(files.upload.path, './uploaded/'+lastUploaded); //renameSync zwracało błąd "EXDEV: cross-device link not permitted"
		fs.unlinkSync(files.upload.path);
        //fs.renameSync('./uploaded/'+files.upload.name, './uploaded/' + lastUploaded);
		
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("received image:<br/>");
        response.write("<img src='/show' />");
        response.end();
    });
}

exports.welcome = function(request, response) {
    console.log("Rozpoczynam obsługę żądania welcome.");
    fs.readFile('templates/start.html', function(err, html) {
        response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        response.write(html);
        response.end();
    });
}

exports.error = function(request, response) {
    console.log("Nie wiem co robić.");
    response.write("404 :(");
    response.end();
}

exports.show = function(request, response) {
    fs.readFile('./uploaded/' + lastUploaded, "binary", function(error, file) {
        response.writeHead(200, {"Content-Type": "image/png"});
        response.write(file, "binary");
        response.end();
    });
}