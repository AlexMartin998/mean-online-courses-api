import { Request, Response } from 'express';

import { UnauthorizedError } from '@/auth/domain/errors';
import { RegisterUser } from '@/auth/domain/use-cases';
import { DomainError, ResourceNotFoundError } from '@/shared/domain';

export class AuthController {
  ///* DI
  constructor(private readonly userRegistrator: RegisterUser) {}

  register = async (req: Request, res: Response) => {
    try {
      const userToken = await this.userRegistrator.run(req.body);

      return res.status(201).json(userToken);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof UnauthorizedError)
      return res.status(401).json({ error: error.message });
    if (error instanceof ResourceNotFoundError)
      return res.status(404).json({ error: error.message });

    if (error instanceof DomainError)
      return res.status(400).json({ error: error.message });

    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };
}