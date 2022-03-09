export const jwtConfig = {
    secret: process.env.JWT_SECRET || 'topSecret',
    signOptions: {
      expiresIn: +process.env.JWT_EXPIRE_IN || 360000,
    },
  };