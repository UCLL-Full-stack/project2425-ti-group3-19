import React from 'react';
// components/UserInfo.tsx
import { User } from '@/types';

interface UserInfoProps {
    user: User | null;
}

const UserInfo = ({ user }: UserInfoProps) => {
    if (!user) {
        return <div className="alert alert-warning">User data is not available.</div>;
    }

    console.log(user.email); // Debugging line to check the value


    return (
        <div className="card p-4 shadow-sm mb-4">
            <h3 className="mb-3">Welcome, {user.firstName} {user.lastName}</h3>
            <div className="row">
                <div className="col-md-6">
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
