interface IAuthConfig {
  jwt: {
    secret: string;
    expireIn: string;
  };
}

export default {
  jwt: {
    secret: process.env.APP_SECRET || 'secret',
    expireIn: '1d',
  },
} as IAuthConfig;
