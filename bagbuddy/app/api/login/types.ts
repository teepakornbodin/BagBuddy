// app/login/types.ts
export type LoginForm = {
  username: string; // อาจเป็น user_name หรือ email
  password: string;
};

export type LoginSuccess = {
  message: string;
  account: {
    accountId: string;
    role: "shop" | "user";
  };
};
