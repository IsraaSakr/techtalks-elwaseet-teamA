import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, DollarSign, Calendar, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';
import { ROUTES } from '../../lib/constants';

export const DisputeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock dispute data
    const [dispute] = useState({
        id: 'dispute-001',
        jobId: 'job-002',
        jobTitle: 'House cleaning service',
        jobDescription: 'Need deep cleaning for 3-bedroom apartment',
        customerId: 'cust-001',
        customerName: 'John Customer',
        customerEmail: 'customer@test.com',
        providerId: 'prov-001',
        providerName: 'Sarah Provider',
        providerEmail: 'provider@test.com',
        amount: 200,
        reason: 'Work not completed as agreed',
        description: 'The provider did not clean the bathrooms as specified in the job description. Only the living room and kitchen were cleaned.',
        customerEvidence: 'Photos of uncleaned bathrooms attached',
        providerResponse: 'Customer was not available for the full scheduled time. Only had 2 hours instead of agreed 4 hours.',
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
                return 'bg-yellow-100 text-yellow-800';
            case 'UNDER_REVIEW':
                return 'bg-blue-100 text-blue-800';
            case 'RESOLVED':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Back Button */}
            <Button variant="ghost" onClick={() => navigate(ROUTES.ADMIN_DISPUTES)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Disputes
            </Button>

            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dispute Details</h1>
                    <p className="text-gray-600 mt-1">Review and resolve this dispute</p>
                </div>
                <Badge className={getStatusColor(dispute.status)}>
                    {dispute.status.replace('_', ' ')}
                </Badge>
            </div>

            {successMessage && (
                <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
                </Alert>
            )}

            {/* Job Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Job Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{dispute.jobTitle}</h3>
                        <p className="text-gray-600 mt-1">{dispute.jobDescription}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-gray-700">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold">{formatCurrency(dispute.amount)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4" />
                            <span>Disputed {formatDate(dispute.createdAt)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Parties Involved */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Customer
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-semibold text-gray-900">{dispute.customerName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-900">{dispute.customerEmail}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">ID</p>
                            <p className="text-gray-900 font-mono text-sm">{dispute.customerId}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Provider
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-semibold text-gray-900">{dispute.providerName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-900">{dispute.providerEmail}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">ID</p>
                            <p className="text-gray-900 font-mono text-sm">{dispute.providerId}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Dispute Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Dispute Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Reason</h4>
                        <p className="text-gray-700">{dispute.reason}</p>
                    </div>

                    <div className="pt-4 border-t">
                        <h4 className="font-semibold text-gray-900 mb-2">Customer's Complaint</h4>
                        <p className="text-gray-700">{dispute.description}</p>
                        {dispute.customerEvidence && (
                            <p className="text-sm text-gray-500 mt-2 italic">{dispute.customerEvidence}</p>
                        )}
                    </div>

                    {dispute.providerResponse && (
                        <div className="pt-4 border-t">
                            <h4 className="font-semibold text-gray-900 mb-2">Provider's Response</h4>
                            <p className="text-gray-700">{dispute.providerResponse}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Resolution Section */}
            {dispute.status !== 'RESOLVED' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Resolve Dispute</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="decision">Decision *</Label>
                            <Select value={decision} onValueChange={setDecision} disabled={resolving}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a decision" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FAVOR_CUSTOMER">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>In favor of Customer (Refund)</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="FAVOR_PROVIDER">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-blue-600" />
                                            <span>In favor of Provider (Release payment)</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="PARTIAL_REFUND">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                                            <span>Partial Refund (Split amount)</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="DISMISS">
                                        <div className="flex items-center gap-2">
                                            <XCircle className="w-4 h-4 text-red-600" />
                                            <span>Dismiss Dispute</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="resolution">Resolution Notes *</Label>
                            <Textarea
                                id="resolution"
                                value={resolution}
                                onChange={(e) => setResolution(e.target.value)}
                                placeholder="Explain your decision and any actions taken..."
                                rows={6}
                                disabled={resolving}
                            />
                            <p className="text-sm text-gray-500">
                                This will be shared with both parties
                            </p>
                        </div>

                        <div className="flex gap-4 pt-4">
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
                                className="flex-1"
                            >
                                {resolving ? 'Resolving...' : 'Resolve Dispute'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
