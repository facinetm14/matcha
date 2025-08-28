import express, { Express, Request, Response } from 'express';
import { Server } from 'http';

export const runApp = (app: Express, port: number): Server => {
  app.use(express.json());

  const baseApi = process.env.BASE_API ?? '/api/v1/';

  app.get(baseApi, (req: Request, res: Response) => {
    res.send({
      greeting: 'top',
    });
  });

  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  return server;
};
