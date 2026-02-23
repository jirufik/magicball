import { Router, type Request, type Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.render('index', { title: 'Magic Ball' });
});

export default router;
