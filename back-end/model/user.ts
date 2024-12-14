import { User as PrismaUser } from '@prisma/client';
import { Role } from '../types';

export class User {
    readonly id?: number;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly password: string;
    readonly role: Role;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    constructor(user: {
        id?: number;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role?: Role;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.validate(user);
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role ?? 'user';
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }

    getId(): number | undefined {
        return this.id;
    }

    getFirstName(): string {
        return this.firstName;
    }

    getLastName(): string {
        return this.lastName;
    }

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    getRole(): Role {
        return this.role;
    }

    validate(user: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }) {
        if (!user.firstName?.trim()) {
            throw new Error('First name is required');
        }
        if (!user.lastName?.trim()) {
            throw new Error('Last name is required');
        }
        if (!user.email?.trim()) {
            throw new Error('Email is required');
        }
        if (!user.password?.trim()) {
            throw new Error('Password is required');
        }
    }

    equals(user: User): boolean {
        return (
            this.id === user.id &&
            this.firstName === user.firstName &&
            this.lastName === user.lastName &&
            this.email === user.email &&
            this.password === user.password &&
            this.role === user.role &&
            this.createdAt === user.createdAt &&
            this.updatedAt === user.updatedAt
        );
    }

    static from({
        id,
        firstName,
        lastName,
        email,
        password,
        role,
        createdAt,
        updatedAt,
    }: PrismaUser): User {
        return new User({
            id,
            firstName,
            lastName,
            email,
            password,
            role,
            createdAt,
            updatedAt,
        });
    }
}