  import app from "./app";
  import { connectDb } from "./Database/ConnectDb";
  import { PORT } from "./configs/env.config"
  import http from 'http';
  import { usersChat } from "./socket/socket";
  const server=http.createServer(app);
  import { FRONTEND_URL } from "./configs/env.config";
  usersChat(server,FRONTEND_URL);
server.listen(PORT, async() => { 
  console.log(`Server running on http://localhost:${PORT}`);
  await connectDb();
});


/*
next task is to show file video to usre chat
*/ 