import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Briefcase, AlertCircle, DollarSign, Activity } from 'lucide-react';
import { ROUTES } from '../../lib/constants';
// import SpotlightCard from '../../components/ui/SpotlightCard';
// import CountUp from '../../components/ui/CountUp';
// import ScrollReveal from '../../components/ui/ScrollReveal';


export const AdminDashboard = () => {
    const [stats] = useState({
        totalUsers: 156,
        activeJobs: 42,
        pendingDisputes: 3,
        totalRevenue: 12450,
    });

    const statCards = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-100",
            subtext: "Registered accounts",
            link: ROUTES.ADMIN_USERS
        },
        {
            title: "Active Jobs",
            value: stats.activeJobs,
            icon: Briefcase,
            color: "text-green-600",
            bg: "bg-green-100",
            subtext: "Currently in progress",
            link: ROUTES.ADMIN_JOBS
        },
        {
            title: "Pending Disputes",
            value: stats.pendingDisputes,
            icon: AlertCircle,
            color: "text-red-600",
            bg: "bg-red-100",
            subtext: "Require attention",
            link: ROUTES.ADMIN_DISPUTES
        },
        {
            title: "Total Revenue",
            value: stats.totalRevenue,
            icon: DollarSign,
            color: "text-purple-600",
            bg: "bg-purple-100",
            subtext: "Platform earnings",
            prefix: "$",
            link: ROUTES.ADMIN_REVENUE
        }
    ];

    const recentActivity = [
        {
            id: 1,
            title: "New user registered",
            desc: "John Doe joined as a customer",
            time: "2 hours ago",
            color: "bg-blue-500"
        },
        {
            id: 2,
            title: "Job completed",
            desc: "Plumbing service completed successfully",
            time: "5 hours ago",
            color: "bg-green-500"
        },
        {
            id: 3,
            title: "Dispute opened",
            desc: "Customer reported incomplete work",
            time: "1 day ago",
            color: "bg-red-500"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header */}
            {/* <ScrollReveal> */}
            <div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1">Platform overview and management</p>
                </div>
            </div>
            {/* </ScrollReveal> */}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    // <ScrollReveal key={index} delay={index * 0.1}>
                    <div key={index}>
                        <Link to={stat.link} className="block h-full group">
                            {/* <SpotlightCard className="h-full border-none shadow-md bg-white/50 hover:shadow-xl transition-all duration-300"> */}
                            <div className="h-full border border-gray-200 shadow-md bg-white rounded-xl p-6 group-hover:shadow-xl group-hover:scale-[1.02] transition-all duration-300">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className={`p-3 rounded-2xl ${stat.bg} bg-opacity-50`}>
                                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                        </div>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.bg} ${stat.color} bg-opacity-30`}>
                                            +12%
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">{stat.title}</h3>
                                        <div className="text-3xl font-bold text-gray-900 flex items-baseline gap-1">
                                            {stat.prefix && <span>{stat.prefix}</span>}
                                            {/* <CountUp end={stat.value} duration={2000} separator="," /> */}
                                            <span>{stat.value}</span>
                                        </div>
                                        <p className="text-sm text-gray-400 mt-2">{stat.subtext}</p>
                                    </div>
                                </div>
                            </div>
                            {/* </SpotlightCard> */}
                        </Link>
                    </div>
                    // </ScrollReveal>
                ))}
            </div>

            {/* Recent Activity */}
            {/* <ScrollReveal delay={0.4}> */}
            <div>
                <Card className="border-none shadow-lg overflow-hidden">
                    <CardHeader className="border-b bg-gray-50/50">
                        <div className="flex items-center gap-2">
                             <Activity className="w-5 h-5 text-indigo-600" />
                            <CardTitle>Recent Activity</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                <div className={`w-3 h-3 ${activity.color} rounded-full mt-2 ring-4 ring-white shadow-sm`} />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                        {activity.title}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">{activity.desc}</p>
                                    <p className="text-xs text-gray-400 mt-2 font-medium">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    </CardContent>
                </Card>
            </div>
            {/* </ScrollReveal> */}
        </div>
    );
};
