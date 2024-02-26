const { APP_ENV } = import.meta.env;

export const isLocalEnv = () => APP_ENV === 'Local';

export const isTestNetEnv = () => APP_ENV === 'TestNet';

export const isMainNetEnv = () => APP_ENV === 'MainNet';
