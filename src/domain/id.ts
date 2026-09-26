const alphabet='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-';
export function createId(size=21){const bytes=new Uint8Array(size);crypto.getRandomValues(bytes);let out='';for(const b of bytes)out+=alphabet[b&63];return out}
export function isId(value:string){return /^[A-Za-z0-9_-]{21}$/.test(value)}
