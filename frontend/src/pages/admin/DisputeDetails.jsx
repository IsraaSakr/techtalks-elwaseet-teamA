import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, DollarSign, Calendar, User, CheckCircle, XCircle, AlertCircle, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';
import { ROUTES } from '../../lib/constants';
import ScrollReveal from '../../components/ui/ScrollReveal';

export const DisputeDetails = () => {
    // const { id } = useParams();
    const navigate = useNavigate();

    // Mock dispute data
    const [dispute] = useState({
        id: 'dispute-001',
        jobId: 'job-002',
        jobTitle: 'House cleaning service',
        jobDescription: 'Need deep cleaning for 3-bedroom apartment. The service usually includes vacuuming floors, cleaning bathrooms, wiping surfaces, and kitchen deep clean.',
        customerId: 'cust-001',
        customerName: 'John Customer',
        customerEmail: 'customer@test.com',
        providerId: 'prov-001',
        providerName: 'Sarah Provider',
        providerEmail: 'provider@test.com',
        amount: 200,
        reason: 'Work not completed as agreed',
        description: 'The provider did not clean the bathrooms as specified in the job description. Only the living room and kitchen were cleaned properly. I have attached photos showing the state of the bathrooms.',
        customerEvidence: 'bathroom_mess_1.jpg, bathroom_mess_2.jpg',
        providerResponse: 'Customer was not available for the full scheduled time. Only had 2 hours instead of agreed 4 hours to complete the work. I did my best within the allowed timeframe.',
        status: 'PENDING',
        createdAt: '2024-12-03T10:00:00Z',
    });

    const [resolution, setResolution] = useState('');
    const [decision, setDecision] = useState('');
    const [resolving, setResolving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleResolve = async () => {
        if (!decision || !resolution.trim()) {
            return;
        }

        setResolving(true);

        try {
            // TODO: Implement actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccessMessage('Dispute resolved successfully!');

            setTimeout(() => {
                navigate(ROUTES.ADMIN_DISPUTES);
            }, 2000);
        } catch (error) {
            console.error('Error resolving dispute:', error);
        } finally {
            setResolving(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'UNDER_REVIEW':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'RESOLVED':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <ScrollReveal>
                <div className="flex flex-col gap-4">
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate(ROUTES.ADMIN_DISPUTES)}
                        className="w-fit -ml-2 text-gray-500 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Disputes
                    </Button>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dispute Details</h1>
                            <p className="text-gray-600 mt-1 flex items-center gap-2">
                                ID: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-sm">{dispute.id}</span>
                            </p>
                        </div>
                        <Badge className={`${getStatusColor(dispute.status)} px-4 py-1.5 text-sm`}>
                            {dispute.status.replace('_', ' ')}
                        </Badge>
                    </div>
                </div>
            </ScrollReveal>

            {successMessage && (
                <ScrollReveal>
                    <Alert className="bg-green-50 border-green-200 shadow-sm mb-6">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 font-medium">{successMessage}</AlertDescription>
                    </Alert>
                </ScrollReveal>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Job Information */}
                    <ScrollReveal delay={0.1}>
                        <Card className="shadow-md border-none overflow-hidden">
                            <CardHeader className="bg-gray-50/50 border-b pb-4">
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                                    Job Context
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-xl">{dispute.jobTitle}</h3>
                                    <p className="text-gray-600 mt-2 leading-relaxed">{dispute.jobDescription}</p>
                                </div>
                                
                                <div className="flex flex-wrap gap-6 pt-6 border-t border-gray-100">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                                        <DollarSign className="w-5 h-5 text-green-600" />
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Amount</p>
                                            <p className="font-bold text-gray-900">{formatCurrency(dispute.amount)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Filed Date</p>
                                            <p className="font-bold text-gray-900">{formatDate(dispute.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </ScrollReveal>

                    {/* Dispute Information */}
                    <ScrollReveal delay={0.2}>
                        <Card className="shadow-md border-none overflow-hidden">
                            <CardHeader className="bg-gray-50/50 border-b pb-4">
                                <CardTitle className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                    Dispute Statements
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                                            <span className="w-2 h-2 rounded-full bg-red-500" />
                                            Reason
                                        </h4>
                                        <div className="bg-red-50/50 p-4 rounded-lg border border-red-100 text-red-800 font-medium">
                                            {dispute.reason}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                                            <span className="w-2 h-2 rounded-full bg-gray-400" />
                                            Customer's Complaint
                                        </h4>
                                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            "{dispute.description}"
                                        </p>
                                        {dispute.customerEvidence && (
                                            <div className="mt-4 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg w-fit">
                                                <ImageIcon className="w-4 h-4" />
                                                <span className="font-medium">Evidence Attached:</span>
                                                <span className="italic text-blue-800">{dispute.customerEvidence}</span>
                                            </div>
                                        )}
                                    </div>

                                    {dispute.providerResponse && (
                                        <div className="pt-6 border-t border-gray-100">
                                            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                                                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                                                Provider's Response
                                            </h4>
                                            <p className="text-gray-700 leading-relaxed bg-indigo-50/30 p-4 rounded-lg border border-indigo-100">
                                                "{dispute.providerResponse}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </ScrollReveal>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                     {/* Parties Involved */}
                     <ScrollReveal delay={0.3}>
                        <Card className="shadow-md border-none overflow-hidden">
                            <CardHeader className="bg-gray-50/50 border-b pb-4">
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-gray-600" />
                                    Involved Parties
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 divide-y divide-gray-100">
                                <div className="p-5">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Customer</p>
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                            {dispute.customerName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{dispute.customerName}</p>
                                            <p className="text-sm text-gray-500">{dispute.customerEmail}</p>
                                            <p className="text-xs text-gray-400 mt-1 font-mono">{dispute.customerId}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Provider</p>
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">
                                            {dispute.providerName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{dispute.providerName}</p>
                                            <p className="text-sm text-gray-500">{dispute.providerEmail}</p>
                                            <p className="text-xs text-gray-400 mt-1 font-mono">{dispute.providerId}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </ScrollReveal>

                    {/* Resolution Section */}
                    {dispute.status !== 'RESOLVED' && (
                        <ScrollReveal delay={0.4}>
                            <Card className="shadow-xl border-t-4 border-t-indigo-600">
                                <CardHeader>
                                    <CardTitle>Resolve Dispute</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="decision" className="font-medium">Final Decision</Label>
                                        <Select value={decision} onValueChange={setDecision} disabled={resolving}>
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Select outcome..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="FAVOR_CUSTOMER">
                                                    <div className="flex items-center gap-2 font-medium">
                                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                                        <span>Refund Customer</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="FAVOR_PROVIDER">
                                                    <div className="flex items-center gap-2 font-medium">
                                                        <CheckCircle className="w-4 h-4 text-blue-600" />
                                                        <span>Release to Provider</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="PARTIAL_REFUND">
                                                    <div className="flex items-center gap-2 font-medium">
                                                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                                                        <span>Partial Refund</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="DISMISS">
                                                    <div className="flex items-center gap-2 font-medium">
                                                        <XCircle className="w-4 h-4 text-red-600" />
                                                        <span>Dismiss Dispute</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="resolution" className="font-medium">Resolution Official Statement</Label>
                                        <Textarea
                                            id="resolution"
                                            value={resolution}
                                            onChange={(e) => setResolution(e.target.value)}
                                            placeholder="Details of the decision shared with both parties..."
                                            rows={6}
                                            disabled={resolving}
                                            className="resize-none focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => navigate(ROUTES.ADMIN_DISPUTES)}
                                            disabled={resolving}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleResolve}
                                            disabled={!decision || !resolution.trim() || resolving}
                                            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            {resolving ? 'Resolving...' : 'Confirm Resolution'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </ScrollReveal>
                    )}
                </div>
            </div>
        </div>
    );
};
