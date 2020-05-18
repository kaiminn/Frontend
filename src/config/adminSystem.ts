export const DEFAULT = {
  adminSystem: (config) => {
    let JWTokenKEY = "AdminSystemToken168";
    // AdminSystem Publish channel
    const PubChannel = "AdminSystem-Channel";

    // JWT 私鑰
    if (process.env.JWToken_KEY)
      JWTokenKEY = process.env.JWToken_KEY.toString();

    return {
      limitMax: 50,
      JWTokenKEY,
      PubChannel,
    };
  },
};

export const test = {
  adminSystem: (config) => {
    // AdminSystem Publish channel
    const PubChannel = "AdminSystem-Channel";
    return {
      limitMax: 50,
      JWTokenDisable: true,
      PubChannel,
    };
  },
};

export const production = {
  adminSystem: (config) => {
    let JWTokenKEY = "Asdk8XsliUaiql4n";
    // AdminSystem Publish channel
    const PubChannel = "AdminSystem-Channel";

    // JWT 私鑰
    if (process.env.JWToken_KEY)
      JWTokenKEY = process.env.JWToken_KEY.toString();

    return {
      limitMax: 50,
      JWTokenKEY,
      PubChannel,
    };
  },
};
