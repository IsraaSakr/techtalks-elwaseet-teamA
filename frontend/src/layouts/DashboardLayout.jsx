import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';

export const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-muted/40">
            <Navbar />

            <div className="flex">
                <Sidebar />

                <main className="flex-1 p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
