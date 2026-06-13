import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

export const PublicLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Simple header for public pages */}
            
            {/*<header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                    <div className="flex items-center gap-2">
                        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xl font-bold text-gray-900">elwaseet</span>
                    </div>
                </div>
            </header>}

            {/* Main content */}
            <main>
                <Outlet />
            </main>

            {/* Simple footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-sm text-gray-500">
                        © 2026 elwaseet. All rights reserved.
                    </p>
                </div>
            </footer>
            <Toaster position="top-center" reverseOrder={false} />
        </div>
    );
};
