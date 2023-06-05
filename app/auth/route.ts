import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AUTH_TOKEN_KEY } from "@/constants/auth.constant";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token') as string;

  cookies().set(AUTH_TOKEN_KEY, token, {httpOnly: true})

  redirect('/note');
}
