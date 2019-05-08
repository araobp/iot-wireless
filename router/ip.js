const os = require('os');
const ifaces = os.networkInterfaces();

function ipAddr(targetIf) {
  let found = null;
  Object.keys(ifaces).forEach(ifname => {
    ifaces[ifname].forEach(iface => {
      if (iface.family == 'IPv4' && iface.internal == false) {
        if (ifname == targetIf) {
          found = iface.address;
        }
      }
    });
  });
  return found;
}
