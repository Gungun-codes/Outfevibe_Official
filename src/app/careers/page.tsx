export default function CareersPage() {
    return (
        <div className="min-h-screen bg-black text-white px-6 py-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">
                    Join the Outfevibe Team
                </h1>
                <p className="text-gray-400 mb-6">
                    We're on a mission to revolutionize the way people discover and express their style. If you're passionate about fashion, technology, and creating amazing user experiences, we'd love to hear from you!
                </p>
                <div className="bd-[#111] border border-[#1f1f1f] rounded-2xl p-6">
                    <h2 className="text-2xl font-semibold mb-4">
                        Current Openings
                    </h2>
                    <ul className="list-disc list-inside text-gray-400 mb-4">
                        <li className="mb-2">
                            <strong>Frontend Developer</strong> - Build and enhance our user interface using React and Next.js.
                        </li>
                        <li className="mb-2">
                            <strong>Backend Developer</strong> - Develop and maintain our server-side logic and database using Node.js and Firebase.
                        </li>
                        <li className="mb-2">
                            <strong>UI/UX Designer</strong> - Create beautiful and intuitive user interfaces and experiences for our platform.
                        </li>
                    </ul>
                    <p className="text-gray-400 mb-4">
                        If you're interested in joining our team, please send your resume and a brief introduction to <span className="text-white font-semibold">outfevibe@gmail.com</span>
                    </p>
                    <p className="text-gray-400">
                        We can't wait to see how you can contribute to Outfevibe's mission of empowering everyone to express their unique style!
                    </p>
                </div>
            </div>
        </div>
    );
}