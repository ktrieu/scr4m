import { createFileRoute } from '@tanstack/react-router'
import { AuthLayout } from '../components/layout/AuthLayout'
import { Logo } from '../components/layout/Logo'
import { GoogleLogin } from '../components/GoogleLogin'


const LoginRoute = () => {
  return <AuthLayout>
    <Logo />
    <p className="text-xl mt-8 mb-12">Login to enter scrum:</p>
    <GoogleLogin />
  </AuthLayout>
}

export const Route = createFileRoute('/login')({
  component: LoginRoute
})