import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowSmRight } from 'react-icons/hi';
import AppHeader from '../components/Header';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ProgressAndReports() {
    const storedAvatar = localStorage.getItem('selectedAvatar');
    const reportRef = useRef();

    const handleDownloadPDF = () => {
        const input = reportRef.current;
        html2canvas(input, { 
            scale: 3, // Higher scale for better resolution
            useCORS: true,
            logging: true,
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('Social_Skills_Report.pdf');
        });
    };

    return (
        <div className="min-h-screen bg-[#272052] text-white">
            <AppHeader storedAvatar={storedAvatar} />
            <div className="p-6">
                <h2 className="text-3xl font-bold mb-8 text-center">Track your progress and view detailed performance reports.</h2>

                {/* PDF Content */}
                <div ref={reportRef} className="bg-white text-gray-800 p-8">
                    {/* Report Header */}
                    <div className="mb-8 text-center bg-gradient-to-r from-[#4F3B8C] to-[#272052] text-white py-6 rounded-xl">
                        <h1 className="text-3xl font-bold mb-2">Social Skills Progress Report</h1>
                        <p className="text-sm opacity-90">{new Date().toLocaleDateString()}</p>
                    </div>

                    {/* User Summary */}
                    <div className="mb-8 flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <div>
                            <h2 className="text-xl font-bold">User Profile</h2>
                            <p className="text-sm text-gray-600">Learning Journey Summary</p>
                        </div>
                    </div>

                    {/* Progress Section */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-6 border-l-4 border-purple-600 pl-3">Progress Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: 'Social Skills Score', value: 85, label: '85% proficiency' },
                                { title: 'Completed Scenarios', value: 83, label: '5/6 scenarios' },
                                { title: 'Engagement Level', value: 90, label: 'Highly Engaged' }
                            ].map((metric, index) => (
                                <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-sm">
                                    <h3 className="text-lg font-semibold mb-4">{metric.title}</h3>
                                    <div className="relative pt-1">
                                        <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-200">
                                            <div 
                                                style={{ width: `${metric.value}%` }}
                                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-purple-300"
                                            ></div>
                                        </div>
                                        <p className="text-sm text-gray-600">{metric.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Performance Section */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-6 border-l-4 border-purple-600 pl-3">Performance Analysis</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-green-50 p-6 rounded-xl">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <span className="mr-2">✅</span>
                                    Strengths
                                </h3>
                                <ul className="space-y-3">
                                    {['Conflict Resolution', 'Empathy', 'Cooperation'].map((item, index) => (
                                        <li key={index} className="flex items-center text-gray-700">
                                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="bg-red-50 p-6 rounded-xl">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <span className="mr-2">⚠️</span>
                                    Areas for Improvement
                                </h3>
                                <ul className="space-y-3">
                                    {['Active Listening', 'Reading Social Cues'].map((item, index) => (
                                        <li key={index} className="flex items-center text-gray-700">
                                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Coach's Notes Section */}
                    <div className="mt-8 p-6 bg-purple-50 rounded-xl">
                        <h3 className="text-lg font-semibold mb-3">Coach's Notes</h3>
                        <p className="text-gray-700 text-sm leading-relaxed mb-4">
                            "You've demonstrated exceptional progress in managing interpersonal conflicts and showing empathy toward others. Your ability to collaborate in group scenarios has been particularly impressive. Your consistent practice and willingness to engage with challenging scenarios has led to significant improvement over the past month."
                        </p>
                        
                        <h4 className="font-medium text-purple-700 mb-2">Action Points:</h4>
                        <ul className="text-gray-700 text-sm space-y-2">
                            <li className="flex items-start">
                                <span className="text-purple-500 mr-2">→</span>
                                <span>Practice active listening techniques daily: maintain eye contact, ask clarifying questions, and summarize what others have said.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-purple-500 mr-2">→</span>
                                <span>Work on identifying nonverbal cues by observing interactions in social settings and noting body language patterns.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-purple-500 mr-2">→</span>
                                <span>Complete the remaining scenario focusing on complex social dynamics in workplace environments.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center text-sm text-gray-500 border-t pt-4">
                        <p>Generated by Social Skills Coach • {new Date().toLocaleDateString()}</p>
                        <p>Confidential - For personal use only</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex flex-col md:flex-row justify-center items-center gap-4">
                    <button
                        onClick={handleDownloadPDF}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                    >
                        Download Report as PDF
                    </button>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                    >
                        Explore More Scenarios <HiArrowSmRight className="ml-2" />
                    </Link>
                </div>
            </div>
        </div>
    );
}