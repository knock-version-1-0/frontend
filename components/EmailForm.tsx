import { useState } from "react"
import { useRouter } from "next/router"

import { fetchPostAuthEmailApi } from "@/api/users.api"
import { OK } from "@/api/status"

import Info from "./Info"

const EmailForm: React.FC<{}> = () => {
  const router = useRouter()

  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload = await fetchPostAuthEmailApi({
      at: Math.round(Date.now() / 1000),
      email: value
    })

    if (payload.status === OK) {
      router.push(`/login?session-id=${payload.data!.id}`)
    } else {
      setError(true)
    }
  }

  return (
    <div className="px-4">
      <div className="mt-36 py-12 text-xl font-light">
        <p>Please input your</p>
        <p>email</p>
      </div>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input className="w-full py-1 px-2 border border-black rounded-md" type="text"
          onChange={(e) => {
            setValue(e.target.value)
          }}
        />
        <button className="w-full py-2 rounded-lg bg-knock-main text-lg text-white" type="submit">
          Send
        </button>
      </form>
      <Info text={'Email 인증에 실패하였습니다'} trigger={error}></Info>
    </div>
  )
}

export default EmailForm
