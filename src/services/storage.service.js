import crypto from 'node:crypto';
import path from 'node:path';
import { env } from '../config/env.js';
import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../utils/AppError.js';

const extensionByMime = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

export const buildPublicUrl = (filePath) => {
  const { data } = supabaseAdmin.storage.from(env.SUPABASE_STORAGE_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
};

export const uploadProductImage = async (file) => {
  if (!file) return null;

  const extension = extensionByMime[file.mimetype] || path.extname(file.originalname);
  const filePath = `products/${Date.now()}-${crypto.randomUUID()}${extension}`;

  const { error } = await supabaseAdmin.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new AppError(error.message, 400);
  }

  return {
    path: filePath,
    publicUrl: buildPublicUrl(filePath),
  };
};

export const deleteProductImage = async (filePath) => {
  if (!filePath) return;

  const { error } = await supabaseAdmin.storage.from(env.SUPABASE_STORAGE_BUCKET).remove([filePath]);

  if (error) {
    throw new AppError(error.message, 400);
  }
};
