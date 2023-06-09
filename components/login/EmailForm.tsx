"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { fetchPostAuthEmailApi } from "@/api/users.api";
import { OK } from "@/api/status";

import Info from "../Info";
import { LoginLayout } from "./LoginLayout";
import clsx from "@/utils/clsx.util";
import { getCurrentTime } from "@/utils";

const EmailForm: React.FC = () => {
  const router = useRouter();

  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    const payload = await fetchPostAuthEmailApi({
      at: getCurrentTime(),
      email: value
    });

    if (payload.status === OK) {
      router.push(`/login?session-id=${payload.data!.id}&email=${payload.data!.email}`);
    } else {
      setError(true);
    }
    setLoading(false);
    setIsValid(false);
  }

  return (
    <LoginLayout title={
      <>
        <p>Please input your</p>
        <p>email</p>
      </>
    }>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input className="w-full py-1 px-2 border border-black rounded-md" type="text"
          onChange={(e) => {
            const v = e.target.value
            setValue(v)
            const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
            setIsValid(expression.test(v))
          }}
        />
        <button className={clsx(
            "w-full py-2 rounded-lg bg-knock-main text-lg text-white",
            (!isValid || loading) ? "opacity-70" : ""
          )}
          disabled={!isValid || loading}
          type="submit"
        >
          {loading ? 'loading...' : 'Send'}
        </button>
      </form>
      <Info text={'Email is invalid'} trigger={error}></Info>
    </LoginLayout>
  );
}

export default EmailForm;
