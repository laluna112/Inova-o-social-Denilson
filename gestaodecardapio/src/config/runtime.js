const normalizeEnvironment = (value = 'development') => {
  const normalized = String(value).trim().toLowerCase();

  if (normalized === 'prod' || normalized === 'production') {
    return 'production';
  }

  return 'development';
};

export const appEnvironment = normalizeEnvironment(
  import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE ?? 'development'
);

export const isProduction = appEnvironment === 'production';
export const isDevelopment = !isProduction;

export const runtimeConfig = {
  environment: appEnvironment,
  isProduction,
  isDevelopment,
  storagePrefix: isProduction ? 'gestao-cardapio-prod' : 'gestao-cardapio-dev',
  enableSeedData: isDevelopment,
  debugLogs: isDevelopment,
  defaultRedirect: '/',
};
