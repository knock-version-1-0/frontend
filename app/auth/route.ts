import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token') as string;

  cookies().set('auth/token', token, {httpOnly: true})

  redirect('/note');
}
