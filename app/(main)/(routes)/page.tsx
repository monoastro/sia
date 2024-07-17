import Link from 'next/link'

export default function landingPage()
{
  return (
	  <div>
	  <h1 className="text-4xl place-content-center font-bold text-center mt-10">Welcome to SIA</h1>
	  <p className="text-center mt-10"> The premier platform for all your academic needs.</p>
		  <div className="flex justify-center mt-10">
	  <p className="text-center">Don't have an account? <Link href="/register" className="text-blue-500 hover:underline"> Register </Link>
	  </p>
	  </div>
	  <div className="flex justify-center mt-10">
	  <p className="text-center">Already have an account? 
	  <Link href="/login" className="text-blue-500 hover:underline"> Log in </Link>
	  </p>
		</div>
	  </div>
  );
}
