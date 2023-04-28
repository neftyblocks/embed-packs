const charmap = '.12345abcdefghijklmnopqrstuvwxyz';
const charidx = (ch: string) => {
    const idx = charmap.indexOf(ch);
    if (idx === -1) throw new TypeError(`Invalid character: '${ch}'`);
    return idx;
};

export const getNameAsHex = (name: string): string => {
    if (name.length > 12) {
        throw new TypeError('A name can be up to 12 characters long');
    }

    let bitstr = '';
    for (let i = 0; i <= 12; i++) {
        const c = i < name.length ? charidx(name[i]) : 0;
        const bitlen = i < 12 ? 5 : 4;
        let bits = Number(c).toString(2);
        if (bits.length > bitlen) {
            throw new TypeError(`Invalid name ${name}`);
        }
        bits = '0'.repeat(bitlen - bits.length) + bits;
        bitstr += bits;
    }
    return BigInt(`0b${bitstr}`).toString(16).padStart(16, '0');
};
