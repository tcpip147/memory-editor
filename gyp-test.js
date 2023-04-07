const bindings = require('bindings');
const process = bindings({ bindings: 'process' });

const list = process.getList();


process.writeMemory(162852, 0x2AC0040, 25);