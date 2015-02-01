var exec = require('child_process').exec;

exports = module.exports = IRSend;

function IRSend () {};

IRSend.prototype.list = function(remote, code, callback) {
  return runIrsend(this._list(remote, code), callback);
};

IRSend.prototype.send_once = function(remote, code, callback) {
  return runIrsend(this._send_once(remote, code), callback);
};

IRSend.prototype.send_start = function(remote, code, callback) {
  return runIrsend(this._send_start(remote, code), callback);
};

IRSend.prototype.send_stop = function(remote, code, callback) {
  return runIrsend(this._send_stop(remote, code), callback);
};

IRSend.prototype.set_transmitters = function(transmitters, callback) {
  return runIrsend(this._set_transmitters(transmitters), callback);
};

IRSend.prototype.simulate = function(code, callback) {
  return runIrsend(this._simulate(code), callback);
};

// Internal methods
IRSend.prototype._list = function(remote, code) {
  if (!remote) remote = '';
  if (!code) code = '';

  return constructParameters('LIST',  parenthesize([remote, code]));
};

IRSend.prototype._send_once = function(remote, code) {
  if (!remote) remote = '';
  if (!code) code = '';

  if (code instanceof Array) {
    var newCode = '';

    code.forEach(function(element, index, array) {
      newCode = newCode + '"' + element + '" ';
    });

    code = newCode.trim();
    code = code.substr(1, code.length-2);
  }

  return constructParameters('SEND_ONCE', parenthesize([remote, code]));
};

IRSend.prototype._send_start = function(remote, code) {
  if (!remote) remote = '';
  if (!code) code = '';

  return constructParameters('SEND_START', parenthesize([remote, code]));
};

IRSend.prototype._send_stop = function(remote, code) {
  if (!remote) remote = '';
  if (!code) code = '';

  return constructParameters('SEND_STOP', parenthesize([remote, code]));
};

IRSend.prototype._set_transmitters = function(transmitters) {
  if (transmitters instanceof Array) {
    var newTransmitters = '';

    transmitters.forEach(function(element, index, array) {
      newTransmitters = newTransmitters + element + " ";
    });

    transmitters = newTransmitters.trim();
  }

  return constructParameters('SET_TRANSMITTERS', transmitters);
};

IRSend.prototype._simulate = function(code) {
  return constructParameters('SIMULATE', parenthesize(code));
};

function constructParameters(command, parameters) {
  var parameterList = [];
  parameterList.push(backendParameters);
  parameterList.push(command);
  parameterList = parameterList.concat(parameters);
  return parameterList.join(' ');
}

function parenthesize(list) {
  return list.map(function (item) {
    return '"' + item + '"';
  });
}

function runIrsend(parameters, callback) {
  exec('irsend ' + parameters, callback);
}