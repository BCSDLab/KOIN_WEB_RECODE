/* eslint-disable no-bitwise */
const uuidv4 = (): string => (
  // eslint-disable-next-line no-mixed-operators
  `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`).replace(/[018]/g, (c: any) => ((c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)));

export default uuidv4;
