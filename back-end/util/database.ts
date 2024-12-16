import { PrismaClient } from '@prisma/client';

const database = new PrismaClient();

async function seedDatabase() {
    try {
        // Check if the user already exists to avoid duplicate entries
        const existingUser = await database.user.findUnique({
            where: { email: 'wiebe.delvaux@gmail.com' },
        });

        if (!existingUser) {
            // Create the dummy user
            await database.user.create({
                data: {
                    id: 1,
                    firstName: 'Wiebe',
                    lastName: 'Delvaux',
                    email: 'wiebe.delvaux@gmail.com',
                    password: 'test1',
                    role: 'admin',
                },
            });
            console.log('Dummy user created successfully.');
        } else {
            console.log('Dummy user already exists.');
        }
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await database.$disconnect();
    }
}

// Call the seed function
seedDatabase();

export default database;
