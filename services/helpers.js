
function calcularCRC16Modbus(input) {
    let crc = 0xFFFF;
    for (let i = 0; i < input.length; i++) {
      crc ^= input.charCodeAt(i);
      for (let j = 0; j < 8; j++) {
        if ((crc & 1) !== 0) {
          crc = (crc >> 1) ^ 0xA001;
        } else {
          crc = crc >> 1;
        }
      }
    }
    return input + crc.toString(16).toUpperCase().padStart(4, '0');
}

module.exports = { calcularCRC16Modbus }