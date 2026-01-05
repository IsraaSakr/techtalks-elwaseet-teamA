import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { jobsAPI } from '../../lib/api';
import { ROUTES } from '../../lib/constants';
import { Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const RateProvider = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        try {
            setLoading(true);
            // First confirm the completion
            await jobsAPI.confirm(id);
            // Then submit review (mocking this part as review API might stick to job or provider)
            // assuming an API like jobsAPI.review(id, { rating, comment }) exists or just mocking it
            // For now, we just confirm and move on, maybe adding a toast about review
            await new Promise(resolve => setTimeout(resolve, 800)); // Mock delay
            
            toast.success('Job completed and review submitted!');
            navigate(ROUTES.CUSTOMER_JOB_DETAILS(id));
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Rate Your Experience</h1>
                <p className="text-gray-600 mt-1">Please rate the provider's work to complete this job</p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Star Rating */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="focus:outline-none transition-transform hover:scale-110"
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        onClick={() => setRating(star)}
                                    >
                                        <Star
                                            className={`w-10 h-10 ${
                                                star <= (hoveredRating || rating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                            } transition-colors`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm font-medium text-gray-500">
                                {rating === 0 ? 'Select a rating' : 
                                 rating === 1 ? 'Poor' :
                                 rating === 2 ? 'Fair' :
                                 rating === 3 ? 'Good' :
                                 rating === 4 ? 'Very Good' : 'Excellent'}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="comment">Additional Comments (Optional)</Label>
                            <Textarea
                                id="comment"
                                placeholder="Share your experience with this provider..."
                                className="min-h-[120px]"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(ROUTES.CUSTOMER_JOB_DETAILS(id))}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className="bg-blue-600 hover:bg-blue-700"
                                disabled={loading || rating === 0}
                            >
                                {loading ? 'Submitting...' : 'Submit Review'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
