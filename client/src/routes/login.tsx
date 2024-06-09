import { createFileRoute } from '@tanstack/react-router'
import { AuthLayout } from '../components/layout/AuthLayout'
import { Logo } from '../components/layout/Logo'
import { GoogleLogin } from '../components/GoogleLogin'


const LoginRoute = () => {
  return <AuthLayout>
    <p className="text-xl mt-8 mb-6">Login to continue to scrum:</p>
    <hr className="border-primary b-2 w-full mb-6" />
    <GoogleLogin />
  </AuthLayout>
}

export const Route = createFileRoute('/login')({
  component: LoginRoute
})