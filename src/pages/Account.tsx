import React from "react";
import { Card } from "../components/ui";

const Account: React.FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Account Settings</h1>
      <Card>Profile, security, notifications, payment settings.</Card>
    </div>
  );
};
export default Account;
