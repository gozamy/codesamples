import type { FastifyError, FastifyInstance } from 'fastify';

import { AppError } from '../app/errors.js';

export const registerErrorHandler = (
  app: FastifyInstance,
): void => {
  app.setErrorHandler(
    (
      error: FastifyError,
      request,
      reply,
    ) => {
      request.log.error(error);

      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          error: {
            code: error.code,
            message: error.message,
          },
        });
      }

      if (error.validation) {
        return reply.status(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Request validation failed',
            details: error.validation,
          },
        });
      }

      return reply.status(500).send({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
        },
      });
    },
  );
};