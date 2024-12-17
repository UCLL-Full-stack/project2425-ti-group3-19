import database from './database';

async function seedDatabase() {
    try {
        // Check if the user already exists to avoid duplicate entries
        const existingUser = await database.user.findUnique({
            where: { email: 'john.doe@example.com' },
        });

        if (!existingUser) {
            // Save the new user in the database
            const userPrisma = await database.user.create({
                data: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    password: 'securepassword123',
                    role: 'user',
                },
            });
            console.log('User created:', userPrisma);
        } else {
            console.log('User already exists:', existingUser);
        }
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seedDatabase();