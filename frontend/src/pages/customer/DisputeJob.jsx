import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { jobsAPI } from '../../lib/api';
import { ROUTES } from '../../lib/constants';
import { toast } from 'react-hot-toast';

export const DisputeJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await jobsAPI.dispute(id, { reason, description });
            toast.success('Report submitted successfully');
            navigate(ROUTES.CUSTOMER_JOB_DETAILS(id));
        } catch (error) {
            console.error('Error submitting dispute:', error);
            toast.error('Failed to submit report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Report a Problem</h1>
                <p className="text-gray-600 mt-1">Please describe the issue with this job or provider</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Dispute Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason for Dispute</Label>
                            <Select onValueChange={setReason} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a reason" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="not_completed">Work not completed</SelectItem>
                                    <SelectItem value="poor_quality">Poor quality of work</SelectItem>
                                    <SelectItem value="provider_no_show">Provider did not show up</SelectItem>
                                    <SelectItem value="payment_issue">Payment issue</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Please provide more details about the issue..."
                                className="min-h-[150px]"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(ROUTES.CUSTOMER_JOB_DETAILS(id))}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                variant="destructive"
                                disabled={loading || !reason}
                            >
                                {loading ? 'Submitting...' : 'Submit Report'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
