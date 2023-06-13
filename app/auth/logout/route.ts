import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AUTH_TOKEN_KEY } from "@/constants/users.constant";

export async function GET(request: Request) {
  cookies().delete(AUTH_TOKEN_KEY);

  redirect('/');
}
