"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  fetchPostAuthVerificationApi,
  fetchPostUsersApi
} from "@/api/users.api";
import { OK, CREATED, AttemptLimitOver } from "@/api/status";

import Info from "../Info";
import { LoginLayout } from "./LoginLayout";
import clsx from "@/utils/clsx.util";
import { getCurrentTime } from "@/utils";

interface AuthFormProps {
  sessionId: string;
  email: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ sessionId, email }) => {
  const router = useRouter();

  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    const authPayload = await fetchPostAuthVerificationApi({
      id: sessionId,
      email: email,
      emailCode: value,
      currentTime: getCurrentTime()
    });

    if (authPayload.status === OK) {
      const userPayload = await fetchPostUsersApi({
        email: email
      });

      if (userPayload.status === CREATED) {
        router.push(`/auth?token=${userPayload.data!.refreshToken}`);
      } else {
        router.push('/login');
      }
    } else if (authPayload.status === AttemptLimitOver) {
      router.replace('/login');
    } else {
      setError(true);
    }
    setLoading(false);
    setIsValid(false);
  }

  return (
    <LoginLayout title={
      <>
        <p>Input code from the</p>
        <p>message</p>
      </>
    }>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="flex flex-row items-center">
          <input className="w-48 mr-6 py-1 px-2 border border-black rounded-md" type="text"
            onChange={(e) => {
              const v = e.target.value
              setValue(v)
              const expression: RegExp = /^[0-9]{6}$/i
              setIsValid(expression.test(v))
            }}
            maxLength={6}
          />
          <Timer duration={300} onTimeout={() => {setIsValid(false)}} />
        </div>
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
      <Info text={'Verification code is invalid'} trigger={error}></Info>
    </LoginLayout>
  );
}

interface TimerProps {
  duration: number;
  onTimeout: () => void;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeout }) => {
  const [seconds, setSeconds] = useState(duration % 60);
  const [minutes, setMinutes] = useState(Math.floor(duration / 60));

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined = undefined;

    if (seconds > 0 || minutes > 0) {
      timerId = setInterval(() => {
        if (seconds === 0) {
          setMinutes((prevMinutes) => prevMinutes - 1);
          setSeconds(59);
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
      }, 1000);
    } else {
      onTimeout();
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [seconds, minutes, onTimeout]);

  return (
    <div>{`${minutes}` + ':' + `${seconds}`.padStart(2, '0')}</div>
  );
}

export default AuthForm;
