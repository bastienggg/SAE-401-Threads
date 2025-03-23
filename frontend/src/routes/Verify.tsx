import VerifyComponent from "../components/verify/verify"

export default function Verify() {  
    return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-purple-50 to-sky-50 h-screen w-full gap-4">
      <div className="flex flex-col items-center gap-4 w-full">
          <img src="./src/assets/parlatz_logo.svg" alt="" className="w-20 aspect-square"/>
          <h1 className="font-extrabold text-3xl text-neutral-900">Parlatz</h1>
        </div>
          <VerifyComponent />
      </div>
)

}