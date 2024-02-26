export * from './env';
export * from './canisterIds';
export * from './whiteList';
const { origin } = location;

export const IC_PORT = import.meta.env.APP_IC_PORT;
export const ICP_HOST = import.meta.env.APP_ICP_HOST;
export const IC_HOST_CFG = import.meta.env.APP_IC_HOST;
export const IC_HOST = IC_HOST_CFG;

console.debug('IC_HOST_CFG', IC_HOST_CFG);
console.debug('IC_HOST', IC_HOST);
console.debug('ICP_HOST', ICP_HOST);

export const APP_NAME = import.meta.env.APP_ENV;



