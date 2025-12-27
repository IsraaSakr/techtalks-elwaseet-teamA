import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Info } from 'lucide-react';

export const TestCredentials = () => {
    const accounts = [
        { role: 'Customer', email: 'customer@test.com', password: 'Test123!' },
        { role: 'Provider', email: 'provider@test.com', password: 'Test123!' },
        { role: 'Hybrid (Customer + Provider)', email: 'hybrid@test.com', password: 'Test123!' },
        { role: 'Admin', email: 'admin@test.com', password: 'Test123!' },
    ];

    return (
        <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-900">Test Accounts Available</AlertTitle>
            <AlertDescription className="mt-2">
                <p className="text-sm text-blue-800 mb-2">Use these credentials to test different user roles:</p>
                <div className="space-y-2">
                    {accounts.map((account, index) => (
                        <div key={index} className="bg-white rounded p-2 text-sm">
                            <p className="font-semibold text-blue-900">{account.role}</p>
                            <p className="text-gray-700">Email: <code className="bg-gray-100 px-1 rounded">{account.email}</code></p>
                            <p className="text-gray-700">Password: <code className="bg-gray-100 px-1 rounded">{account.password}</code></p>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-blue-700 mt-3">
                    💡 For OTP verification, enter any 6-digit code (e.g., 123456)
                </p>
            </AlertDescription>
        </Alert>
    );
};
