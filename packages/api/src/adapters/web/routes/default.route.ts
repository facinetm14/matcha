import { Request, Response, Router } from 'express';

const DefaultRouter = Router();

DefaultRouter.get(`/`, (req: Request, resp: Response) => {
  resp.send({
    greeting: 'welcome to matcha Api',
  });
});

export default DefaultRouter;
