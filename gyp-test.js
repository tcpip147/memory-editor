const bindings = require('bindings');
const process = bindings({ bindings: 'process' });

const list = process.getList();

for (let i = 0; i < list.length; i++) {
    // console.log(list[i]);
}

const arr = process.readMemory(23508, 0x7FFD5F39E1B0, 3);
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i].toString(16));
}