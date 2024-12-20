
// components/UserTable.tsx
import { User } from '@/types';

interface UserTableProps {
  users: User[];
  loading: boolean;
  role: string | null;
  handleRoleChange: (userId: number, newRole: string) => void;
}

const UserTable = ({ users, loading, role, handleRoleChange }: UserTableProps) => {
  if (users.length === 0) {
    return <div className="alert alert-info mt-4">No users available.</div>;
  }

  return (
    <table className="table table-bordered table-hover mt-4">
      <thead>
        <tr>
          <th>User ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{`${user.firstName} ${user.lastName}`}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
            <td>
              <select
                value={user.role}
                onChange={(e) => {if(user.id !== undefined){handleRoleChange(user.id, e.target.value)}}}
                disabled={loading || role !== 'admin'}
                className="form-select"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
