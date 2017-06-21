"use strict";

const pn       = module.exports = {};
const ports    = require("./ports.json");
const services = require("./services.json");

// port -> service
pn.getService = function getService(port, protocol) {
  if (typeof port !== "number") {
    throw new Error("expected a 'number'");
  }

  if (!protocol) {
    protocol = "tcp";
  }

  return ports[port + "/" + protocol] || null;
};

// service -> port
pn.getPort = function getPort(service, protocol) {
  if (typeof service !== "string") {
    throw new Error("expected a 'string'");
  }

  if (!protocol) {
    protocol = "tcp";
  }

  // services are always lowercase
  const entry = services[service.toLowerCase()];
  if (!entry) {
    return null;
  }

  // filter non-matching protocols
  const port = entry.ports.filter(function(port) {
    return /\w+$/.exec(port)[0] === protocol;
  })[0];

  if (!port) {
    return null;
  }

  // return the first matching port
  return {
    port: Number(/^\d+/.exec(port)[0]),
    protocol: /\w+$/.exec(port)[0],
    description: entry.description
  };
};
