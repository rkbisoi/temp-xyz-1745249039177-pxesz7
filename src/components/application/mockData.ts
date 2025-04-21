// src/data/mockData.ts
import { ApplicationData } from './interface';

export const applicationData: ApplicationData = {
    name: "Customer Portal Backend",
    description: "Backend API services for the customer portal application",
    createdAt: "2024-12-10",
    lastModified: "2025-04-02",
    totalProjects: 12,
    apiEndpoints: 47,
    routes: 36,
    environments: ["Development", "Staging", "Production"],
    languages: ["TypeScript", "Python", "Java"],
    testStats: {
        total: 324,
        passed: 278,
        failed: 32,
        skipped: 14
    },
    coverageData: [
        { name: 'API Coverage', value: 86 },
        { name: 'UI Coverage', value: 74 },
        { name: 'Integration Coverage', value: 65 },
        { name: 'E2E Coverage', value: 58 }
    ],
    aiInsights: [
        "Test coverage for payment processing endpoints is lower than average",
        "Authentication workflows have 23% more failures than other areas",
        "Consider adding more test cases for error handling scenarios",
        "Performance testing shows latency issues in the '/api/reports' endpoint"
    ],
    recentActivity: [
        { type: "test", name: "API Authentication Tests", status: "passed", time: "2 hours ago" },
        { type: "project", name: "Mobile API Integration", status: "updated", time: "5 hours ago" },
        { type: "test", name: "Payment Processing Flow", status: "failed", time: "yesterday" },
        { type: "script", name: "Data Seeding Script", status: "created", time: "2 days ago" }
    ],
    projects: [
        { id: 1, name: "API Testing", type: "API", testsCount: 156, passRate: 92, lastRun: "2025-04-12", owner: "Sarah Kim" },
        { id: 2, name: "UI Testing", type: "UI", testsCount: 82, passRate: 86, lastRun: "2025-04-10", owner: "Michael Chen" },
        { id: 3, name: "Performance Testing", type: "Performance", testsCount: 24, passRate: 79, lastRun: "2025-04-05", owner: "James Wilson" },
        { id: 4, name: "Security Tests", type: "Security", testsCount: 62, passRate: 84, lastRun: "2025-04-08", owner: "Priya Sharma" },
        { id: 5, name: "Integration Tests", type: "Integration", testsCount: 42, passRate: 88, lastRun: "2025-04-09", owner: "David Lopez" },
        { id: 6, name: "Regression Suite", type: "Regression", testsCount: 124, passRate: 91, lastRun: "2025-04-07", owner: "Emma Johnson" },
        { id: 7, name: "Load Testing", type: "Performance", testsCount: 18, passRate: 83, lastRun: "2025-04-03", owner: "Omar Patel" },
        { id: 8, name: "Mobile API Tests", type: "API", testsCount: 56, passRate: 95, lastRun: "2025-04-11", owner: "Sophia Rodriguez" }
    ],
    apis: [
        { id: 1, path: "/api/users", method: "GET", description: "Retrieve users", testCoverage: 94, responseTime: 120, authRequired: true },
        { id: 2, path: "/api/auth/login", method: "POST", description: "User authentication", testCoverage: 97, responseTime: 150, authRequired: false },
        { id: 3, path: "/api/products", method: "GET", description: "List products", testCoverage: 88, responseTime: 200, authRequired: true },
        { id: 4, path: "/api/orders", method: "POST", description: "Create order", testCoverage: 92, responseTime: 180, authRequired: true },
        { id: 5, path: "/api/reports", method: "GET", description: "Generate reports", testCoverage: 75, responseTime: 350, authRequired: true },
        { id: 6, path: "/api/payments", method: "POST", description: "Process payment", testCoverage: 89, responseTime: 240, authRequired: true },
        { id: 7, path: "/api/cart", method: "GET", description: "Get cart items", testCoverage: 92, responseTime: 130, authRequired: true },
        { id: 8, path: "/api/cart", method: "PUT", description: "Update cart", testCoverage: 87, responseTime: 160, authRequired: true },
        { id: 9, path: "/api/notifications", method: "POST", description: "Send notification", testCoverage: 72, responseTime: 110, authRequired: true },
        { id: 10, path: "/api/auth/logout", method: "POST", description: "User logout", testCoverage: 95, responseTime: 90, authRequired: true }
    ],
    deployments: [
        { id: 1, environment: "Development", version: "2.4.1", status: "deployed", deployedAt: "2025-04-10", deployedBy: "CI/CD Pipeline" },
        { id: 2, environment: "Staging", version: "2.3.8", status: "deployed", deployedAt: "2025-04-02", deployedBy: "Emma Johnson" },
        { id: 3, environment: "Production", version: "2.3.5", status: "deployed", deployedAt: "2025-03-27", deployedBy: "Release Manager" }
    ]
};

export const testHistoryData = [
    { date: 'Apr 7', passed: 245, failed: 42, skipped: 12 },
    { date: 'Apr 8', passed: 256, failed: 38, skipped: 10 },
    { date: 'Apr 9', passed: 262, failed: 32, skipped: 11 },
    { date: 'Apr 10', passed: 270, failed: 28, skipped: 9 },
    { date: 'Apr 11', passed: 273, failed: 25, skipped: 12 },
    { date: 'Apr 12', passed: 278, failed: 32, skipped: 14 }
];

export const logEntries = [
    { timestamp: "2025-04-14 09:12:53", level: "INFO", message: "Test suite 'API Authentication' started", source: "test-runner" },
    { timestamp: "2025-04-14 09:12:54", level: "INFO", message: "Test case 'Valid login credentials' passed", source: "test-runner" },
    { timestamp: "2025-04-14 09:12:55", level: "INFO", message: "Test case 'Remember me functionality' passed", source: "test-runner" },
    { timestamp: "2025-04-14 09:12:56", level: "INFO", message: "Test case 'Password reset flow' passed", source: "test-runner" },
    { timestamp: "2025-04-14 09:12:57", level: "WARNING", message: "Test case 'Rate limiting' - Slow response detected (2.3s)", source: "test-runner" },
    { timestamp: "2025-04-14 09:12:58", level: "INFO", message: "Test suite 'API Authentication' completed", source: "test-runner" },
    { timestamp: "2025-04-14 09:13:00", level: "INFO", message: "Test suite 'Payment Processing' started", source: "test-runner" },
    { timestamp: "2025-04-14 09:13:01", level: "INFO", message: "Test case 'Credit card payment' passed", source: "test-runner" },
    { timestamp: "2025-04-14 09:13:02", level: "ERROR", message: "Test case 'PayPal integration' failed: Timeout waiting for PayPal API response", source: "test-runner" },
    { timestamp: "2025-04-14 09:13:03", level: "ERROR", message: "Stack trace: TimeoutError: Promise timed out after 5000ms", source: "test-runner", stackTrace: "at PaymentService.processPayPalPayment (/src/services/payment.ts:128:23)\nat PaymentController.handlePayment (/src/controllers/payment.ts:45:19)" },
    { timestamp: "2025-04-14 09:13:04", level: "WARNING", message: "Test case 'Refund process' - Flaky test detected, passed on retry", source: "test-runner" },
    { timestamp: "2025-04-14 09:13:05", level: "INFO", message: "Test suite 'Payment Processing' completed", source: "test-runner" }
];