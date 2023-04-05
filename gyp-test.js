const bindings = require('bindings');
const process = bindings({ bindings: 'process' });

const list = process.getList();

for (let i = 0; i < list.length; i++) {
    // console.log(list[i]);
}

process.readMemory(4672, 0x00E05EE0);