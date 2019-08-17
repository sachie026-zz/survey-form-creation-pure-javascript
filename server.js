//
// /                         serves index.html
// /(js|css)/*               serves static files
// /questions                serves questions
// /options?question=<id>    serves options for a given question
//
var fs = require('fs');
var http = require('http');
var url = require('url');
var path = require('path');
var util = require('util');
var questions = [
  { id: 1, title: 'Your name', type: 'text', mandatory: true, has_options: false },
  { id: 2, title: 'Your email', type: 'email', mandatory: true, has_options: false },
  { id: 3, title: 'Your contact number', type: 'number', mandatory: true, has_options: false },
  { id: 4, title: 'How likely is that you recommend this survey to a friend or a colleague?', type: 'rating', mandatory: true, has_options: false },
  { id: 5, title: 'Overall how satisfied or dissatisfied are you with this survey?', type: 'radio', mandatory: true, has_options: true },
  { id: 6, title: 'Which of the following words would you use to describe our product? Select all that apply', type: 'checkbox', mandatory: true, has_options: true },
  { id: 7, title: 'Do you have any comments or concerns?', type: 'textarea', mandatory: false, has_options: false },
];
var checkboxOptions = [
  { value: 'reliable', label: 'Reliable' },
  { value: 'useful', label: 'Useful' },
  { value: 'unique', label: 'Unique' },
  { value: 'overpriced', label: 'Overpriced' },
  { value: 'impratical', label: 'Impractical' },
  { value: 'ineffective', label: 'Ineffective' },
];
var radioOptions = [
  { value: 'satisfied', label: 'Satisfied' },
  { value: 'somewhat_safisfied', label: 'Somewhat satisfied' },
  { value: 'dissatisfied', label: 'Dissatisfied' },
  { value: 'somewhat_dissafisfied', label: 'Somewhat dissatisfied' },
  { value: 'neither', label: 'Neither satisfied not dissatisfied' }
];

var dir = path.dirname(fs.realpathSync(__filename));

http.createServer(function (req, res) {
  var pathname = url.parse(req.url).pathname;
  var m;
  if (pathname == '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(dir + '/index.html').pipe(res);
    return;
  } else if (m = pathname.match(/^\/(js|css)\//)) {
    var filename = dir + pathname;
    var stats = fs.existsSync(filename) && fs.statSync(filename);
    if (stats && stats.isFile()) {
      res.writeHead(200, {'Content-Type': m[1] === 'js' ? 'application/javascript' : 'text/css'});
      fs.createReadStream(filename).pipe(res);
      return;
    }
  } else if (pathname.match(/^\/questions/)) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(questions));
    res.end();
    return;
  } else if (m = req.url.match(/^\/options\?question\=(.*)/)) {
    if (m[1] === '5' || m[1] === '6') {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(m[1] === '5' ? radioOptions : checkboxOptions));
      res.end();
      return;
    }
  }
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.write('404 Not Found\n');
  res.end();
}).listen(8000, 'localhost');

console.log('server running on port 8000');
