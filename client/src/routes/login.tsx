import { createFileRoute } from '@tanstack/react-router'
import { AuthLayout } from '../components/layout/AuthLayout'
import { GoogleLogin } from '../components/GoogleLogin'
import { LoginBody } from '@scr4m/common'
import { useMutation } from '@tanstack/react-query'
import { apiPost } from '../api'


const LoginRoute = () => {
  const loginMutation = useMutation({
    mutationFn: async (body: LoginBody) => {
      return apiPost(`/api/auth/login`, body);
    },
    onSuccess: () => {
      alert("Login successful!")
    },
    onError: (e) => {
      console.error(e);
    }
  })

  return <AuthLayout>
    <p className="text-xl mt-8 mb-6">Login to continue to scrum:</p>
    <hr className="border-primary b-2 w-full mb-6" />
    <GoogleLogin onLogin={(token) => {
      loginMutation.mutate({ token })
    }} />
  </AuthLayout>
}

export const Route = createFileRoute('/login')({
  component: LoginRoute
})