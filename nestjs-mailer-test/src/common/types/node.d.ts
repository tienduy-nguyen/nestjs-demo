declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly EMAIL_ID: string;
    readonly EMAIL_PASS: string;
    readonly EMAIL_HOST: string;
    readonly EMAIL_PORT: string;
  }
}
