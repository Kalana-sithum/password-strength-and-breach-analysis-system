import { AdminSideBar } from "../../components";
import { Flex } from "@mantine/core";

const AdminDashboard: React.FC = () => {
  return (
    <Flex
      gap="xs"
      justify="flex-start"
      align="flex-start"
      direction="row"
      wrap="wrap"
      style={{ height: "100vh" }}
    >
      <AdminSideBar />
      <h1>Admin Dashboard</h1>
    </Flex>
  );
};

export default AdminDashboard;
