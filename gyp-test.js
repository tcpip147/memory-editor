const bindings = require('bindings');
const process = bindings({ bindings: 'process' });

console.log(process.readMemory(3));
