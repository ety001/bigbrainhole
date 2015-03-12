exports.res_ajax = function(res, data){
  res.header('Content-Type', 'application/json');
  res.send(JSON.stringify(data));
}