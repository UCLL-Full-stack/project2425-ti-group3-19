import database from './database';

async function seedDatabase() {
    try {

        const usersToCheck = [
            { email: 'john.doe@example.com' },
            { email: 'bart.doe@example.com' },
            { email: 'jef.doe@example.com' }
        ];
        
        const existingUser = await database.user.findUnique({
            where: { email: 'john.doe@example.com' },
        });

        const existingMod = await database.user.findUnique({
            where: { email: 'bart.doe@example.com' },
        });

        const existingAdmin = await database.user.findUnique({
            where: { email: 'jef.doe@example.com' },
        });

        if (!existingUser) {
            // Save the new user in the database
            const userPrisma = await database.user.create({
                data: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    password: '$2b$12$zX2tuOs2HTzP76LNV9Lt8.7EDmqLOdSPyIzlBMg1ZynO5ILrrknCi',
                    role: 'user',
                },
            });
            console.log('User created:', userPrisma);
        }
        if (!existingMod) {
            const moderatorPrisma = await database.user.create({
                data: {
                    firstName: 'bart',
                    lastName: 'Doe',
                    email: 'bart.doe@example.com',
                    password: '$2b$12$zX2tuOs2HTzP76LNV9Lt8.7EDmqLOdSPyIzlBMg1ZynO5ILrrknCi',
                    role: 'admin',
                },
            });
            console.log('User created:', moderatorPrisma);
        }
        if (!existingAdmin) {
            const adminPrisma = await database.user.create({
                data: {
                    firstName: 'jef',
                    lastName: 'Doe',
                    email: 'jef.doe@example.com',
                    password: '$2b$12$zX2tuOs2HTzP76LNV9Lt8.7EDmqLOdSPyIzlBMg1ZynO5ILrrknCi',
                    role: 'admin',
                },
            });
            console.log('User created:', adminPrisma);
        }

        const addPromo = await database.promotion.create({
            data: {
                Code: 'Promo1',
                IsActive: true,
                DiscountAmount: 10,
            },
        });

    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seedDatabase();