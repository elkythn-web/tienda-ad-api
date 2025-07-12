import { Request, Response, NextFunction } from 'express';

// Middleware para registrar las rutas accedidas
export const routeLog = (req: Request, res: Response, next: NextFunction) => {
    console.log(`Ruta accedida: ${req.method} ${req.originalUrl}`);
    next();
};
