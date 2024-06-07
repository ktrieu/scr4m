import { RegisterBodySchema } from "@scr4m/common"
import { GoogleLogin } from "./components/GoogleLogin"


function App() {
  RegisterBodySchema.parse({ token: '' })
  return (
    <>
      <p className="text-xl">HELLO</p>
      <GoogleLogin />
    </>
  )
}

export default App
