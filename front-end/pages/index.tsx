import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Header from "@/components/header";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Train</title>
        <meta name="description" content="Train ticket/subscription" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="container mt-5">
        <h2>User Management</h2>

        <table className="table table-striped mt-4">
          <thead>
            <tr>
              <th>User</th>
              <th>Password</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>john.doe@example.com</td>
              <td>test1</td>
              <td>User</td>
            </tr>
            <tr>
              <td>bart.doe@example.com</td>
              <td>test1</td>
              <td>Moderator</td>
            </tr>
            <tr>
              <td>jef.doe@example.com</td>
              <td>test1</td>
              <td>Admin</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
