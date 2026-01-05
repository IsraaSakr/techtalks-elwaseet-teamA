import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Search, Filter, MoreHorizontal, User, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '../../lib/utils';
// import ScrollReveal from '../../components/ui/ScrollReveal';

import { mockUsers } from '../../lib/mockData';

export const UsersList = () => {
    const navigate = useNavigate();
    // Mock users data - using centralized mock data
    const [users] = useState(mockUsers);

    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;

    });

    // Pagination
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'SUSPENDED':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'provider':
                return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Provider</Badge>;
            case 'admin':
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Admin</Badge>;
            default:
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Customer</Badge>;
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header */}
            {/* <ScrollReveal> */}
            <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Users Management</h1>
                        <p className="text-gray-600 mt-1">Manage and view all registered users</p>
                    </div>
                    <Button variant="outline" className="shadow-sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export Users
                    </Button>
                </div>
            </div>
            {/* </ScrollReveal> */}

            {/* Users List */}
            {/* <ScrollReveal delay={0.2}> */}
            <div>
                <Card className="border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
                    <CardHeader className="border-b bg-gray-50/50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle>All Users</CardTitle>
                            
                            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                                {/* Search */}
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                    <input
                                        placeholder="Search by name or email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-8 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                                    />
                                </div>

                                {/* Filters */}
                                <div className="flex gap-2">
                                    <select 
                                        className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-gray-600"
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="customer">Customer</option>
                                        <option value="provider">Provider</option>
                                    </select>

                                    <select 
                                        className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-gray-600"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="ACTIVE">Active</option>
                                        <option value="SUSPENDED">Suspended</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">User</th>
                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Role</th>
                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Status</th>
                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Joined</th>
                                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Jobs</th>
                                        <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="py-8 text-center text-gray-500">
                                                No users found matching your filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedUsers.map((user) => (
                                            <tr 
                                                key={user.id} 
                                                className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                                                onClick={() => navigate(ROUTES.ADMIN_USER_DETAILS(user.id))}
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                            <User className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{user.name}</p>
                                                            <p className="text-xs text-gray-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    {getRoleBadge(user.role)}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <Badge className={`${getStatusColor(user.status)} px-2 py-0.5 text-xs font-medium border`}>
                                                        {user.status}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-600">
                                                    {formatDate(user.joinDate)}
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-600">
                                                    {user.completedJobs}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                    
                    {/* Pagination */}
                    {filteredUsers.length > 0 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                            <div className="text-sm text-gray-500">
                                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="font-medium">{filteredUsers.length}</span> results
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(page)}
                                            className={`h-8 w-8 p-0 ${currentPage === page ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
            {/* </ScrollReveal> */}
        </div>
    );
};
