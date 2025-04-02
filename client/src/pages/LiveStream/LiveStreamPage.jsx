import { Grid } from "@mui/material";
import LiveStreamCard from "./LiveStreamCard";
import LiveStreamContainer from "./LiveStreamContainer";

const LiveStreamGrid = ({ users }) => {
  return (
    <Grid container spacing={3} justifyContent="center" padding={2}>
      <Grid item>
        <LiveStreamCard />
      </Grid>
    </Grid>
  );
};

// Dummy data
const users = [
  { id: 1, name: "User 1" },
  { id: 2, name: "User 2" },
  { id: 3, name: "User 3" },
  { id: 4, name: "User 4" },
];

export default function LiveStreamPage() {
  return (
    <Grid container>
      {/* Sidebar */}
      <Grid
        item
        flex={2}
        sx={{ overflow: "auto" }}
        display={{ xs: "none", md: "block" }}
      ></Grid>

      {/* Nội dung chính */}
      <Grid
        item
        flex={5}
        sx={{
          mt: 12,
          mr: 12,
          height: "100%",
          overflow: "auto",
          // borderLeft: "1px solid lightgrey",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* <LiveStreamGrid users={users} /> */}
        <LiveStreamContainer />
      </Grid>
    </Grid>
  );
}
