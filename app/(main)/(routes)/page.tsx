import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <div>
      <h1 className="text-4xl place-content-center font-bold text-center mt-10">Welcome to SIA</h1>
      <p className="text-center mt-10">The premier platform for all your academic needs.</p>

      <div className="flex justify-center m-20">
        <Image src="/static/emma.svg" alt="SIA Logo" width={300} height={300} className="image-spin" />
      </div>

      <div className="flex justify-center mt-20">
        <p className="text-center">Don't have an account? <Link href="/register" className="text-blue-500 hover:underline"> Register </Link></p>
      </div>

      <div className="flex justify-center mt-5">
        <p className="text-center">Already have an account? 
          <a href="/login" className="text-blue-500 hover:underline"> Log in </a>
        </p>
      </div>
    </div>
  );
}

