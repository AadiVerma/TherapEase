import Spline from '@splinetool/react-spline';
import { Section1Footer, ImageCard, Section1Footer2 } from '../Components/HomePage/Section1';

export default function Homepage() {
    return (
        <div className="w-full">
            {/* section -- 1 */}
            <section className="relative w-full h-screen">
                <div className="absolute inset-0 -z-10">
                    <Spline scene="https://prod.spline.design/aJlEf99S4VVqCZ26/scene.splinecode" />
                </div>
                <div className="relative z-20 flex justify-between p-4">
                    <div className="flex gap-6 items-center">
                        <h1 className="text-black text-2xl font-semibold mr-10">TherapEase</h1>
                        <button className="cursor-pointer text-neutral-700 font-medium hover:text-neutral-900 hover:underline underline-offset-4">About Us</button>
                        <button className="cursor-pointer text-neutral-700 font-medium hover:text-neutral-900 hover:underline underline-offset-4">Mood Tracker</button>
                        <button className="cursor-pointer text-neutral-700 font-medium hover:text-neutral-900 hover:underline underline-offset-4">AI Therapist</button>
                        <button className="cursor-pointer text-neutral-700 font-medium hover:text-neutral-900 hover:underline underline-offset-4">Quiz</button>
                        <button className="cursor-pointer text-neutral-700 font-medium hover:text-neutral-900 hover:underline underline-offset-4">Anonymous Sharing</button>
                    </div>
                    <div className="flex flex-col justify-center">
                        <button className="cursor-pointer text-neutral-700 font-medium bg-white/80 p-4 pt-2 pb-2 rounded-full">Get Started</button>
                    </div>
                </div>
                <ImageCard />
                <Section1Footer />
                <Section1Footer2 />
            </section>

            {/* Section -- 2 */}
            <section className="w-full h-screen bg-gray-100 flex justify-center items-center">
                <h2 className="text-3xl text-gray-700">Section 2: Introduction</h2>
            </section>

            {/* Section -- 3 */}
            <section className="w-full h-screen bg-white flex justify-center items-center">
                <h2 className="text-3xl text-gray-700">Section 3: Features</h2>
            </section>

            {/* Section -- 4 */}
            <section className="w-full h-screen bg-gray-200 flex justify-center items-center">
                <h2 className="text-3xl text-gray-700">Section 4: Contact</h2>
            </section>
        </div>
    );
}
