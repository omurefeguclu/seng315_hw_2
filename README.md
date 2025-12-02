# Populate this:
- app/api -> API Layer -> API endpoints
- layers/data-access -> Data Access Layer (Handled by Prisma ORM)
- layers/business -> Business Layer (Makes Data Access and generates exposed business services)
- layes/messaging -> Messaging Layer (Provides services for producing and consuming messages through a messagebus)
- lib/prisma -> All prisma generated files and configured singleton prisma client access
- lib/redis-> Configured singleton redis client access

