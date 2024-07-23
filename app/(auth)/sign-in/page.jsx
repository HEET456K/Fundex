'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    app,
    auth,
    firestore,
    googleProvider,
} from '@/firebaseService/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import Link from 'next/link';
import { FaRegEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { theme } from '@/theme';
import { useDispatch, useSelector } from 'react-redux';
import {
    addUserData,
    userCollection,
} from '@/firebaseService/collections/userCollection/userCollection';
import { getDocs, query, where } from 'firebase/firestore';
import { setUser } from '@/redux/userReducer/userSlice.redux';

const SignInPage = () => {
    const auth = getAuth(app);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const { email } = useSelector((state) => state.user);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const [inputType, setInputType] = useState('password');
    const [icon, setIcon] = useState(<FaRegEye />);
    const router = useRouter();
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        setInputType(showPassword ? 'password' : 'text');
        setIcon(showPassword ? <FaEyeSlash /> : <FaRegEye />);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleLoginBtn = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            const { email, password } = formData;
            // Add your sign-in logic here, for example using signInWithEmailAndPassword
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // After successful sign-in, redirect the user to the "/stepform" page
            router.push('/stepform');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const { user } = result;
            const { displayName, email, photoURL } = user;

            const q = query(userCollection, where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                await addUserData({
                    displayName,
                    email,
                    photoURL,
                });
                console.log('New User');
                router.push('/stepform');
            } else {
                console.log('Old User');
                router.push('/stepform');
                // router.push('/manage');

            }
            dispatch(setUser({ id: null, email: email }));
        } catch (error) {
            console.error('Error signing in with Google:', error.message);
        }
    };

    return (
        <div
            style={{
                backgroundColor: theme.loginPage.background,
            }}
            className={`flex justify-center h-full items-center  font-normal `}
        >
            <div
                style={{ backgroundColor: theme.loginPage.box }}
                className="flex flex-col w-[38%]  text-white justify-center h-[708px] pl-[150px] px-[100px] rounded-l-2xl"
            >
                <div className="mb-[20px]">
                    <svg
                        width="50"
                        height="50"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="white"
                        className="mb-[10px]"
                    >
                        <circle cx="50" cy="50" r="25" />
                    </svg>

                    <h2 className="text-3xl font-bold mb-2">Login</h2>
                    <p className="mb-8">
                        See your growth and get consulting support!
                    </p>
                    <button
                        onClick={signInWithGoogle}
                        className="border flex items-center justify-center gap-3 border-gray-400 h-[3rem] bg-[#494949] rounded-3xl w-full px-4 mb-6 mt-[10px]"
                    >
                        <FcGoogle className="text-2xl" />
                        <p>Continue with Google</p>
                    </button>
                </div>
                <div className="flex items-center">
                    <div className="flex-grow border-t border-gray-400"></div>
                    <span className="mx-4 text-gray-400">
                        or Sign in with Email
                    </span>
                    <div className="flex-grow border-t border-gray-400"></div>
                </div>

                <div className="flex flex-col mt-6 space-y-4">
                    <div>
                        <label htmlFor="email" className="block mb-2">
                            Email
                        </label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="mail@website.com"
                            className="border border-gray-400 h-[3rem] bg-transparent rounded-3xl w-full px-4"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2">
                            Password*
                        </label>
                        <div className="relative">
                            <input
                                placeholder="Min. 8 characters"
                                type={inputType}
                                value={formData.password}
                                onChange={handleChange}
                                name="password"
                                className="border border-gray-400 h-[3rem] bg-transparent rounded-3xl w-full px-4 pr-12"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 px-4 py-2 bg-transparent rounded-lg shadow-md  focus:outline-none"
                            >
                                {icon}
                            </button>
                        </div>
                    </div>
                    <div className="flex  justify-between">
                        <div className="flex w-[35%] justify-between">
                            <input type="checkbox" name="" id="" />
                            <p>Remember me</p>
                        </div>
                        <p>Forgot password?</p>
                    </div>
                    <button
                        onClick={handleLoginBtn}
                        className="border border-gray-400 font-extrabold h-[3rem] bg-white text-black rounded-3xl w-full px-4"
                    >
                        Login
                    </button>
                    <p>Not registered yet? <Link href="/signup">Create an Account</Link></p>
                </div>
            </div>
            <div className="">
                <Image
                    src="https://s3-alpha-sig.figma.com/img/2f31/e314/1e37c0dfbda5bb4e3f254910133a5eca?Expires=1719792000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=QuUbCmNOGfRxN5-KfxInbAUqnIlc4r3aDnKvZ1rip6a0jPO2HeTIzWcz1-SlqOQrKmcyP-skRiWV9g6QXbs94~IGTjJzI2jh0jNHAb89VqyRVLsV~l2q~q19Qqp3KJS7NwJryGQEgxSLdOR2KI6YAjPSSvXOunZeuDh6QF0yfwropS7Oa0jwqWTLmJPkBBTrgqXAX2OaCsQCENPX~IkL105f7zr-XK23Mw6QUN4SrKExYHSIV9ZPbPQ-9zvR5EJCJTtG63ieeYvhup7VlOPNbk5vfySEUCtne1F5jPB8aCajy4Ta7Z5NebkPJ7fg1Ylpg48oMFSnqK4KB3aokoO~kg__"
                    width={550}
                    height={550}
                    alt="Sign in illustration"
                    className="rounded-r-2xl shadow-lg"
                />
            </div>
        </div>
    );
};

export default SignInPage;
