// types.ts - ประกาศ type/interface สำหรับหน้า login

export interface LoginForm {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  username: string;
  // เพิ่ม field อื่น ๆ ตามที่ backend ส่งกลับมา
}
