import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const requireRole = (...roles) =>
  asyncHandler(async (req, _res, next) => {
    if (!req.user?.id) {
      throw new AppError('Usuario no autenticado', 401);
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !profile) {
      throw new AppError('Perfil de usuario no encontrado', 403);
    }

    if (profile.is_active === false) {
      throw new AppError('El usuario se encuentra desactivado', 403);
    }

    if (!roles.includes(profile.role)) {
      throw new AppError('No tienes permisos para realizar esta accion', 403);
    }

    req.profile = profile;
    next();
  });
