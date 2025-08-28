import express, { Request, Response } from "express";


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const baseRoute = '/api/v1/';

app.get(baseRoute, (req: Request, res: Response) => {
  res.send({
    greeting: "top"
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
