import { SERVICE_CATEGORIES, JOB_STATUS, USER_ROLES } from './constants';

const NAMES = [
    'John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson', 
    'Jennifer Garcia', 'James Martinez', 'Maria Rodriguez', 'Robert Hernandez', 'Lisa Lopez',
    'William Gonzalez', 'Elizabeth Perez', 'Richard Sanchez', 'Karen Clark', 'Joseph Lewis',
    'Jessica Robinson', 'Thomas Walker', 'Susan Hall', 'Charles Allen', 'Margaret Young'
];

const LOCATIONS = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
    'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
    'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC'
];

const DESCRIPTIONS = [
    "I need help with a quick fix.", "Looking for a professional for a large project.",
    "Urgent requirement, please apply if available immediately.", "Need regular maintenance service.",
    "Renovation project starting next week."
];

// Helper to get random item from array
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// --- Data Generators ---

export const generateUsers = (count = 60) => {
    return Array.from({ length: count }).map((_, i) => {
        const isProvider = Math.random() > 0.5;
        const role = isProvider ? USER_ROLES.PROVIDER : USER_ROLES.CUSTOMER;
        const name = getRandom(NAMES);
        
        return {
            id: `user-${i + 1}`,
            name: `${name} ${i + 1}`,
            email: `user${i + 1}@example.com`,
            role: role,
            status: Math.random() > 0.9 ? 'SUSPENDED' : 'ACTIVE',
            joinDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
            isVerified: true, // For Auth
            // Provider specific
            rating: isProvider ? (3 + Math.random() * 2).toFixed(1) : null,
            jobsCompleted: isProvider ? Math.floor(Math.random() * 50) : null,
            totalEarned: isProvider ? Math.floor(Math.random() * 5000) : null,
            services: isProvider ? [getRandom(SERVICE_CATEGORIES), getRandom(SERVICE_CATEGORIES)] : [],
            bio: isProvider ? `Experienced ${getRandom(SERVICE_CATEGORIES)} specialist.` : null,
            profilePicture: `https://api.dicebear.com/7.x/initials/svg?seed=${name}${i}`,
            reviewsCount: isProvider ? Math.floor(Math.random() * 100) : null,
            // Customer specific
            projectsPosted: !isProvider ? Math.floor(Math.random() * 20) : null,
            totalSpent: !isProvider ? Math.floor(Math.random() * 5000) : null,
            location: getRandom(LOCATIONS),
            phone: `555-01${String(i).padStart(2, '0')}`
        };
    });
};

export const mockUsers = generateUsers(60); // Array format
export const mockProviders = mockUsers.filter(u => u.role === USER_ROLES.PROVIDER).map(u => ({
    ...u,
    fullName: u.name,
}));

const predefinedJobs = [
    {
        id: 'job-test-1',
        title: 'Need a Logo Design for Startup',
        description: 'I am launching a new tech startup and need a modern, minimalist logo. Please provide 3 variations.',
        customerId: 'test-customer',
        customerName: 'Customer User',
        customer: 'Customer User',
        status: 'OPEN',
        category: 'Graphic Design',
        location: 'Remote',
        budgetMin: 100,
        budgetMax: 300,
        amount: 250,
        postedDate: new Date().toISOString(),
        date: new Date().toISOString(),
        proposalsCount: 5,
        image: 'https://source.unsplash.com/random/800x600/?design'
    },
    {
        id: 'job-test-2',
        title: 'Fix React App Performance Issues',
        description: 'My React application is rendering slowly on mobile. Need an expert to profile and optimize it.',
        customerId: 'test-customer',
        customerName: 'Customer User',
        customer: 'Customer User',
        providerId: 'test-provider',
        providerName: 'Provider User',
        provider: 'Provider User',
        status: 'IN_PROGRESS',
        category: 'Web Development',
        location: 'Remote',
        budgetMin: 500,
        budgetMax: 1000,
        amount: 800,
        postedDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        date: new Date(Date.now() - 86400000 * 5).toISOString(),
        proposalsCount: 2,
        image: 'https://source.unsplash.com/random/800x600/?code'
    },
    {
        id: 'job-test-3',
        title: 'House Cleaning - 3 Bedroom',
        description: 'Deep cleaning required for a 3 bedroom apartment in downtown.',
        customerId: 'test-customer',
        customerName: 'Customer User',
        customer: 'Customer User',
        providerId: 'user-5',
        providerName: 'Sarah Johnson 5',
        provider: 'Sarah Johnson 5',
        status: 'COMPLETED',
        category: 'Cleaning',
        location: 'New York, NY',
        budgetMin: 150,
        budgetMax: 200,
        amount: 180,
        postedDate: new Date(Date.now() - 86400000 * 20).toISOString(),
        date: new Date(Date.now() - 86400000 * 20).toISOString(),
        proposalsCount: 8,
        image: 'https://source.unsplash.com/random/800x600/?cleaning'
    },
    {
        id: 'job-test-4',
        title: 'Garden Maintenance',
        description: 'Regular lawn mowing and hedge trimming for a small garden.',
        customerId: 'test-customer',
        customerName: 'Customer User',
        customer: 'Customer User',
        providerId: 'user-8',
        providerName: 'Mike Wilson',
        provider: 'Mike Wilson',
        status: 'CONFIRMED',
        category: 'Landscaping',
        location: 'New York, NY',
        budgetMin: 80,
        budgetMax: 120,
        amount: 100,
        postedDate: new Date(Date.now() - 86400000 * 40).toISOString(),
        date: new Date(Date.now() - 86400000 * 40).toISOString(),
        proposalsCount: 3,
        image: 'https://source.unsplash.com/random/800x600/?garden'
    },
    {
        id: 'job-test-5',
        title: 'Test Job for Rejection',
        description: 'This is a test job specifically created to try out the Reject/Report Problem flow.',
        customerId: 'test-customer',
        customerName: 'Customer User',
        customer: 'Customer User',
        providerId: 'user-9',
        providerName: 'Test Provider A',
        provider: 'Test Provider A',
        status: 'COMPLETED',
        category: 'Testing',
        location: 'Remote',
        budgetMin: 50,
        budgetMax: 100,
        amount: 75,
        postedDate: new Date().toISOString(),
        date: new Date().toISOString(),
        proposalsCount: 1,
        image: 'https://source.unsplash.com/random/800x600/?abstract'
    },
    {
        id: 'job-test-6',
        title: 'Test Job for Confirmation',
        description: 'This is a test job specifically created to try out the Confirm & Rate flow.',
        customerId: 'test-customer',
        customerName: 'Customer User',
        customer: 'Customer User',
        providerId: 'user-10',
        providerName: 'Test Provider B',
        provider: 'Test Provider B',
        status: 'COMPLETED',
        category: 'Testing',
        location: 'Remote',
        budgetMin: 150,
        budgetMax: 200,
        amount: 180,
        postedDate: new Date().toISOString(),
        date: new Date().toISOString(),
        proposalsCount: 1,
        image: 'https://source.unsplash.com/random/800x600/?technology'
    }
];

export const generateJobs = (count = 60) => {
    const randomJobs = Array.from({ length: count }).map((_, i) => {
        const customer = getRandom(mockUsers.filter(u => u.role === USER_ROLES.CUSTOMER));
        const provider = Math.random() > 0.3 ? getRandom(mockUsers.filter(u => u.role === USER_ROLES.PROVIDER)) : null;
        const status = provider ? (Math.random() > 0.5 ? 'COMPLETED' : 'IN_PROGRESS') : JOB_STATUS.OPEN;
        const category = getRandom(SERVICE_CATEGORIES);

        return {
            id: `job-${i + 1}`,
            title: `${category} Service Request #${i + 1}`,
            description: getRandom(DESCRIPTIONS),
            customerId: customer.id,
            customerName: customer.name,
            customer: customer.name,
            providerId: provider?.id,
            providerName: provider?.name,
            provider: provider?.name || 'Unassigned',
            status: status,
            category: category,
            location: getRandom(LOCATIONS),
            budgetMin: Math.floor(Math.random() * 100) + 50,
            budgetMax: Math.floor(Math.random() * 500) + 200,
            amount: Math.floor(Math.random() * 400) + 100,
            postedDate: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString(),
            date: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString(),
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString(), // Added for compatibility
            proposalsCount: Math.floor(Math.random() * 10),
            image: `https://source.unsplash.com/random/800x600/?${category.split(' ')[0]}`,
        };
    });

    return [...predefinedJobs, ...randomJobs];
};

export const mockJobs = generateJobs(60);

export const generateTransactions = (count = 60) => {
    return Array.from({ length: count }).map((_, i) => {
        const isPayment = Math.random() > 0.5;
        const status = Math.random() > 0.8 ? 'pending' : 'completed';
        const job = getRandom(mockJobs);
        
        return {
            id: `txn-${1000 + i}`,
            type: isPayment ? 'payment' : 'earning',
            amount: Math.floor(Math.random() * 500) + 50,
            description: `${isPayment ? 'Payment' : 'Earning'} for ${job.title}`,
            date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
            status: status,
            jobId: job.id,
            userId: isPayment ? job.customerId : job.providerId,
            reference: `REF-${Math.floor(Math.random() * 100000)}`
        };
    }); 
};

export const mockTransactions = generateTransactions(60);

export const generateDisputes = (count = 60) => {
    return Array.from({ length: count }).map((_, i) => {
        const job = getRandom(mockJobs);
        
        return {
            id: `dispute-${i + 1}`,
            jobId: job.id,
            jobTitle: job.title,
            customerId: job.customerId,
            customerName: job.customerName,
            providerId: job.providerId || 'prov-unknown',
            providerName: job.providerName || 'Unknown Provider',
            amount: job.amount,
            reason: getRandom(['Work not completed', 'Poor quality', 'Provider no-show', 'Payment issue']),
            description: 'The service provided did not meet the agreed standards.',
            status: getRandom(['PENDING', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED']),
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 2000000000)).toISOString(),
        };
    });
};

export const mockDisputes = generateDisputes(60);

// --- Auth Helpers & API Compatibility (Restored) ---

export const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const MOCK_USERS = mockUsers.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
}, {});

// Add a predictable test user
MOCK_USERS['test-admin'] = {
    id: 'test-admin',
    email: 'admin@example.com',
    password: 'password', // In real app, never store plain text
    name: 'Admin User',
    role: USER_ROLES.ADMIN,
    isVerified: true
};

MOCK_USERS['test-customer'] = {
    id: 'test-customer',
    email: 'customer@example.com',
    password: 'password',
    name: 'Customer User',
    role: USER_ROLES.CUSTOMER,
    isVerified: true
};

MOCK_USERS['test-provider'] = {
    id: 'test-provider',
    email: 'provider@example.com',
    password: 'password',
    name: 'Provider User',
    role: USER_ROLES.PROVIDER,
    isVerified: true
};

export const MOCK_JOBS = mockJobs;

// Generate basic applications based on jobs
export const MOCK_APPLICATIONS = mockJobs.flatMap(job => {
    if (job.status === JOB_STATUS.OPEN && Math.random() > 0.5) {
        return Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, i) => ({
            id: `app-${job.id}-${i}`,
            jobId: job.id,
            providerId: getRandom(mockUsers.filter(u => u.role === USER_ROLES.PROVIDER)).id,
            status: 'PENDING',
            coverLetter: 'I am interested in this job and have the required skills.',
            price: job.budgetMin + 50,
            createdAt: new Date().toISOString()
        }));
    }
    return [];
});

export const MOCK_NOTIFICATIONS = [];

export const mockLogin = async (email, password) => {
    await mockDelay();
    const user = Object.values(MOCK_USERS).find(u => u.email === email);
    
    if (user && (user.password === password || password === 'password')) { // Simple password check
        const { password: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token: 'mock-jwt-token-' + Date.now(),
        };
    }
    throw { message: 'Invalid credentials' };
};

export const mockVerifyOTP = async (email, otp) => {
    await mockDelay();
    const user = Object.values(MOCK_USERS).find(u => u.email === email);
    if (!user) throw { message: 'User not found' };
    
    if (otp === '123456') {
        const { password: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token: 'mock-jwt-token-' + Date.now(),
        };
    }
    throw { message: 'Invalid OTP' };
};