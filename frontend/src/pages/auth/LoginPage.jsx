import { Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
	return (
		<div className='min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-r from-blue-300 via-purple-400 to-indigo-500 p-6'>
			<div className='w-full max-w-md bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8'>
				<div className='text-center'>
					<img className='mx-auto h-20 w-auto' src='/teamify_logo.svg' alt='Teamify' />
					<h2 className='mt-4 text-3xl font-bold text-gray-900'>Sign in to your account</h2>
				</div>

				<div className='mt-8'>
					<LoginForm />
					<div className='mt-6'>
						<div className='relative flex items-center'>
							<div className='flex-grow border-t border-gray-500'></div>
							<span className='px-4 text-gray-800'>New to Teamify?</span>
							<div className='flex-grow border-t border-gray-500'></div>
						</div>
						<div className='mt-6'>
							<Link
								to='/signup'
								className='w-full flex justify-center py-2 px-4 rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-700 hover:opacity-90 transition-all duration-300'
							>
								Join now
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
