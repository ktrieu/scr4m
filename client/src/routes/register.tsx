import { createFileRoute } from '@tanstack/react-router'
import { AuthLayout } from '../components/layout/AuthLayout'
import { GoogleLogin } from '../components/GoogleLogin'
import { useMutation } from '@tanstack/react-query'
import { RegisterBody } from '@scr4m/common'
import { apiPost } from '../api'

const RegisterRoute = () => {
  const registerMutation = useMutation({
    mutationFn: async (body: RegisterBody) => {
      return apiPost(`/api/auth/register/1`, body);
    },
    onSuccess: () => {
      alert("Register successful!")
    },
    onError: (e) => {
      console.error(e);
    }
  })

  return <AuthLayout>
    <p className="text-xl mt-8 mb-6">Register with company:</p>
    <hr className="border-primary b-2 w-full mb-6" />
    <GoogleLogin onLogin={(token) => {
      registerMutation.mutate({ token })
    }} />
  </AuthLayout>
}

export const Route = createFileRoute('/register')({
  component: RegisterRoute
})